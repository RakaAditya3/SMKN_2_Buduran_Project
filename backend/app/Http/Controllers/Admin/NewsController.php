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
    try {
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
            $fileName = 'news/' . Str::random(40) . '.' . $image->getClientOriginalExtension();
            $bucket = 'images';

            $response = Http::withOptions([
                    'verify' => false,          
                    'timeout' => 60,     
                    'connect_timeout' => 15,  
                ])
                ->withToken(env('SUPABASE_KEY'))
                ->attach('file', fopen($image->getRealPath(), 'r'), $fileName)
                ->post(rtrim(env('SUPABASE_URL'), '/') . "/storage/v1/object/$bucket/$fileName?upsert=true");

        
            if ($response->failed()) {
                \Log::error('❌ Supabase upload failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'url' => rtrim(env('SUPABASE_URL'), '/') . "/storage/v1/object/$bucket/$fileName?upsert=true",
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Upload thumbnail gagal ke Supabase',
                    'error' => $response->body(),
                ], 500);
            }


            $imageUrl = rtrim(env('SUPABASE_URL'), '/') .
                "/storage/v1/object/public/$bucket/$fileName";
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


        return response()->json([
            'success' => true,
            'message' => '✅ Berita berhasil ditambahkan.',
            'data'    => $news,
        ], 201);

    } catch (\Throwable $e) {

        \Log::error('🔥 News store error', [
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
        ]);

        return response()->json([
            'success' => false,
            'error' => $e->getMessage(),
            'trace' => $e->getFile() . ':' . $e->getLine(),
        ], 500);
    }
    }


    public function update(Request $request, $id)
{
    $news = News::find($id);

    if (!$news) {
        return response()->json([
            'success' => false,
            'message' => 'Berita tidak ditemukan.',
        ], 404);
    }

    $request->validate([
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
            \Log::error('Supabase upload failed on update', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Upload thumbnail gagal',
                'error'   => $response->body(),
            ], 500);
        }

        $imageUrl = rtrim(env('SUPABASE_URL'), '/') .
            "/storage/v1/object/public/$bucket/$fileName";
    }

    // ✅ Update data berita
    $news->update([
        'title'        => $request->title        ?? $news->title,
        'description'  => $request->description  ?? $news->description,
        'slug'         => $request->slug         ?? $news->slug,
        'thumbnail'    => $imageUrl,
        'content'      => $request->content      ?? $news->content,
        'category_id'  => $request->category_id  ?? $news->category_id,
        'published_at' => $request->published_at ?? $news->published_at,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Berita berhasil diperbarui.',
        'data'    => $news,
    ]);
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
