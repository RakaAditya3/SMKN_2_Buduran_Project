<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ExtracurricularService;
use Illuminate\Http\Request;

class ExtracurricularController extends Controller
{
    protected $extracurricularService;

    public function __construct(ExtracurricularService $extracurricularService)
    {
        $this->extracurricularService = $extracurricularService;
    }

    public function index(Request $request)
    {
        $extracurriculars = $this->extracurricularService->search($request->all());
        return response()->json($extracurriculars);
    }

    public function store(Request $request)
    {
        $id = $request->input('id');
        $rules = [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'thumbnail' => 'required|string',
            'images' => 'nullable|array',
        ];
        $validatedData = $request->validate($rules);

        if ($id) {
            $extracurricular = $this->extracurricularService->update($validatedData, $id);
            $message = 'Ekstrakurikuler berhasil diperbarui.';
        } else {
            $extracurricular = $this->extracurricularService->store($validatedData);
            $message = 'Ekstrakurikuler berhasil ditambahkan.';
        }

        return response()->json(['success' => true, 'message' => $message, 'data' => $extracurricular]);
    }

    public function show($id)
    {
        $extracurricular = $this->extracurricularService->find($id);
        if (!$extracurricular) {
            return response()->json(['error' => 'Ekstrakurikuler tidak ditemukan.'], 404);
        }
        return response()->json($extracurricular);
    }

    public function destroy($id)
    {
        $result = $this->extracurricularService->delete($id);
        if (isset($result['error'])) {
            return response()->json(['error' => $result['error']], 400);
        }
        return response()->json(['success' => 'Ekstrakurikuler berhasil dihapus.']);
    }
}
