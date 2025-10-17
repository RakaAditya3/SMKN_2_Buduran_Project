<?php

namespace App\Http\Controllers;

use App\Models\Presensi;
use App\Models\Student;
use App\Models\RfidLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class PresensiController extends Controller
{
    /**
     * 🧾 Ambil daftar presensi (cached 10 menit)
     */
    public function index(Request $request)
    {
        try {
            $kelas = $request->input('kelas', 'all');
            $jurusan = $request->input('jurusan', 'all');
            $date = Carbon::today()->toDateString();

            // 🔹 Cache key unik berdasarkan filter
            $cacheKey = "presensi_list_{$date}_kelas_{$kelas}_jurusan_{$jurusan}";

            // 🔹 Cache 10 menit
            $presensi = Cache::tags('presensi')->remember($cacheKey, 600, function () use ($kelas, $jurusan) {
                $query = Presensi::with('student:id,nama,nisn,kelas,jurusan,no_absen')
                    ->orderByDesc('date');

                if ($kelas !== 'all') {
                    $query->whereHas('student', fn($s) => $s->where('kelas', $kelas));
                }

                if ($jurusan !== 'all') {
                    $query->whereHas('student', fn($s) => $s->where('jurusan', $jurusan));
                }

                return $query->get()->map(fn($p) => [
                    'id'        => $p->id,
                    'nama'      => $p->student->nama ?? '-',
                    'nisn'      => $p->student->nisn ?? '-',
                    'kelas'     => $p->student->kelas ?? '-',
                    'jurusan'   => $p->student->jurusan ?? '-',
                    'no_absen'  => $p->student->no_absen ?? '-',
                    'status'    => $p->status,
                    'date'      => $p->date,
                ]);
            });

            return response()->json($presensi, 200);
        } catch (\Throwable $e) {
            Log::error('🔥 Presensi index error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Gagal mengambil data presensi'], 500);
        }
    }

    /**
     * 🔄 Proses presensi hari ini berdasarkan RFID logs
     * + Realtime publish ke Redis Stream & flush cache
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
                $status = in_array($student->uid, $scannedUids) ? 'hadir' : 'tidak hadir';

                Presensi::updateOrCreate(
                    ['student_id' => $student->id, 'date' => $today],
                    ['status' => $status]
                );

                $status === 'hadir' ? $hadir++ : $tidakHadir++;
            }

            // ===================================================
            // 🚀 Redis Stream + Publish (Realtime)
            // ===================================================
            $streamKey = 'stream:presensi';
            $channel = 'channel:presensi';
            $summary = [
                'date'           => $today->toDateString(),
                'total_students' => $students->count(),
                'hadir'          => $hadir,
                'tidak_hadir'    => $tidakHadir,
                'processed_at'   => now()->toDateTimeString(),
            ];

            try {
                Redis::xadd($streamKey, '*', collect($summary)->mapWithKeys(fn($v, $k) => [$k => (string)$v])->toArray());
                Redis::xtrim($streamKey, 1000);
                Redis::expire($streamKey, 900);
                Redis::publish($channel, json_encode($summary));
            } catch (\Throwable $e) {
                Log::warning('⚠️ Redis stream/publish gagal', ['error' => $e->getMessage()]);
            }

            // ===================================================
            // 🧹 Flush Cache
            // ===================================================
            try {
                Cache::tags('presensi')->flush();
            } catch (\Throwable $e) {
                Log::warning('⚠️ Cache flush gagal', ['error' => $e->getMessage()]);
            }

            // ✅ Return clean data summary
            return response()->json($summary, 200);
        } catch (\Throwable $e) {
            Log::error('🔥 Presensi processToday error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Gagal memproses presensi hari ini'], 500);
        }
    }
}
