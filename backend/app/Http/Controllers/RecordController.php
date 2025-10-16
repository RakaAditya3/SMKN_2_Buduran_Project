<?php

namespace App\Http\Controllers;

use App\Models\Record;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redis;
use Carbon\Carbon;

class RecordController extends Controller
{
    /**
     * 🧾 Menampilkan daftar record untuk student login.
     */
    public function index(Request $request): JsonResponse
    {
        $student = Auth::guard('student')->user();

        if (!$student) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        $query = Record::with('ebook')
            ->where('student_id', $student->id);

        // Filter tanggal
        if ($request->has('date') && $request->date) {
            $date = $request->date;
            $filterType = $request->get('filter_type', 'specific');

            if ($filterType === 'before') {
                $query->where('borrowed_at', '<=', $date . ' 23:59:59');
            } else {
                $query->whereDate('borrowed_at', $date);
            }
        }

        $records = $query->orderBy('borrowed_at', 'desc')->get();

        return response()->json($records);
    }

    /**
     * 🧾 Menampilkan semua record (admin).
     */
    public function indexAdmin(Request $request): JsonResponse
    {
        $query = Record::with(['ebook', 'student']);

        // Filter tanggal
        if ($request->has('date') && $request->date) {
            $date = $request->date;
            $filterType = $request->get('filter_type', 'specific');

            if ($filterType === 'before') {
                $query->where('borrowed_at', '<=', $date . ' 23:59:59');
            } else {
                $query->whereDate('borrowed_at', $date);
            }
        }

        // Filter status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $records = $query->orderBy('borrowed_at', 'desc')->get();

        return response()->json([
            'data' => $records
        ]);
    }

    /**
     * 💾 Simpan transaksi baru (peminjaman eBook).
     * Gunakan Redis Stream sebagai antrian realtime.
     */
    public function store(Request $request): JsonResponse
    {
        $student = Auth::guard('student')->user();

        $request->validate([
            'ebook_id' => 'required|exists:ebooks,id',
            'borrowed_at' => 'required|date',
            'returned_at' => 'nullable|date|after_or_equal:borrowed_at',
        ]);

        $borrowed = Carbon::parse($request->borrowed_at);
        $returned = Carbon::parse($request->returned_at ?? $borrowed->copy()->addDays(7));

        if ($borrowed->diffInDays($returned) > 7) {
            return response()->json([
                'message' => 'Maksimal peminjaman adalah 7 hari'
            ], 422);
        }

        // Simpan ke database
        $record = Record::create([
            'student_id' => $student->id,
            'ebook_id' => $request->ebook_id,
            'borrowed_at' => $borrowed,
            'returned_at' => $returned,
            'status' => 'borrowed',
        ]);

        $record->load('ebook', 'student');

        // ================================================================
        // 🚀 OPTIMALISASI: SIMPAN LOG TRANSAKSI KE REDIS STREAM
        // ================================================================
        // Gunakan key khusus agar tidak bentrok dengan cache news/ebook
        $streamKey = 'stream:records';

        // Tambahkan data transaksi ke Redis Stream
        Redis::xadd($streamKey, '*', [
            'record_id' => $record->id,
            'student_id' => $student->id,
            'student_name' => $record->student->name ?? '-',
            'ebook_id' => $record->ebook_id,
            'ebook_title' => $record->ebook->title ?? '-',
            'status' => 'borrowed',
            'borrowed_at' => $borrowed->toDateTimeString(),
            'returned_at' => $returned->toDateTimeString(),
        ]);

        // Batasi agar hanya menyimpan 1000 transaksi terakhir
        Redis::xtrim($streamKey, 1000);
        // ================================================================

        return response()->json([
            'message' => 'Record created successfully',
            'record' => $record,
        ], 201);
    }

    /**
     * 📦 Update status peminjaman (dikembalikan, hilang, dsb).
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|string|in:Dipinjam,Dikembalikan,Hilang,borrowed,returned,lost',
            'returned_at' => 'nullable|date',
        ]);

        // Normalisasi status (indo → english)
        $statusMap = [
            'dipinjam' => 'borrowed',
            'dikembalikan' => 'returned',
            'hilang' => 'lost',
        ];

        $status = strtolower($request->status);
        $normalizedStatus = $statusMap[$status] ?? $status;

        $record = Record::findOrFail($id);
        $record->status = $normalizedStatus;
        $record->returned_at = $request->returned_at ?? null;
        $record->save();

        // ================================================================
        // 🌀 Tambahkan log perubahan status ke Redis Stream juga
        // ================================================================
        $streamKey = 'stream:records';
        Redis::xadd($streamKey, '*', [
            'record_id' => $record->id,
            'student_id' => $record->student_id,
            'ebook_id' => $record->ebook_id,
            'status' => $normalizedStatus,
            'updated_at' => now()->toDateTimeString(),
        ]);
        Redis::xtrim($streamKey, 1000);
        // ================================================================

        return response()->json([
            'message' => 'Status updated successfully',
            'record' => $record->load('ebook'),
        ]);
    }
}
