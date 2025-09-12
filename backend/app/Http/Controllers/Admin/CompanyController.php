<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\CompanyService;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    protected $companyService;

    public function __construct(CompanyService $companyService)
    {
        $this->companyService = $companyService;
    }

    public function index(Request $request)
    {
        $companies = $this->companyService->search($request->all());
        return response()->json($companies);
    }

    public function store(Request $request)
    {
        $id = $request->input('id');
        $rules = [
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'website' => 'nullable|string',
            'logo' => 'nullable|string',
        ];
        $validatedData = $request->validate($rules);

        if ($id) {
            $company = $this->companyService->update($validatedData, $id);
            $message = 'Perusahaan berhasil diperbarui.';
        } else {
            $company = $this->companyService->store($validatedData);
            $message = 'Perusahaan berhasil ditambahkan.';
        }

        return response()->json(['success' => true, 'message' => $message, 'data' => $company]);
    }

    public function show($id)
    {
        $company = $this->companyService->find($id);
        if (!$company) {
            return response()->json(['error' => 'Perusahaan tidak ditemukan.'], 404);
        }
        return response()->json($company);
    }

    public function destroy($id)
    {
        $result = $this->companyService->delete($id);
        if (isset($result['error'])) {
            return response()->json(['error' => $result['error']], 400);
        }
        return response()->json(['success' => 'Perusahaan berhasil dihapus.']);
    }
}
