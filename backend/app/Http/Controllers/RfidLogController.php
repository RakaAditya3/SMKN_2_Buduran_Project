<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\RfidLog;
use Carbon\Carbon;

class RfidLogController extends Controller
{
    /**
     * 📥 Simpan hasil scan RFID ke database + cache sementara (2 menit)
     */
    public function store(Request $request)
    {
        try {
            $uid = strtoupper(trim($request->uid));

            // ✅ Validasi input UID
            if (empty($uid)) {
                return response()->json(['message' => 'UID tidak boleh kosong.'], 422);
            }

            // ✅ Simpan ke database
            RfidLog::create([
                'uid' => $uid,
                'scanned_at' => Carbon::now(),
            ]);

            // ✅ Cari data siswa berdasarkan UID
            $student = Student::where('uid', $uid)->first();

            // ✅ Simpan hasil ke cache (TTL = 2 menit)
            $cacheKey = "rfid_stream:{$uid}";
            Cache::put($cacheKey, $student?->nama ?? null, now()->addMinutes(2));

            // ✅ Return data clean
            return response()->json([
                'uid' => $uid,
                'student' => $student?->nama,
                'cached_until' => now()->addMinutes(2)->toISOString(),
                'found' => (bool) $student,
            ], 201);
        } catch (\Throwable $e) {
            Log::error('🔥 RFID Store Error', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return response()->json(['message' => 'Gagal menyimpan log RFID.'], 500);
        }
    }

    /**
     * 🔍 Periksa apakah hasil scan UID masih tersedia di cache
     */
    public function checkScan($uid)
    {
        try {
            $uid = strtoupper(trim($uid));
            $cacheKey = "rfid_stream:{$uid}";
            $studentName = Cache::get($cacheKey);

            // ✅ Jika ada di cache
            if ($studentName) {
                return response()->json([
                    'uid' => $uid,
                    'student' => $studentName,
                    'cached' => true,
                ], 200);
            }

            // ✅ Jika tidak ada di cache
            return response()->json([
                'uid' => $uid,
                'student' => null,
                'cached' => false,
            ], 200);
        } catch (\Throwable $e) {
            Log::error('🔥 RFID Cache Check Error', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return response()->json(['message' => 'Gagal memeriksa cache RFID.'], 500);
        }
    }
}
