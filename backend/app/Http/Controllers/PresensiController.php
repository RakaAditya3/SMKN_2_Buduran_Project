<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Presensi;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\RfidLog;
use App\Models\Student;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class PresensiController extends Controller
{
    /**
     * Menampilkan daftar presensi.
     * Menggunakan cache singkat (10 menit) dengan tag 'presensi' agar tidak menabrak cache lain.
     */
    public function index(Request $request)
    {
        try {
            $kelas = $request->input('kelas') ?? 'all';
            $jurusan = $request->input('jurusan') ?? 'all';
            $date = $request->input('date') ?? Carbon::today()->toDateString();

            // Buat cache key yang unik berdasarkan filter
            $cacheKey = "presensi_list_{$date}_kelas_{$kelas}_jurusan_{$jurusan}";

            // Gunakan tag 'presensi' supaya flush terpisah dari module lain
            $presensis = Cache::tags('presensi')->remember($cacheKey, 600, function () use ($kelas, $jurusan, $date) {
                $query = Presensi::with('student:id,nama,nisn,kelas,jurusan,no_absen')
                    ->whereDate('date', $date)
                    ->orderBy('date', 'desc');

                $query->when($kelas !== 'all', fn($q) => $q->whereHas('student', fn($s) => $s->where('kelas', $kelas)));
                $query->when($jurusan !== 'all', fn($q) => $q->whereHas('student', fn($s) => $s->where('jurusan', $jurusan)));

                return $query->get()->map(function ($p) {
                    return [
                        'id' => $p->id,
                        'nama' => $p->student->nama ?? '-',
                        'nisn' => $p->student->nisn ?? '-',
                        'kelas' => $p->student->kelas ?? '-',
                        'jurusan' => $p->student->jurusan ?? '-',
                        'no_absen' => $p->student->no_absen ?? '-',
                        'status' => $p->status,
                        'date' => $p->date,
                    ];
                });
            });

            return response()->json(['success' => true, 'data' => $presensis]);
        } catch (\Throwable $e) {
            Log::error('Presensi index error', ['error' => $e->getMessage(), 'line' => $e->getLine()]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data presensi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Memproses presensi hari ini dari RFID logs.
     *
     * Implementasi optimasi realtime:
     * - Tulis hasil ke DB (updateOrCreate) seperti biasa.
     * - Tambah event ke Redis Stream (stream:presensi) via XADD.
     * - Batasi panjang stream via XTRIM dan set EXPIRE (10-15 menit).
     * - Publish notifikasi realtime ke channel: channel:presensi
     * - Flush cache tag 'presensi' agar index berikutnya mengambil data terbaru dari DB.
     */
    public function processToday()
    {
        try {
            $today = Carbon::today();

            // Ambil semua UID unik yang ter-scan hari ini dari table rfid_logs
            $scannedUids = RfidLog::whereDate('scanned_at', $today)
                ->pluck('uid')
                ->unique()
                ->toArray();

            $students = Student::all();
            $hadir = 0;
            $tidakHadir = 0;

            foreach ($students as $student) {
                $status = in_array($student->uid, $scannedUids) ? 'hadir' : 'tidak hadir';

                // Simpan ke database (commit utama)
                Presensi::updateOrCreate(
                    ['student_id' => $student->id, 'date' => $today],
                    ['status' => $status]
                );

                $status === 'hadir' ? $hadir++ : $tidakHadir++;
            }

            // ============================================================
            // Redis Stream & Pub/Sub (realtime)
            // ============================================================
            // Key stream dan channel dipisah untuk menghindari tabrakan
            $streamKey = 'stream:presensi';
            $channel = 'channel:presensi';

            // Tambahkan satu event summary ke stream (XADD)
            $summary = [
                'date' => $today->toDateString(),
                'total_students' => $students->count(),
                'hadir' => $hadir,
                'tidak_hadir' => $tidakHadir,
                'processed_at' => now()->toDateTimeString(),
            ];

            // XADD - '*' untuk auto id
            Redis::xadd($streamKey, '*', $summary);

            // XTRIM - batasi jumlah event terakhir (misal 1000) untuk mencegah memori penuh
            Redis::xtrim($streamKey, 1000);

            // Set expire agar stream otomatis hilang setelah 15 menit (900 detik)
            // Jika ingin 10 menit, ubah menjadi 600
            $expireSeconds = 900; // 900 = 15 menit
            Redis::expire($streamKey, $expireSeconds);

            // Publish notifikasi singkat ke channel untuk subscriber realtime (websocket/worker)
            try {
                Redis::publish($channel, json_encode($summary));
            } catch (\Throwable $e) {
                // Publish tidak boleh menghentikan flow utama; log saja
                Log::warning('Redis publish failed for presensi channel', ['error' => $e->getMessage()]);
            }
            // ============================================================

            // Bersihkan cache presensi agar index di-refresh
            try {
                Cache::tags('presensi')->flush();
            } catch (\Throwable $e) {
                // Jika cache tagging tidak tersedia (driver tidak mendukung tags), fallback: hapus known keys prefix
                Log::warning('Cache::tags flush failed (maybe unsupported).', ['error' => $e->getMessage()]);
                // opsional: dapat implementasikan scan/keys then delete, dihindari di production
            }

            return response()->json([
                'success' => true,
                'message' => 'Presensi hari ini berhasil diproses',
                'total_siswa' => $students->count(),
                'hadir' => $hadir,
                'tidak_hadir' => $tidakHadir,
            ]);
        } catch (\Throwable $e) {
            Log::error('Presensi processToday error', ['error' => $e->getMessage(), 'line' => $e->getLine()]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses presensi hari ini',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
