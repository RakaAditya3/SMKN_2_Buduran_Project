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
        try {
            $id = $request->input('id');

            $rules = [
                'name' => 'required|string|max:255',
                'address' => 'required|string',
                'website' => 'nullable|string',
                'logo' => 'nullable|file|mimetypes:image/jpeg,image/png,image/jpg,image/webp,image/svg+xml|max:2048',
            ];

            $validated = $request->validate($rules);

            $imageUrl = null;

            // 🔹 Upload ke Supabase kalau ada file logo
            if ($request->hasFile('logo')) {
                $image = $request->file('logo');
                $fileName = 'companies/' . \Str::random(40) . '.' . $image->getClientOriginalExtension();
                $bucket = 'images';

                $response = \Http::withToken(env('SUPABASE_KEY'))
                    ->attach('file', fopen($image->getRealPath(), 'r'), $fileName)
                    ->post(env('SUPABASE_URL') . "/storage/v1/object/$bucket/$fileName?upsert=true");

                if ($response->failed()) {
                    \Log::error('Supabase upload failed', [
                        'status' => $response->status(),
                        'body'   => $response->body(),
                    ]);

                    return response()->json([
                        'success' => false,
                        'message' => 'Upload logo gagal',
                        'error'   => $response->body(),
                    ], 500);
                }

                $imageUrl = rtrim(env('SUPABASE_URL'), '/') . "/storage/v1/object/public/$bucket/$fileName";
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
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getFile() . ':' . $e->getLine(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
{
    try {
        $rules = [
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'website' => 'nullable|string',
            'logo' => 'nullable|image|max:2048',
        ];

        $validated = $request->validate($rules);

        $company = \App\Models\Company::findOrFail($id);

        $imageUrl = $company->logo; 

        
        if ($request->hasFile('logo')) {
            $image = $request->file('logo');
            $fileName = 'companies/' . \Str::random(40) . '.' . $image->getClientOriginalExtension();
            $bucket = 'images';

            $response = \Http::withToken(env('SUPABASE_KEY'))
                ->attach('file', fopen($image->getRealPath(), 'r'), $fileName)
                ->post(env('SUPABASE_URL') . "/storage/v1/object/$bucket/$fileName?upsert=true");

            if ($response->failed()) {
                \Log::error('Supabase upload failed', [
                    'status' => $response->status(),
                    'body'   => $response->body(),
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Upload logo gagal',
                    'error'   => $response->body(),
                ], 500);
            }

            $imageUrl = rtrim(env('SUPABASE_URL'), '/') . "/storage/v1/object/public/$bucket/$fileName";
        }

        $company->update([
            'name' => $validated['name'],
            'address' => $validated['address'],
            'website' => $validated['website'] ?? null,
            'logo' => $imageUrl,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Perusahaan berhasil diperbarui.',
            'data' => $company,
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage(),
            'trace' => $e->getFile() . ':' . $e->getLine(),
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
        $result = $this->companyService->delete($id);
        if (isset($result['error'])) {
            return response()->json(['error' => $result['error']], 400);
        }
        return response()->json(['success' => 'Perusahaan berhasil dihapus.']);
    }
}
