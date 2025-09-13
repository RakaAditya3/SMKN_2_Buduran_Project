<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\CategoryService;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    protected $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index(Request $request)
    {
        $categories = $this->categoryService->search($request->all());
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $id = $request->input('id');

        $rules = [
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:categories,slug,' . $id,
        ];

        $validatedData = $request->validate($rules);

        if ($id) {
            $category = $this->categoryService->update($validatedData, $id);
            $message = 'Kategori berhasil diperbarui.';
        } else {
            $category = $this->categoryService->store($validatedData);
            $message = 'Kategori berhasil ditambahkan.';
        }

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $category,
        ]);
    }

    public function show($id)
    {
        $category = $this->categoryService->find($id);
        if (!$category) {
            return response()->json(['error' => 'Kategori tidak ditemukan.'], 404);
        }
        return response()->json($category);
    }

    public function destroy($id)
    {
        $result = $this->categoryService->delete($id);

        if (isset($result['error'])) {
            return response()->json(['error' => $result['error']], 400);
        }

        return response()->json(['success' => 'Kategori berhasil dihapus.']);
    }
}
