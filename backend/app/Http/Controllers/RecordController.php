<?php

namespace App\Http\Controllers;

use App\Models\Record;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Record::with('ebook');

        // Filter by date
        if ($request->has('date') && $request->date) {
            $date = $request->date;
            $filterType = $request->get('filter_type', 'specific'); // 'specific' or 'before'

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
        $request->validate([
            'user_name' => 'required|string|max:255',
            'nisn' => 'required|string|max:20',
            'ebook_id' => 'required|exists:ebooks,id',
            'borrowed_at' => 'required|date',
            'returned_at' => 'nullable|date|after:borrowed_at',
        ]);

        $data = $request->all();
        $data['status'] = 'Dipinjam';

        $record = Record::create($data);

        return response()->json([
            'message' => 'Record created successfully',
            'record' => $record->load('ebook'),
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