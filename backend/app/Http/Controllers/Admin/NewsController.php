<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use App\Services\NewsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;

class NewsController extends Controller
{
    protected $newsService;
    protected $cacheTTL = 18000; // 5 jam

    public function __construct(NewsService $newsService)
    {
        $this->newsService = $newsService;
    }

    public function index(Request $request)
    {
        $params = $request->all();

        // Buat key unik untuk caching berdasarkan query params
        $cacheKey = 'news_index_' . md5(json_encode($params));

        // Gunakan tag 'news' agar tidak bentrok dengan cache lain (misal ebooks)
        $news = Cache::tags('news')->remember($cacheKey, $this->cacheTTL, function () use ($params) {
            return $this->newsService->search($params);
        });

        return response()->json($news);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'required|string',
            'slug'         => 'required|string|unique:news,slug',
            'published_at' => 'required|date',
            'category_id'  => 'required|exists:categories,id',
            'thumbnail'    => 'nullable|image|max:2048',
            'content'      => 'required|string',
        ]);

        $imageUrl = null;
        if ($request->hasFile('thumbnail')) {
            $image = $request->file('thumbnail');
            $fileName = 'news_' . Str::random(40) . '.' . $image->getClientOriginalExtension();
            $image->storeAs('public/news', $fileName);
            $imageUrl = asset('storage/news/' . $fileName);
        }

        $news = News::create([
            'title'        => $validated['title'],
            'description'  => $validated['description'],
            'slug'         => $validated['slug'],
            'thumbnail'    => $imageUrl,
            'content'      => $validated['content'],
            'category_id'  => $validated['category_id'],
            'published_at' => $validated['published_at'],
        ]);

        // Hapus cache hanya untuk tag 'news'
        Cache::tags('news')->flush();

        return response()->json([
            'success' => true,
            'message' => '✅ Berita berhasil ditambahkan.',
            'data'    => $news,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $news = News::find($id);
        if (!$news) {
            return response()->json(['success' => false, 'message' => 'Berita tidak ditemukan.'], 404);
        }

        $validated = $request->validate([
            'title'        => 'sometimes|required|string|max:255',
            'description'  => 'sometimes|required|string',
            'slug'         => 'sometimes|required|string|unique:news,slug,' . $id,
            'published_at' => 'sometimes|required|date',
            'category_id'  => 'sometimes|required|exists:categories,id',
            'thumbnail'    => 'nullable|image|max:2048',
            'content'      => 'sometimes|required|string',
        ]);

        $imageUrl = $news->thumbnail;
        if ($request->hasFile('thumbnail')) {
            if ($news->thumbnail && str_contains($news->thumbnail, '/storage/news/')) {
                $oldPath = str_replace(asset('storage/'), '', $news->thumbnail);
                Storage::delete('public/' . $oldPath);
            }
            $image = $request->file('thumbnail');
            $fileName = 'news_' . Str::random(40) . '.' . $image->getClientOriginalExtension();
            $image->storeAs('public/news', $fileName);
            $imageUrl = asset('storage/news/' . $fileName);
        }

        $news->update([
            'title'        => $request->title        ?? $news->title,
            'description'  => $request->description  ?? $news->description,
            'slug'         => $request->slug         ?? $news->slug,
            'thumbnail'    => $imageUrl,
            'content'      => $request->content      ?? $news->content,
            'category_id'  => $request->category_id  ?? $news->category_id,
            'published_at' => $request->published_at ?? $news->published_at,
        ]);

        // Bersihkan hanya cache yang bertag 'news'
        Cache::tags('news')->flush();

        return response()->json([
            'success' => true,
            'message' => '✅ Berita berhasil diperbarui.',
            'data'    => $news,
        ]);
    }

    public function show($id)
    {
        $cacheKey = "news_show_{$id}";

        // Cache detail berita pakai tag 'news' agar tetap terpisah dari ebook
        $news = Cache::tags('news')->remember($cacheKey, $this->cacheTTL, function () use ($id) {
            return $this->newsService->find($id);
        });

        if (!$news) {
            return response()->json(['error' => 'Berita tidak ditemukan.'], 404);
        }

        return response()->json($news);
    }

    public function destroy($id)
    {
        $news = News::find($id);
        if (!$news) {
            return response()->json(['success' => false, 'message' => 'Berita tidak ditemukan.'], 404);
        }

        if ($news->thumbnail && str_contains($news->thumbnail, '/storage/news/')) {
            $filePath = str_replace(asset('storage/'), '', $news->thumbnail);
            Storage::delete('public/' . $filePath);
        }

        $news->delete();

        // Hapus semua cache news tanpa mengganggu cache lain
        Cache::tags('news')->flush();

        return response()->json(['success' => true, 'message' => '🗑️ Berita berhasil dihapus.']);
    }
}
