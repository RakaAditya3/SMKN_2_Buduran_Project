<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AlumnyService;
use Illuminate\Http\Request;

class AlumnyController extends Controller
{
    protected $alumnyService;

    public function __construct(AlumnyService $alumnyService)
    {
        $this->alumnyService = $alumnyService;
    }

    public function index(Request $request)
    {
        $alumni = $this->alumnyService->search($request->all());
        return response()->json($alumni);
    }

    public function store(Request $request)
    {
        $id = $request->input('id');
        $rules = [
            'name' => 'required|string|max:255',
            'batch' => 'required|integer',
            'company_id' => 'required|exists:companies,id',
            'photo' => 'nullable|string',
        ];
        $validatedData = $request->validate($rules);

        if ($id) {
            $alumny = $this->alumnyService->update($validatedData, $id);
            $message = 'Alumni berhasil diperbarui.';
        } else {
            $alumny = $this->alumnyService->store($validatedData);
            $message = 'Alumni berhasil ditambahkan.';
        }

        return response()->json(['success' => true, 'message' => $message, 'data' => $alumny]);
    }

    public function show($id)
    {
        $alumny = $this->alumnyService->find($id);
        if (!$alumny) {
            return response()->json(['error' => 'Alumni tidak ditemukan.'], 404);
        }
        return response()->json($alumny);
    }

    public function destroy($id)
    {
        $result = $this->alumnyService->delete($id);
        if (isset($result['error'])) {
            return response()->json(['error' => $result['error']], 400);
        }
        return response()->json(['success' => 'Alumni berhasil dihapus.']);
    }
}
