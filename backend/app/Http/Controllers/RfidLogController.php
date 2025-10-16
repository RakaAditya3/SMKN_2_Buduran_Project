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
     * Simpan log hasil scan RFID ke database + cache sementara (1–2 menit).
     */
    public function store(Request $request)
    {
        try {
            $uid = strtoupper(trim($request->uid));

            if (!$uid) {
                return response()->json([
                    'success' => false,
                    'message' => 'UID tidak boleh kosong.',
                ], 422);
            }

            // 🔹 Simpan log ke database
            RfidLog::create([
                'uid' => $uid,
                'scanned_at' => Carbon::now(),
            ]);

            // 🔹 Cari data siswa berdasarkan UID
            $student = Student::where('uid', $uid)->first();

            // 🔹 Simpan ke cache realtime (1–2 menit)
            // TTL pendek agar tidak menumpuk & tetap responsif
            $cacheKey = "rfid_stream:{$uid}";
            Cache::put($cacheKey, $student?->nama ?? null, now()->addSeconds(120));

            return response()->json([
                'success' => true,
                'uid' => $uid,
                'student' => $student?->nama,
                'message' => $student ? 'UID dikenali dan disimpan ke cache.' : 'UID tidak ditemukan di daftar siswa.',
                'cache_key' => $cacheKey,
                'status' => 'cached',
            ]);
        } catch (\Throwable $e) {
            Log::error('RFID Store Error', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memproses UID.',
            ], 500);
        }
    }

    /**
     * Cek apakah hasil scan RFID masih tersimpan di cache.
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
            Log::error('RFID Cache Check Error', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memeriksa cache RFID.',
            ], 500);
        }
    }
}
