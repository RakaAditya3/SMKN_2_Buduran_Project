<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\NewsService;
use Illuminate\Http\Request;

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
        $id = $request->input('id');
        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'slug' => 'required|string|unique:news,slug,' . $id,
            'published_at' => 'required|date',
            'category_id' => 'required|exists:categories,id',
            'thumbnail' => 'required|string',
            'content' => 'required|string',
        ];
        $validatedData = $request->validate($rules);

        if ($id) {
            $news = $this->newsService->update($validatedData, $id);
            $message = 'Berita berhasil diperbarui.';
        } else {
            $news = $this->newsService->store($validatedData);
            $message = 'Berita berhasil ditambahkan.';
        }

        return response()->json(['success' => true, 'message' => $message, 'data' => $news]);
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
