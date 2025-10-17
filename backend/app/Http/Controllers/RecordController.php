<?php

namespace App\Http\Controllers;

use App\Models\Record;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;
use Laravel\Sanctum\PersonalAccessToken;
use Carbon\Carbon;

class RecordController extends Controller
{
    /**
     * 🔐 Ambil student login dari token Sanctum
     */
    private function getAuthenticatedStudent(Request $request)
    {
        try {
            $authHeader = $request->header('Authorization');
            if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
                return null;
            }

            $token = trim(str_replace('Bearer', '', $authHeader));
            $accessToken = PersonalAccessToken::findToken($token);

            return $accessToken?->tokenable;
        } catch (\Throwable $e) {
            Log::error('Token parsing error', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * 🎓 Tampilkan semua record milik student login
     */
    public function index(Request $request): JsonResponse
    {
        $student = $this->getAuthenticatedStudent($request);
        if (!$student) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $query = Record::with('ebook')
            ->where('student_id', $student->id);

        if ($request->filled('date')) {
            $date = $request->date;
            $filterType = $request->get('filter_type', 'specific');
            $filterType === 'before'
                ? $query->where('borrowed_at', '<=', $date . ' 23:59:59')
                : $query->whereDate('borrowed_at', $date);
        }

        $records = $query->orderByDesc('borrowed_at')->get();
        return response()->json($records, 200);
    }

    /**
     * 🧑‍💼 Admin: tampilkan semua record
     */
    public function indexAdmin(Request $request): JsonResponse
    {
        $query = Record::with(['ebook', 'student']);

        if ($request->filled('date')) {
            $date = $request->date;
            $filterType = $request->get('filter_type', 'specific');
            $filterType === 'before'
                ? $query->where('borrowed_at', '<=', $date . ' 23:59:59')
                : $query->whereDate('borrowed_at', $date);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $records = $query->orderByDesc('borrowed_at')->get();
        return response()->json($records, 200);
    }

    /**
     * 💾 Tambah record baru (peminjaman eBook) + log ke Redis Stream
     */
    public function store(Request $request): JsonResponse
    {
        $student = $this->getAuthenticatedStudent($request);
        if (!$student) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'ebook_id' => 'required|exists:ebooks,id',
            'borrowed_at' => 'required|date',
            'returned_at' => 'nullable|date|after_or_equal:borrowed_at',
        ]);

        $borrowed = Carbon::parse($request->borrowed_at);
        $returned = Carbon::parse($request->returned_at ?? $borrowed->copy()->addDays(7));

        if ($borrowed->diffInDays($returned) > 7) {
            return response()->json(['message' => 'Maksimal peminjaman 7 hari'], 422);
        }

        $record = Record::create([
            'student_id'  => $student->id,
            'ebook_id'    => $request->ebook_id,
            'borrowed_at' => $borrowed,
            'returned_at' => $returned,
            'status'      => 'borrowed',
        ])->load('ebook', 'student');

        // 🚀 Tambahkan ke Redis Stream
        try {
            $streamKey = 'stream:records';
            Redis::xadd($streamKey, '*', [
                'record_id'     => (string)$record->id,
                'student_id'    => (string)$student->id,
                'student_name'  => $record->student->nama ?? '-',
                'ebook_id'      => (string)$record->ebook_id,
                'ebook_title'   => $record->ebook->title ?? '-',
                'status'        => 'borrowed',
                'borrowed_at'   => $borrowed->toDateTimeString(),
                'returned_at'   => $returned->toDateTimeString(),
            ]);
            Redis::xtrim($streamKey, 1000);
        } catch (\Throwable $e) {
            Log::warning('Redis XADD record gagal', ['error' => $e->getMessage()]);
        }

        return response()->json($record, 201);
    }

    /**
     * 🔄 Update status peminjaman + simpan ke Redis Stream
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|string|in:Dipinjam,Dikembalikan,Hilang,borrowed,returned,lost',
            'returned_at' => 'nullable|date',
        ]);

        $statusMap = [
            'dipinjam' => 'borrowed',
            'dikembalikan' => 'returned',
            'hilang' => 'lost',
        ];

        $status = strtolower($request->status);
        $normalizedStatus = $statusMap[$status] ?? $status;

        $record = Record::find($id);
        if (!$record) {
            return response()->json(['message' => 'Record tidak ditemukan'], 404);
        }

        $record->update([
            'status' => $normalizedStatus,
            'returned_at' => $request->returned_at,
        ]);

        // 🌀 Log ke Redis Stream
        try {
            $streamKey = 'stream:records';
            Redis::xadd($streamKey, '*', [
                'record_id'   => (string)$record->id,
                'student_id'  => (string)$record->student_id,
                'ebook_id'    => (string)$record->ebook_id,
                'status'      => $normalizedStatus,
                'updated_at'  => now()->toDateTimeString(),
            ]);
            Redis::xtrim($streamKey, 1000);
        } catch (\Throwable $e) {
            Log::warning('Redis XADD update record gagal', ['error' => $e->getMessage()]);
        }

        return response()->json($record, 200);
    }
}
