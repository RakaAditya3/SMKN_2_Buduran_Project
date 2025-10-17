<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Services\CompanyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CompanyController extends Controller
{
    protected $companyService;

    public function __construct(CompanyService $companyService)
    {
        $this->companyService = $companyService;
    }

    /**
     * 🏢 Ambil semua perusahaan (cache 2 hari)
     */
    public function index(Request $request)
    {
        try {
            $cacheKey = 'company:index:' . md5(json_encode($request->all()));

            $companies = Cache::remember($cacheKey, now()->addDays(2), function () {
                return Company::latest()->get()->map(function ($company) {
                    if ($company->logo && !str_starts_with($company->logo, 'http')) {
                        $company->logo = url($company->logo);
                    }
                    return $company;
                });
            });

            return response()->json($companies, 200);
        } catch (\Throwable $e) {
            Log::error('🔥 Company index error', ['error' => $e->getMessage()]);

            $companies = Company::latest()->get()->map(function ($company) {
                if ($company->logo && !str_starts_with($company->logo, 'http')) {
                    $company->logo = url($company->logo);
                }
                return $company;
            });

            return response()->json($companies, 200);
        }
    }

    /**
     * 💾 Tambah atau update perusahaan (flush cache)
     */
    public function store(Request $request)
    {
        try {
            $id = $request->input('id');

            $validated = $request->validate([
                'name'    => 'required|string|max:255',
                'address' => 'required|string',
                'website' => 'nullable|string',
                'logo'    => 'nullable|image|mimes:jpeg,png,jpg,webp,svg|max:2048',
            ]);

            // Upload logo jika ada
            if ($request->hasFile('logo')) {
                $image = $request->file('logo');
                $fileName = 'company_' . Str::random(40) . '.' . $image->getClientOriginalExtension();
                $image->storeAs('public/companies', $fileName);
                $validated['logo'] = '/storage/companies/' . $fileName;
            }

            $company = $id
                ? $this->companyService->update($validated, $id)
                : $this->companyService->store($validated);

            Cache::flush();

            return response()->json($company, $id ? 200 : 201);
        } catch (\Throwable $e) {
            Log::error('🔥 Company store error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Gagal menyimpan data perusahaan'], 500);
        }
    }

    /**
     * ✏️ Update perusahaan (dengan cache flush)
     */
    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'name'    => 'required|string|max:255',
                'address' => 'required|string',
                'website' => 'nullable|string',
                'logo'    => 'nullable|image|max:2048',
            ]);

            $company = Company::findOrFail($id);
            $imageUrl = $company->logo;

            // Ganti logo jika ada file baru
            if ($request->hasFile('logo')) {
                if ($company->logo && str_contains($company->logo, '/storage/companies/')) {
                    $oldPath = str_replace('/storage/', '', $company->logo);
                    Storage::delete('public/' . $oldPath);
                }

                $image = $request->file('logo');
                $fileName = 'company_' . Str::random(40) . '.' . $image->getClientOriginalExtension();
                $image->storeAs('public/companies', $fileName);
                $imageUrl = '/storage/companies/' . $fileName;
            }

            $company->update([
                'name'    => $validated['name'],
                'address' => $validated['address'],
                'website' => $validated['website'] ?? null,
                'logo'    => $imageUrl,
            ]);

            Cache::forget("company:show:{$id}");
            Cache::flush();

            return response()->json($company, 200);
        } catch (\Throwable $e) {
            Log::error('🔥 Company update error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Gagal memperbarui perusahaan'], 500);
        }
    }

    /**
     * 🔍 Detail perusahaan (cache 2 hari)
     */
    public function show($id)
    {
        try {
            $cacheKey = "company:show:{$id}";

            $company = Cache::remember($cacheKey, now()->addDays(2), fn() => Company::find($id));

            if (!$company) {
                return response()->json(['message' => 'Perusahaan tidak ditemukan'], 404);
            }

            if ($company->logo && !str_starts_with($company->logo, 'http')) {
                $company->logo = url($company->logo);
            }

            return response()->json($company, 200);
        } catch (\Throwable $e) {
            Log::error('🔥 Company show error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Gagal mengambil data perusahaan'], 500);
        }
    }

    /**
     * 🗑️ Hapus perusahaan
     */
    public function destroy($id)
    {
        try {
            $company = Company::findOrFail($id);

            if ($company->logo && str_contains($company->logo, '/storage/companies/')) {
                $filePath = str_replace('/storage/', '', $company->logo);
                Storage::delete('public/' . $filePath);
            }

            $this->companyService->delete($id);

            Cache::forget("company:show:{$id}");
            Cache::flush();

            return response()->json([], 204);
        } catch (\Throwable $e) {
            Log::error('🔥 Company delete error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Gagal menghapus perusahaan'], 500);
        }
    }
}
