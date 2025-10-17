<?php

namespace App\Http\Controllers;

use App\Models\StudentShowcase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class StudentShowcaseController extends Controller
{
    /**
     * 📄 Tampilkan semua showcase (cached selama 1 jam)
     */
    public function index()
    {
        try {
            $cacheKey = 'showcases_list';

            // 🔹 Cache selama 1 jam
            $showcases = Cache::remember($cacheKey, 3600, function () {
                return StudentShowcase::latest()->get()->map(function ($showcase) {
                    if ($showcase->image_url && !str_starts_with($showcase->image_url, 'http')) {
                        $showcase->image_url = url($showcase->image_url);
                    }
                    return $showcase;
                });
            });

            return response()->json($showcases, 200);
        } catch (\Throwable $e) {
            Log::error('🔥 Showcase index cache error', ['error' => $e->getMessage()]);

            // fallback jika Redis bermasalah
            $showcases = StudentShowcase::latest()->get()->map(function ($showcase) {
                if ($showcase->image_url && !str_starts_with($showcase->image_url, 'http')) {
                    $showcase->image_url = url($showcase->image_url);
                }
                return $showcase;
            });

            return response()->json($showcases, 200);
        }
    }

    /**
     * 💾 Tambah showcase baru
     */
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
            return response()->json($e->errors(), 422);
        }

        try {
            $imageUrl = null;

            // 🔹 Upload gambar showcase
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $fileName = 'showcase_' . Str::random(40) . '.' . $image->getClientOriginalExtension();
                $image->storeAs('public/showcase', $fileName);
                $imageUrl = asset('storage/showcase/' . $fileName);
            }

            // 🔹 Simpan ke database
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

            // 🔹 Hapus cache agar data baru langsung muncul
            Cache::forget('showcases_list');

            return response()->json($showcase, 201);
        } catch (\Throwable $e) {
            Log::error('🔥 Showcase store error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Server error'], 500);
        }
    }

    /**
     * 🔎 Tampilkan detail showcase via slug
     */
    public function show($slug)
    {
        $showcase = StudentShowcase::where('slug', $slug)->first();

        if (!$showcase) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        if ($showcase->image_url && !str_starts_with($showcase->image_url, 'http')) {
            $showcase->image_url = url($showcase->image_url);
        }

        return response()->json($showcase, 200);
    }

    /**
     * ✏️ Update showcase
     */
    public function update(Request $request, $id)
    {
        $showcase = StudentShowcase::find($id);

        if (!$showcase) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

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
            return response()->json($e->errors(), 422);
        }

        try {
            // 🔹 Update gambar jika dikirim ulang
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
            Cache::forget('showcases_list');

            return response()->json($showcase, 200);
        } catch (\Throwable $e) {
            Log::error('🔥 Showcase update error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Server error'], 500);
        }
    }

    /**
     * 🗑️ Hapus showcase
     */
    public function destroy($id)
    {
        $showcase = StudentShowcase::find($id);

        if (!$showcase) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        try {
            // 🔹 Hapus gambar lama
            if ($showcase->image_url && str_contains($showcase->image_url, '/storage/showcase/')) {
                $filePath = str_replace(asset('storage/'), '', $showcase->image_url);
                Storage::delete('public/' . $filePath);
            }

            $showcase->delete();
            Cache::forget('showcases_list');

            return response()->json(['message' => 'Showcase berhasil dihapus'], 200);
        } catch (\Throwable $e) {
            Log::error('🔥 Showcase delete error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Server error'], 500);
        }
    }
}
