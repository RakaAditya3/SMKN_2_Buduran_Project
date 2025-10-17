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
                return response()->json([
                    'success' => false,
                    'message' => 'UID tidak boleh kosong.',
                ], 422);
            }

            // ✅ Simpan ke database
            RfidLog::create([
                'uid' => $uid,
                'scanned_at' => Carbon::now(),
            ]);

            // ✅ Cek apakah UID terdaftar di data siswa
            $student = Student::where('uid', $uid)->first();

            // ✅ Simpan hasil ke cache (TTL = 2 menit)
            $cacheKey = "rfid_stream:{$uid}";
            Cache::put($cacheKey, $student?->nama ?? null, now()->addMinutes(2));

            return response()->json([
                'success' => true,
                'uid' => $uid,
                'student' => $student?->nama,
                'status' => 'cached',
                'cache_key' => $cacheKey,
                'message' => $student
                    ? 'UID dikenali dan disimpan sementara di cache.'
                    : 'UID tidak ditemukan di daftar siswa, tetapi tetap dicatat di log.',
            ]);
        } catch (\Throwable $e) {
            Log::error('RFID Store Error', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menyimpan log RFID.',
                'error' => $e->getMessage(),
            ], 500);
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

            if ($studentName) {
                return response()->json([
                    'success' => true,
                    'uid' => $uid,
                    'student' => $studentName,
                    'status' => 'cached',
                    'message' => 'Data RFID masih tersimpan sementara di cache.',
                ]);
            }

            return response()->json([
                'success' => false,
                'uid' => $uid,
                'student' => null,
                'status' => 'expired',
                'message' => 'Data cache sudah kedaluwarsa atau belum pernah disimpan.',
            ]);
        } catch (\Throwable $e) {
            Log::error('RFID Check Cache Error', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memeriksa cache RFID.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
