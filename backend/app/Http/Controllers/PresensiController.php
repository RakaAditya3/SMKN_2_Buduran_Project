<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Presensi;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\RfidLog;
use App\Models\Student;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Log;

class PresensiController extends Controller
{
    /**
     * Menampilkan daftar presensi (cached selama 10 menit)
     */
    public function index(Request $request)
    {
        try {
            $kelas = $request->input('kelas') ?? 'all';
            $jurusan = $request->input('jurusan') ?? 'all';
            $date = Carbon::today()->toDateString();

            // ✅ Key cache unik berdasarkan filter
            $cacheKey = "presensi_list_{$date}_kelas_{$kelas}_jurusan_{$jurusan}";

            // ✅ Gunakan tag agar cache presensi bisa diflush tanpa ganggu cache lain
            $presensis = Cache::tags('presensi')->remember($cacheKey, 600, function () use ($kelas, $jurusan) {
                $query = Presensi::with('student:id,nama,nisn,kelas,jurusan,no_absen')
                    ->orderBy('date', 'desc');

                $query->when($kelas !== 'all', fn($q) =>
                    $q->whereHas('student', fn($s) => $s->where('kelas', $kelas))
                );
                $query->when($jurusan !== 'all', fn($q) =>
                    $q->whereHas('student', fn($s) => $s->where('jurusan', $jurusan))
                );

                return $query->get()->map(function ($p) {
                    return [
                        'id'        => $p->id,
                        'nama'      => $p->student->nama ?? '-',
                        'nisn'      => $p->student->nisn ?? '-',
                        'kelas'     => $p->student->kelas ?? '-',
                        'jurusan'   => $p->student->jurusan ?? '-',
                        'no_absen'  => $p->student->no_absen ?? '-',
                        'status'    => $p->status,
                        'date'      => $p->date,
                    ];
                });
            });

            return response()->json([
                'success' => true,
                'data'    => $presensis,
            ]);
        } catch (\Throwable $e) {
            Log::error('Presensi index error', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data presensi',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Memproses presensi hari ini dari RFID logs
     * + Realtime publish ke Redis Stream & flush cache.
     */
    public function processToday()
    {
        try {
            $today = Carbon::today();

            $scannedUids = RfidLog::whereDate('scanned_at', $today)
                ->pluck('uid')
                ->unique()
                ->toArray();

            $students = Student::all();
            $hadir = 0;
            $tidakHadir = 0;

            foreach ($students as $student) {
                $status = in_array($student->uid, $scannedUids)
                    ? 'hadir'
                    : 'tidak hadir';

                Presensi::updateOrCreate(
                    ['student_id' => $student->id, 'date' => $today],
                    ['status' => $status]
                );

                $status === 'hadir' ? $hadir++ : $tidakHadir++;
            }

            // ===================================================
            // 🔄 Redis Stream (realtime)
            // ===================================================
            $streamKey = 'stream:presensi';
            $channel = 'channel:presensi';
            $summary = [
                'date' => $today->toDateString(),
                'total_students' => $students->count(),
                'hadir' => $hadir,
                'tidak_hadir' => $tidakHadir,
                'processed_at' => now()->toDateTimeString(),
            ];

            try {
                // ✅ Tambahkan ke Redis Stream
                Redis::xadd($streamKey, '*', collect($summary)->mapWithKeys(fn($v, $k) => [$k => (string)$v])->toArray());

                // ✅ Batasi panjang stream & atur TTL 15 menit
                Redis::xtrim($streamKey, 1000);
                Redis::expire($streamKey, 900);

                // ✅ Publish notifikasi realtime
                Redis::publish($channel, json_encode($summary));
            } catch (\Throwable $e) {
                Log::warning('Redis stream/publish failed', ['error' => $e->getMessage()]);
            }

            // ===================================================
            // 🧹 Flush Cache
            // ===================================================
            try {
                Cache::tags('presensi')->flush();
            } catch (\Throwable $e) {
                Log::warning('Cache flush failed', ['error' => $e->getMessage()]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Presensi hari ini berhasil diproses',
                'total_siswa' => $students->count(),
                'hadir' => $hadir,
                'tidak_hadir' => $tidakHadir,
            ]);
        } catch (\Throwable $e) {
            Log::error('Presensi processToday error', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses presensi hari ini',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
