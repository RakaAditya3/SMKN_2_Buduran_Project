<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AchievementService;
use Illuminate\Http\Request;

class AchievementController extends Controller
{
    protected $achievementService;

    public function __construct(AchievementService $achievementService)
    {
        $this->achievementService = $achievementService;
    }

    public function index(Request $request)
    {
        $achievements = $this->achievementService->search($request->all());
        return response()->json($achievements);
    }

    public function store(Request $request)
    {
        $id = $request->input('id');
        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'student_name' => 'required|string',
            'slug' => 'required|string|unique:achievements,slug,' . $id,
            'published_at' => 'required|date',
            'category_id' => 'required|exists:categories,id',
            'thumbnail' => 'required|string',
        ];
        $validatedData = $request->validate($rules);

        if ($id) {
            $achievement = $this->achievementService->update($validatedData, $id);
            $message = 'Prestasi berhasil diperbarui.';
        } else {
            $achievement = $this->achievementService->store($validatedData);
            $message = 'Prestasi berhasil ditambahkan.';
        }

        return response()->json(['success' => true, 'message' => $message, 'data' => $achievement]);
    }

    public function show($id)
    {
        $achievement = $this->achievementService->find($id);
        if (!$achievement) {
            return response()->json(['error' => 'Prestasi tidak ditemukan.'], 404);
        }
        return response()->json($achievement);
    }

    public function destroy($id)
    {
        $result = $this->achievementService->delete($id);
        if (isset($result['error'])) {
            return response()->json(['error' => $result['error']], 400);
        }
        return response()->json(['success' => 'Prestasi berhasil dihapus.']);
    }
}