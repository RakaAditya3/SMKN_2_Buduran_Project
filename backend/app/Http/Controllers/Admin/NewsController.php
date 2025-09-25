<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use App\Services\NewsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class NewsController extends Controller
{
    protected $newsService;

    public function __construct(NewsService $newsService)
    {
        $this->newsService = $newsService;
    }

    public function index(Request $request)
    {
        $news = $this->newsService->search($request->all());
        return response()->json($news);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'required|string',
            'slug'         => 'required|string|unique:news,slug',
            'published_at' => 'required|date',
            'category_id'  => 'required|exists:categories,id',
            'thumbnail'    => 'nullable|image|max:2048', // opsional, max 2MB
            'content'      => 'required|string',
        ]);

        $imageUrl = null;

        if ($request->hasFile('thumbnail')) {
            $image     = $request->file('thumbnail');
            $fileName  = 'news/' . Str::random(40) . '.' . $image->getClientOriginalExtension();
            $bucket    = 'images';

            $response = Http::withToken(env('SUPABASE_KEY'))
                ->attach(
                    'file',
                    fopen($image->getRealPath(), 'r'),
                    $fileName
                )
                ->post(env('SUPABASE_URL') . "/storage/v1/object/$bucket/$fileName?upsert=true");

            if ($response->failed()) {
                \Log::error('Supabase upload failed', [
                    'status' => $response->status(),
                    'body'   => $response->body(),
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Upload thumbnail gagal',
                    'error'   => $response->body(),
                ], 500);
            }

            // URL publik file
            $imageUrl = rtrim(env('SUPABASE_URL'), '/') .
                "/storage/v1/object/public/$bucket/$fileName";
        }

        $news = News::create([
            'title'        => $request->title,
            'description'  => $request->description,
            'slug'         => $request->slug,
            'thumbnail'    => $imageUrl,
            'content'      => $request->content,
            'category_id'  => $request->category_id,
            'published_at' => $request->published_at,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Berita berhasil ditambahkan.',
            'data'    => $news,
        ], 201);
    }

    public function show($id)
    {
        $news = $this->newsService->find($id);
        if (!$news) {
            return response()->json(['error' => 'Berita tidak ditemukan.'], 404);
        }
        return response()->json($news);
    }

    public function destroy($id)
    {
        $result = $this->newsService->delete($id);
        if (isset($result['error'])) {
            return response()->json(['error' => $result['error']], 400);
        }
        return response()->json(['success' => 'Berita berhasil dihapus.']);
    }
}
