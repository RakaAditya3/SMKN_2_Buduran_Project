<?php

namespace App\Services;

use App\Models\Extracurricular;

class ExtracurricularService extends Service
{
    public function search($params = [])
    {
        $extracurriculars = Extracurricular::orderBy('id');
        $name = $params['name'] ?? '';
        if ($name !== '') {
            $extracurriculars = $extracurriculars->where('name', 'like', "%$name%");
        }
        $extracurriculars = $this->searchFilter($params, $extracurriculars, []);
        return $this->searchResponse($params, $extracurriculars);
    }
    public function find($value, $column = 'id')
    {
        return Extracurricular::where($column, $value)->first();
    }
    public function store($params)
    {
        return Extracurricular::create($params);
    }
    public function update($params, $id)
    {
        $extracurricular = Extracurricular::find($id);
        if (!empty($extracurricular)) {
            $extracurricular->update($params);
        }
        return $extracurricular;
    }
    public function delete($id)
    {
        $extracurricular = Extracurricular::find($id);
        if (!empty($extracurricular)) {
            $extracurricular->delete();
        }
        return $extracurricular;
    }
    public function restore($id)
    {
        $extracurricular = Extracurricular::withTrashed()->where('id', $id)->first();
        if (!empty($extracurricular)) {
            $extracurricular->restore();
        }
        return $extracurricular;
    }
}
