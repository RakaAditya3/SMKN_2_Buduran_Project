<?php

namespace App\Services;

use App\Models\Achievement;

class AchievementService extends Service
{
    public function search($params = [])
    {
        $achievements = Achievement::orderBy('id');
        $title = $params['title'] ?? '';
        if ($title !== '') {
            $achievements = $achievements->where('title', 'like', "%$title%");
        }
        $student_name = $params['student_name'] ?? '';
        if ($student_name !== '') {
            $achievements = $achievements->where('student_name', 'like', "%$student_name%");
        }
        $achievements = $this->searchFilter($params, $achievements, ['category_id', 'slug', 'published_at']);
        return $this->searchResponse($params, $achievements);
    }
    public function find($value, $column = 'id')
    {
        return Achievement::where($column, $value)->first();
    }
    public function store($params)
    {
        return Achievement::create($params);
    }
    public function update($params, $id)
    {
        $achievement = Achievement::find($id);
        if (!empty($achievement)) {
            $achievement->update($params);
        }
        return $achievement;
    }
    public function delete($id)
    {
        $achievement = Achievement::find($id);
        if (!empty($achievement)) {
            $achievement->delete();
        }
        return $achievement;
    }
    public function restore($id)
    {
        $achievement = Achievement::withTrashed()->where('id', $id)->first();
        if (!empty($achievement)) {
            $achievement->restore();
        }
        return $achievement;
    }
}
