<?php

namespace App\Http\Controllers;

use App\Models\Record;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class RecordController extends Controller
{
    /**
     * Display a listing of the resource.
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
     * Store a newly created resource in storage.
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

    $record = Record::create([
        'student_id' => $student->id,
        'ebook_id' => $request->ebook_id,
        'borrowed_at' => $borrowed,
        'returned_at' => $returned,
        'status' => 'Dipinjam',
    ]);


    $record->load('ebook', 'student');

    return response()->json([
        'message' => 'Record created successfully',
        'record' => $record,
    ], 201);
}



    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Update the status of a record.
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|string|in:Dipinjam,Dikembalikan,Hilang',
            'returned_at' => 'nullable|date',
        ]);

        $record = Record::findOrFail($id);
        $record->status = $request->status;
        $record->returned_at = $request->returned_at ?? null;
        $record->save();

        return response()->json([
            'message' => 'Status updated successfully',
            'record' => $record->load('ebook'),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}