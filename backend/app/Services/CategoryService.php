<?php

namespace App\Services;

use App\Models\Category;

class CategoryService extends Service
{
    public function search($params = [])
    {
        $category = Category::orderBy('id');
        $name = $params['name'] ?? '';
        if ($name !== '') {
            $category = $category->where('name', 'like', "%$name%");
        }
        $category = $this->searchFilter($params, $category, ['slug']);
        return $this->searchResponse($params, $category);
    }
    public function find($value, $column = 'id')
    {
        return Category::where($column, $value)->first();
    }
    public function store($params)
    {
        return Category::create($params);
    }
    public function update($params, $id)
    {
        $category = Category::find($id);
        if (!empty($category)) {
            $category->update($params);
        }
        return $category;
    }
    public function delete($id)
    {
        $category = Category::find($id);
        if (!empty($category)) {
            try {
                $category->delete();
            } catch (\Exception $e) {
                return ['error' => 'Delete failed! This data is currently being used'];
            }
        }
        return $category;
    }
    public function restore($id)
    {
        $category = Category::withTrashed()->where('id', $id)->first();
        if (!empty($category)) {
            $category->restore();
        }
        return $category;
    }
}
