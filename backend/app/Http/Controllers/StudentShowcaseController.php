<?php

namespace App\Http\Controllers;

use App\Models\StudentShowcase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class StudentShowcaseController extends Controller
{
    public function index()
    {
        $showcases = StudentShowcase::latest()->get();

        return response()->json([
            'success' => true,
            'data' => $showcases,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'student_name'   => 'required|string|max:255',
                'student_class'  => 'required|string|max:50',
                'student_major'  => 'required|string|max:50',
                'contact_number' => 'required|string|max:20',
                'title'          => 'required|string|max:255',
                'description'    => 'required|string',
                'project_link'   => 'nullable|string',
                'status'         => 'in:draft,published',
                'image'          => 'required|image|max:2048',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal. Beberapa field belum terisi dengan benar.',
                'errors'  => $e->errors(),
            ], 422);
        }

        try {
            $imageUrl = null;

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $fileName = 'showcase_' . Str::random(40) . '.' . $image->getClientOriginalExtension();

                $image->storeAs('public/showcase', $fileName);

                $imageUrl = asset('storage/showcase/' . $fileName);
            }

            $showcase = StudentShowcase::create([
                'student_name'   => $validated['student_name'],
                'student_class'  => $validated['student_class'],
                'student_major'  => $validated['student_major'],
                'contact_number' => $validated['contact_number'],
                'title'          => $validated['title'],
                'slug'           => Str::slug($validated['title'] . '-' . Str::random(5)),
                'description'    => $validated['description'],
                'image_url'      => $imageUrl,
                'project_link'   => $validated['project_link'] ?? null,
                'status'         => $validated['status'] ?? 'published',
            ]);

            return response()->json([
                'success' => true,
                'message' => '✅ Showcase berhasil ditambahkan.',
                'data'    => $showcase,
            ], 201);
        } catch (\Throwable $e) {
            Log::error('🔥 Showcase store error', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan pada server.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($slug)
    {
        $showcase = StudentShowcase::where('slug', $slug)->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $showcase,
        ]);
    }

    public function update(Request $request, $id)
    {
        $showcase = StudentShowcase::findOrFail($id);

        try {
            $validated = $request->validate([
                'student_name'   => 'sometimes|string|max:255',
                'student_class'  => 'nullable|string|max:50',
                'student_major'  => 'nullable|string|max:50',
                'contact_number' => 'sometimes|string|max:20',
                'title'          => 'sometimes|string|max:255',
                'description'    => 'sometimes|string',
                'project_link'   => 'nullable|string',
                'status'         => 'in:draft,published',
                'image'          => 'nullable|image|max:2048',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal saat update.',
                'errors'  => $e->errors(),
            ], 422);
        }

        try {
            if ($request->hasFile('image')) {
                if ($showcase->image_url && str_contains($showcase->image_url, '/storage/showcase/')) {
                    $oldFile = str_replace(asset('storage/'), '', $showcase->image_url);
                    Storage::delete('public/' . $oldFile);
                }

                $image = $request->file('image');
                $fileName = 'showcase_' . Str::random(40) . '.' . $image->getClientOriginalExtension();
                $image->storeAs('public/showcase', $fileName);

                $validated['image_url'] = asset('storage/showcase/' . $fileName);
            }

            $showcase->update($validated);

            return response()->json([
                'success' => true,
                'message' => '✅ Showcase berhasil diperbarui.',
                'data'    => $showcase,
            ]);
        } catch (\Throwable $e) {
            Log::error('🔥 Showcase update error', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan pada server.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $showcase = StudentShowcase::findOrFail($id);

            if ($showcase->image_url && str_contains($showcase->image_url, '/storage/showcase/')) {
                $filePath = str_replace(asset('storage/'), '', $showcase->image_url);
                Storage::delete('public/' . $filePath);
            }

            $showcase->delete();

            return response()->json([
                'success' => true,
                'message' => '🗑️ Showcase berhasil dihapus.',
            ]);
        } catch (\Throwable $e) {
            Log::error('🔥 Showcase delete error', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menghapus showcase.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
