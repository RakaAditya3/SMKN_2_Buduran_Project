<?php

namespace App\Http\Controllers;

use App\Models\Record;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\PersonalAccessToken;
use Carbon\Carbon;

class RecordController extends Controller
{
    private function getAuthenticatedStudent(Request $request)
    {
        try {
            $authHeader = $request->header('Authorization');

            if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
                return null;
            }

            $token = trim(str_replace('Bearer', '', $authHeader));
            $accessToken = PersonalAccessToken::findToken($token);

            if (!$accessToken) return null;

            return $accessToken->tokenable;
        } catch (\Throwable $e) {
            Log::error('Token parsing error', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Tampilkan semua record milik student
     */
    public function index(Request $request): JsonResponse
    {
        $student = $this->getAuthenticatedStudent($request);

        if (!$student) {
            return response()->json([], 401); // 🔹 kembalikan array kosong agar frontend aman
        }

        $query = Record::with('ebook')->where('student_id', $student->id);

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

        // 🔥 RETURN LANGSUNG ARRAY, bukan object wrapper
        return response()->json($records);
    }

    /**
     * Admin: tampilkan semua record
     */
    public function indexAdmin(Request $request): JsonResponse
    {
        $query = Record::with(['ebook', 'student']);

        if ($request->has('date') && $request->date) {
            $date = $request->date;
            $filterType = $request->get('filter_type', 'specific');

            if ($filterType === 'before') {
                $query->where('borrowed_at', '<=', $date . ' 23:59:59');
            } else {
                $query->whereDate('borrowed_at', $date);
            }
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $records = $query->orderBy('borrowed_at', 'desc')->get();

        // 🔥 return array langsung
        return response()->json($records);
    }

    /**
     * Tambah record baru
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
            'student_id' => $student->id,
            'ebook_id' => $request->ebook_id,
            'borrowed_at' => $borrowed,
            'returned_at' => $returned,
            'status' => 'borrowed',
        ]);

        return response()->json($record, 201);
    }

    /**
     * Update status
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

        $record = Record::findOrFail($id);
        $record->status = $normalizedStatus;
        $record->returned_at = $request->returned_at ?? null;
        $record->save();

        return response()->json($record);
    }
}
