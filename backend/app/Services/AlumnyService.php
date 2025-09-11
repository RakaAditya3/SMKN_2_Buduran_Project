<?php

namespace App\Services;

use App\Models\Alumnus;

class AlumnyService extends Service
{
    public function search($params = [])
    {
        $alumni = Alumnus::orderBy('id');
        $name = $params['name'] ?? '';
        if ($name !== '') {
            $alumni = $alumni->where('name', 'like', "%$name%");
        }
        $alumni = $this->searchFilter($params, $alumni, ['batch', 'company_id']);
        return $this->searchResponse($params, $alumni);
    }
    public function find($value, $column = 'id')
    {
        return Alumnus::where($column, $value)->first();
    }
    public function store($params)
    {
        return Alumnus::create($params);
    }
    public function update($params, $id)
    {
        $alumny = Alumnus::find($id);
        if (!empty($alumny)) {
            $alumny->update($params);
        }
        return $alumny;
    }
    public function delete($id)
    {
        $alumny = Alumnus::find($id);
        if (!empty($alumny)) {
            try {
                $alumny->delete();
            } catch (\Exception $e) {
                return ['error' => 'Delete failed! This data is currently being used'];
            }
        }
        return $alumny;
    }
    public function restore($id)
    {
        $alumny = Alumnus::withTrashed()->where('id', $id)->first();
        if (!empty($alumny)) {
            $alumny->restore();
        }
        return $alumny;
    }
}
