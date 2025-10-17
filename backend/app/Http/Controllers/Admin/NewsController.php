<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use App\Services\NewsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class NewsController extends Controller
{
    protected $newsService;
    protected $cacheTTL = 18000; // 5 jam

    public function __construct(NewsService $newsService)
    {
        $this->newsService = $newsService;
    }

    /**
     * 📰 Tampilkan semua berita (cache per filter 5 jam)
     */
   public function index(Request $request)
{
    try {
        // Deteksi apakah request berasal dari route admin
        $isAdmin = $request->is('admin/*');

        if ($isAdmin) {
            // 🧠 Admin selalu ambil data fresh tanpa cache
            $news = $this->newsService->search($request->all())->map(function ($item) {
                if ($item->thumbnail && !str_starts_with($item->thumbnail, 'http')) {
                    $item->thumbnail = url($item->thumbnail);
                }
                return $item;
            });

            return response()->json($news, 200);
        }

        // 🧱 Kalau bukan admin (public endpoint)
        $params = $request->all();
        $cacheKey = 'news_index_' . md5(json_encode($params));

        $news = Cache::tags('news')->remember($cacheKey, 18000, function () use ($params) {
            return $this->newsService->search($params)->map(function ($item) {
                if ($item->thumbnail && !str_starts_with($item->thumbnail, 'http')) {
                    $item->thumbnail = url($item->thumbnail);
                }
                return $item;
            });
        });

        return response()->json($news, 200);
    } catch (\Throwable $e) {
        Log::error('🔥 News index error', ['error' => $e->getMessage()]);
        $news = $this->newsService->search($request->all());
        return response()->json($news, 200);
    }
}


    /**
     * 🧾 Tambah berita baru
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title'        => 'required|string|max:255',
                'description'  => 'required|string',
                'slug'         => 'required|string|unique:news,slug',
                'published_at' => 'required|date',
                'category_id'  => 'required|exists:categories,id',
                'thumbnail'    => 'required|image|max:2048',
                'content'      => 'required|string',
            ]);

            $imageUrl = null;

            if ($request->hasFile('thumbnail')) {
                $image = $request->file('thumbnail');
                $fileName = 'news_' . Str::random(40) . '.' . $image->getClientOriginalExtension();
                Storage::makeDirectory('public/news');
                $image->storeAs('public/news', $fileName);
                $imageUrl = '/storage/news/' . $fileName;
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

            // 🔁 Hapus cache news agar data langsung update
            Cache::tags('news')->flush();
            $this->clearNewsCache();

            Log::info('🧹 Cache news dihapus setelah store');

            return response()->json($news, 201);
        } catch (\Throwable $e) {
            Log::error('🔥 News store error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Gagal menambah berita'], 500);
        }
    }

    /**
     * 🧱 Update berita
     */
    public function update(Request $request, $id)
    {
        try {
            $news = News::find($id);
            if (!$news) {
                return response()->json(['message' => 'Berita tidak ditemukan'], 404);
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
                    $oldPath = str_replace('/storage/', '', $news->thumbnail);
                    Storage::delete('public/' . $oldPath);
                }

                $image = $request->file('thumbnail');
                $fileName = 'news_' . Str::random(40) . '.' . $image->getClientOriginalExtension();
                $image->storeAs('public/news', $fileName);
                $imageUrl = '/storage/news/' . $fileName;
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

            // 🔁 Flush cache news
            Cache::tags('news')->flush();
            $this->clearNewsCache();

            Log::info('🧹 Cache news dihapus setelah update');

            return response()->json($news, 200);
        } catch (\Throwable $e) {
            Log::error('🔥 News update error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Gagal memperbarui berita'], 500);
        }
    }

    /**
     * 🔍 Detail berita (cached 5 jam per ID)
     */
    public function show($id)
    {
        try {
            $cacheKey = "news_show_{$id}";

            $news = Cache::tags('news')->remember($cacheKey, $this->cacheTTL, function () use ($id) {
                return News::find($id);
            });

            if (!$news) {
                return response()->json(['message' => 'Berita tidak ditemukan'], 404);
            }

            if ($news->thumbnail && !str_starts_with($news->thumbnail, 'http')) {
                $news->thumbnail = url($news->thumbnail);
            }

            return response()->json($news, 200);
        } catch (\Throwable $e) {
            Log::error('🔥 News show error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Gagal mengambil detail berita'], 500);
        }
    }

    /**
     * 🗑️ Hapus berita + flush cache
     */
    public function destroy($id)
    {
        try {
            $news = News::find($id);
            if (!$news) {
                return response()->json(['message' => 'Berita tidak ditemukan'], 404);
            }

            if ($news->thumbnail && str_contains($news->thumbnail, '/storage/news/')) {
                $filePath = str_replace('/storage/', '', $news->thumbnail);
                Storage::delete('public/' . $filePath);
            }

            $news->delete();

            Cache::tags('news')->flush();
            $this->clearNewsCache();

            Log::info('🧹 Cache news dihapus setelah delete');

            return response()->json([], 204);
        } catch (\Throwable $e) {
            Log::error('🔥 News delete error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Gagal menghapus berita'], 500);
        }
    }

    /**
     * 🧹 Bersihkan semua cache berita (index & detail)
     */
    private function clearNewsCache()
    {
        try {
            $redis = Cache::getRedis();

            // hapus semua cache key yang berkaitan dengan news
            $keys = array_merge(
                $redis->keys('*news_index_*'),
                $redis->keys('*news_show_*')
            );

            foreach ($keys as $key) {
                $redis->del($key);
            }

            Log::info('🧹 Semua cache news dihapus dari Redis');
        } catch (\Throwable $e) {
            Log::error('❌ Gagal menghapus cache news', ['error' => $e->getMessage()]);
        }
    }
}
