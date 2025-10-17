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
     * 📄 Tampilkan semua perusahaan (cache 2 hari)
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

            return response()->json([
                'success' => true,
                'cached' => true,
                'data' => $companies,
            ]);
        } catch (\Throwable $e) {
            Log::error('🔥 Company index cache error', ['error' => $e->getMessage()]);

            $companies = Company::latest()->get()->map(function ($company) {
                if ($company->logo && !str_starts_with($company->logo, 'http')) {
                    $company->logo = url($company->logo);
                }
                return $company;
            });

            return response()->json([
                'success' => true,
                'cached' => false,
                'data' => $companies,
            ]);
        }
    }

    /**
     * 💾 Tambah atau update perusahaan (dengan cache flush)
     */
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

            // 🔹 Upload logo jika ada
            if ($request->hasFile('logo')) {
                $image = $request->file('logo');
                $fileName = 'company_' . Str::random(40) . '.' . $image->getClientOriginalExtension();
                $image->storeAs('public/companies', $fileName);
                $imageUrl = '/storage/companies/' . $fileName;
                $validated['logo'] = $imageUrl;
            }

            if ($id) {
                $company = $this->companyService->update($validated, $id);
                $message = '🏢 Perusahaan berhasil diperbarui.';
            } else {
                $company = $this->companyService->store($validated);
                $message = '🏢 Perusahaan berhasil ditambahkan.';
            }

            // 🔁 Hapus cache lama agar data baru muncul
            Cache::flush();

            return response()->json([
                'success' => true,
                'message' => $message,
                'data'    => $company,
            ]);
        } catch (\Throwable $e) {
            Log::error('🔥 Company store error', ['error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan data perusahaan.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ✏️ Update perusahaan
     */
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

            // 🔹 Ganti logo jika ada file baru
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

            // 🔁 Flush cache agar data baru terbaca
            Cache::forget("company:show:{$id}");
            Cache::flush();

            return response()->json([
                'success' => true,
                'message' => '✅ Perusahaan berhasil diperbarui.',
                'data'    => $company,
            ]);
        } catch (\Throwable $e) {
            Log::error('🔥 Company update error', ['error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memperbarui data.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * 🔎 Detail perusahaan (cache 2 hari)
     */
    public function show($id)
    {
        try {
            $cacheKey = "company:show:{$id}";

            $company = Cache::remember($cacheKey, now()->addDays(2), function () use ($id) {
                return Company::find($id);
            });

            if (!$company) {
                return response()->json(['error' => 'Perusahaan tidak ditemukan.'], 404);
            }

            if ($company->logo && !str_starts_with($company->logo, 'http')) {
                $company->logo = url($company->logo);
            }

            return response()->json([
                'success' => true,
                'data' => $company,
                'cached' => true,
            ]);
        } catch (\Throwable $e) {
            Log::error('🔥 Company show cache error', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil data perusahaan.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * 🗑️ Hapus perusahaan
     */
    public function destroy($id)
    {
        try {
            $company = Company::findOrFail($id);

            // 🔹 Hapus file logo
            if ($company->logo && str_contains($company->logo, '/storage/companies/')) {
                $filePath = str_replace('/storage/', '', $company->logo);
                Storage::delete('public/' . $filePath);
            }

            $this->companyService->delete($id);

            // 🔁 Hapus cache
            Cache::forget("company:show:{$id}");
            Cache::flush();

            return response()->json([
                'success' => true,
                'message' => '🗑️ Perusahaan berhasil dihapus.',
            ]);
        } catch (\Throwable $e) {
            Log::error('🔥 Company delete error', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus data perusahaan.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
