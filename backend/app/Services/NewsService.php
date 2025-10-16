<?php

namespace App\Services;

use App\Models\News;
use Illuminate\Support\Facades\Cache;

class NewsService extends Service
{
    protected $cacheTTL = 18000; // 5 jam

    public function search($params = [])
    {
        $cacheKey = 'news_search_' . md5(json_encode($params));

        return Cache::remember($cacheKey, $this->cacheTTL, function () use ($params) {
            $news = News::orderBy('created_at', 'desc');

            if (!empty($params['title'])) {
                $news = $news->where('title', 'like', "%{$params['title']}%");
            }

            $news = $this->searchFilter($params, $news, ['category_id', 'slug', 'published_at']);
            return $this->searchResponse($params, $news);
        });
    }

    public function find($value, $column = 'id')
    {
        $cacheKey = "news_find_{$column}_{$value}";

        return Cache::remember($cacheKey, $this->cacheTTL, function () use ($value, $column) {
            return News::where($column, $value)->first();
        });
    }

    public function store($params)
    {
        $news = News::create($params);

        // Hapus semua cache terkait news
        Cache::tags('news')->flush();

        return $news;
    }

    public function update($params, $id)
    {
        $news = News::find($id);
        if ($news) {
            $news->update($params);
            Cache::tags('news')->flush();
        }
        return $news;
    }

    public function delete($id)
    {
        $news = News::find($id);
        if ($news) {
            $news->delete();
            Cache::tags('news')->flush();
        }
        return $news;
    }

    public function restore($id)
    {
        $news = News::withTrashed()->where('id', $id)->first();
        if ($news) {
            $news->restore();
            Cache::tags('news')->flush();
        }
        return $news;
    }
}
