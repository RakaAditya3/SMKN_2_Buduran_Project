<?php

namespace App\Services;

use App\Models\Company;

class CompanyService extends Service
{
    public function search($params = [])
    {
        $companies = Company::orderBy('id');
        $name = $params['name'] ?? '';
        if ($name !== '') {
            $companies = $companies->where('name', 'like', "%$name%");
        }
        $companies = $this->searchFilter($params, $companies, ['address', 'website']);
        return $this->searchResponse($params, $companies);
    }
    public function find($value, $column = 'id')
    {
        return Company::where($column, $value)->first();
    }
    public function store($params)
    {
        return Company::create($params);
    }
    public function update($params, $id)
    {
        $company = Company::find($id);
        if (!empty($company)) {
            $company->update($params);
        }
        return $company;
    }
    public function delete($id)
    {
        $company = Company::find($id);
        if (!empty($company)) {
            try {
                $company->delete();
            } catch (\Exception $e) {
                return ['error' => 'Delete failed! This data is currently being used'];
            }
        }
        return $company;
    }
    public function restore($id)
    {
        $company = Company::withTrashed()->where('id', $id)->first();
        if (!empty($company)) {
            $company->restore();
        }
        return $company;
    }
}
