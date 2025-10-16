<?php

namespace App\Services;

use App\Models\Company;
use Illuminate\Support\Facades\Cache;

class CompanyService extends Service
{
    /**
     * Pencarian perusahaan (cache 1–3 hari)
     * Cache key unik berdasarkan parameter pencarian
     */
    public function search($params = [])
    {
        $cacheKey = 'company:search:' . md5(json_encode($params));

        // Simpan cache selama 2 hari agar query tidak berat
        return Cache::remember($cacheKey, now()->addDays(2), function () use ($params) {
            $companies = Company::select('id', 'name', 'address', 'website', 'logo', 'created_at')
                ->orderBy('id', 'asc');

            $name = $params['name'] ?? '';
            if ($name !== '') {
                // Gunakan like index-aware (jika indexing name dibuat)
                $companies->where('name', 'like', "%$name%");
            }

            // Filter tambahan address dan website jika ada
            $companies = $this->searchFilter($params, $companies, ['address', 'website']);

            return $this->searchResponse($params, $companies);
        });
    }

    /**
     * Ambil satu perusahaan berdasarkan kolom
     * Cache 3 hari agar akses cepat di halaman detail
     */
    public function find($value, $column = 'id')
    {
        $cacheKey = "company:find:{$column}:{$value}";

        return Cache::remember($cacheKey, now()->addDays(3), function () use ($value, $column) {
            return Company::where($column, $value)->first();
        });
    }

    /**
     * Simpan data perusahaan baru
     * Setelah simpan, cache lama dihapus agar data baru langsung terlihat
     */
    public function store($params)
    {
        $company = Company::create($params);
        Cache::flush(); // bersihkan cache agar data baru tampil
        return $company;
    }

    /**
     * Update data perusahaan
     * Setelah update, cache dihapus agar data tidak basi
     */
    public function update($params, $id)
    {
        $company = Company::find($id);
        if (!empty($company)) {
            $company->update($params);
            Cache::flush();
        }
        return $company;
    }

    /**
     * Hapus perusahaan (soft/hard delete)
     * Cache dihapus agar data yang dihapus tidak tetap muncul
     */
    public function delete($id)
    {
        $company = Company::find($id);
        if (!empty($company)) {
            try {
                $company->delete();
                Cache::flush();
            } catch (\Exception $e) {
                return ['error' => 'Delete failed! This data is currently being used'];
            }
        }
        return $company;
    }

    /**
     * Pulihkan data perusahaan yang dihapus
     * Cache dihapus agar data terbaru muncul lagi di daftar
     */
    public function restore($id)
    {
        $company = Company::withTrashed()->where('id', $id)->first();
        if (!empty($company)) {
            $company->restore();
            Cache::flush();
        }
        return $company;
    }
}
