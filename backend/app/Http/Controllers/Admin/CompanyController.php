<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Services\CompanyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class CompanyController extends Controller
{
    protected $companyService;

    public function __construct(CompanyService $companyService)
    {
        $this->companyService = $companyService;
    }

   public function index(Request $request)
{
    $companies = \App\Models\Company::all()->map(function ($company) {
        // Jika logo belum full URL, ubah ke absolute URL
        if ($company->logo && !str_starts_with($company->logo, 'http')) {
            $company->logo = url($company->logo);
        }
        return $company;
    });

    return response()->json($companies);
}


    public function store(Request $request)
    {
        try {
            $id = $request->input('id');

            $rules = [
                'name'    => 'required|string|max:255',
                'address' => 'required|string',
                'website' => 'nullable|string',
                'logo'    => 'nullable|image|mimes:jpeg,png,jpg,webp,svg|max:2048',
            ];

            $validated = $request->validate($rules);

            $imageUrl = null;


            if ($request->hasFile('logo')) {
                $image = $request->file('logo');
                $fileName = 'company_' . Str::random(40) . '.' . $image->getClientOriginalExtension();


                $image->storeAs('public/companies', $fileName);

           
                $imageUrl = asset('storage/companies/' . $fileName);
                $validated['logo'] = $imageUrl;
            }

            if ($id) {
                $company = $this->companyService->update($validated, $id);
                $message = 'Perusahaan berhasil diperbarui.';
            } else {
                $company = $this->companyService->store($validated);
                $message = 'Perusahaan berhasil ditambahkan.';
            }

            return response()->json([
                'success' => true,
                'message' => $message,
                'data'    => $company,
            ]);
        } catch (\Throwable $e) {
            \Log::error('🔥 Company store error', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $rules = [
                'name'    => 'required|string|max:255',
                'address' => 'required|string',
                'website' => 'nullable|string',
                'logo'    => 'nullable|image|max:2048',
            ];

            $validated = $request->validate($rules);

            $company = Company::findOrFail($id);
            $imageUrl = $company->logo;

        
            if ($request->hasFile('logo')) {
 
                if ($company->logo && str_contains($company->logo, '/storage/companies/')) {
                    $oldPath = str_replace(asset('storage/'), '', $company->logo);
                    Storage::delete('public/' . $oldPath);
                }

                $image = $request->file('logo');
                $fileName = 'company_' . Str::random(40) . '.' . $image->getClientOriginalExtension();

                $image->storeAs('public/companies', $fileName);
                $imageUrl = asset('storage/companies/' . $fileName);
            }

            $company->update([
                'name'    => $validated['name'],
                'address' => $validated['address'],
                'website' => $validated['website'] ?? null,
                'logo'    => $imageUrl,
            ]);

            return response()->json([
                'success' => true,
                'message' => '✅ Perusahaan berhasil diperbarui.',
                'data'    => $company,
            ]);
        } catch (\Throwable $e) {
            \Log::error('🔥 Company update error', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
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
        try {
            $company = Company::findOrFail($id);

            if ($company->logo && str_contains($company->logo, '/storage/companies/')) {
                $filePath = str_replace(asset('storage/'), '', $company->logo);
                Storage::delete('public/' . $filePath);
            }

            $this->companyService->delete($id);

            return response()->json([
                'success' => true,
                'message' => '🗑️ Perusahaan berhasil dihapus.',
            ]);
        } catch (\Throwable $e) {
            \Log::error('🔥 Company delete error', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
