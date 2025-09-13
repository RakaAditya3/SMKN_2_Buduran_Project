<?php

namespace App\Services;

use App\Models\News;

class NewsService extends Service
{
    public function search($params = [])
    {
        $news = News::orderBy('id');
        $title = $params['title'] ?? '';
        if ($title !== '') {
            $news = $news->where('title', 'like', "%$title%");
        }
        $news = $this->searchFilter($params, $news, ['category_id', 'slug', 'published_at']);
        return $this->searchResponse($params, $news);
    }
    public function find($value, $column = 'id')
    {
        return News::where($column, $value)->first();
    }
    public function store($params)
    {
        return News::create($params);
    }
    public function update($params, $id)
    {
        $news = News::find($id);
        if (!empty($news)) {
            $news->update($params);
        }
        return $news;
    }
    public function delete($id)
    {
        $news = News::find($id);
        if (!empty($news)) {
            $news->delete();
        }
        return $news;
    }
    public function restore($id)
    {
        $news = News::withTrashed()->where('id', $id)->first();
        if (!empty($news)) {
            $news->restore();
        }
        return $news;
    }
}
