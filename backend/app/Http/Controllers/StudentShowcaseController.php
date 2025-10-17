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
    protected $cacheTTL = 3600; // cache 1 jam (detik)

    /**
     * 📄 Tampilkan semua showcase (cached selama 1 jam)
     */
    public function index()
    {
        try {
            $cacheKey = 'showcases_index_all';

            $showcases = Cache::tags('showcases')->remember($cacheKey, $this->cacheTTL, function () {
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

            // fallback jika cache error
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

            // 🧱 Upload gambar ke public/showcase
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $fileName = 'showcase_' . Str::random(40) . '.' . $image->getClientOriginalExtension();

                Storage::makeDirectory('public/showcase');
                $image->storeAs('showcase', $fileName, 'public');

                $imageUrl = '/storage/showcase/' . $fileName;
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

            // 🔁 Bersihkan cache showcase
            Cache::tags('showcases')->flush();
            $this->clearShowcaseCache();

            return response()->json($showcase, 201);
        } catch (\Throwable $e) {
            Log::error('🔥 Showcase store error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Server error'], 500);
        }
    }

    /**
     * 🔎 Tampilkan detail showcase via slug (cached 1 jam)
     */
    public function show($slug)
    {
        try {
            $cacheKey = "showcase_show_{$slug}";

            $showcase = Cache::tags('showcases')->remember($cacheKey, $this->cacheTTL, function () use ($slug) {
                return StudentShowcase::where('slug', $slug)->first();
            });

            if (!$showcase) {
                return response()->json(['message' => 'Data tidak ditemukan'], 404);
            }

            if ($showcase->image_url && !str_starts_with($showcase->image_url, 'http')) {
                $showcase->image_url = url($showcase->image_url);
            }

            return response()->json($showcase, 200);
        } catch (\Throwable $e) {
            Log::error('🔥 Showcase show error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Server error'], 500);
        }
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
            // 🔹 Ganti gambar baru jika dikirim ulang
            if ($request->hasFile('image')) {
                if ($showcase->image_url && str_contains($showcase->image_url, '/storage/showcase/')) {
                    $oldPath = str_replace('/storage/', '', $showcase->image_url);
                    Storage::delete('public/' . $oldPath);
                }

                $image = $request->file('image');
                $fileName = 'showcase_' . Str::random(40) . '.' . $image->getClientOriginalExtension();

                Storage::makeDirectory('public/showcase');
                $image->storeAs('showcase', $fileName, 'public');

                $validated['image_url'] = '/storage/showcase/' . $fileName;
            }

            $showcase->update($validated);

            // 🔁 Bersihkan cache
            Cache::tags('showcases')->flush();
            $this->clearShowcaseCache();

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
            if ($showcase->image_url && str_contains($showcase->image_url, '/storage/showcase/')) {
                $filePath = str_replace('/storage/', '', $showcase->image_url);
                Storage::delete('public/' . $filePath);
            }

            $showcase->delete();

            Cache::tags('showcases')->flush();
            $this->clearShowcaseCache();

            return response()->json(['message' => 'Showcase berhasil dihapus'], 200);
        } catch (\Throwable $e) {
            Log::error('🔥 Showcase delete error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Server error'], 500);
        }
    }

    /**
     * 🧹 Bersihkan semua cache showcase (index & detail)
     */
    private function clearShowcaseCache()
    {
        try {
            $redis = Cache::getRedis();

            $keys = array_merge(
                $redis->keys('*showcases_index_*'),
                $redis->keys('*showcase_show_*')
            );

            foreach ($keys as $key) {
                $redis->del($key);
            }

            Log::info('🧹 Semua cache showcase dihapus dari Redis');
        } catch (\Throwable $e) {
            Log::error('❌ Gagal menghapus cache showcase', ['error' => $e->getMessage()]);
        }
    }
}
