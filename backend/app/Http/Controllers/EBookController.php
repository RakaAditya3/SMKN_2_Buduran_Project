<?php

namespace App\Http\Controllers;

use App\Models\EBook;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class EBookController extends Controller
{
    /**
     * 🔑 Login siswa (token student_token)
     */
    public function login(Request $request)
    {
        $request->validate([
            'nisn' => 'required|string',
            'password' => 'required|string',
        ]);

        $student = Student::where('nisn', $request->nisn)->first();

        if (!$student || !Hash::check($request->password, $student->password)) {
            return response()->json(['message' => 'NISN atau password salah'], 401);
        }

        // Hapus token lama agar 1 akun hanya punya 1 sesi login aktif
        $student->tokens()->delete();
        $token = $student->createToken('student_token', ['student'])->plainTextToken;

       return response()->json([
    'success' => true,
    'message' => 'Login berhasil',
    'token'   => $token,
    'user'    => $student,
], 200);

    }

    /**
     * 📚 Ambil semua eBook (cached selama 1 jam)
     */
    public function index()
    {
        try {
            $cacheKey = 'ebooks_all';

            $ebooks = Cache::remember($cacheKey, 3600, function () {
                return EBook::latest()->get()->map(function ($ebook) {
                    if ($ebook->image_path && !str_starts_with($ebook->image_path, 'http')) {
                        $ebook->image_path = url($ebook->image_path);
                    }
                    return $ebook;
                });
            });

            return response()->json($ebooks, 200);
        } catch (\Throwable $e) {
            Log::error('🔥 EBook index cache error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Gagal mengambil data eBook'], 500);
        }
    }

    /**
     * 💾 Tambah eBook baru
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'title'       => 'required|string|max:255',
                'description' => 'required|string',
                'image'       => 'nullable|image|max:2048',
            ]);

            $imagePath = null;

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $fileName = 'ebook_' . Str::random(40) . '.' . $image->getClientOriginalExtension();
                Storage::makeDirectory('public/ebooks');
                $image->storeAs('public/ebooks', $fileName);
                $imagePath = '/storage/ebooks/' . $fileName;
            }

            $ebook = EBook::create([
                'title'       => $request->title,
                'description' => $request->description,
                'image_path'  => $imagePath,
            ]);

            // Hapus cache agar data baru muncul
            Cache::forget('ebooks_all');

            return response()->json($ebook, 201);
        } catch (\Throwable $e) {
            Log::error('🔥 EBook store error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Gagal menambah eBook'], 500);
        }
    }

    /**
     * 📖 Detail eBook berdasarkan ID (no cache)
     */
    public function show($id)
    {
        try {
            $ebook = EBook::findOrFail($id);

            if ($ebook->image_path && !str_starts_with($ebook->image_path, 'http')) {
                $ebook->image_path = url($ebook->image_path);
            }

            return response()->json($ebook, 200);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'EBook tidak ditemukan'], 404);
        }
    }

    /**
     * ✏️ Update eBook (flush cache)
     */
    public function update(Request $request, $id)
    {
        try {
            $ebook = EBook::findOrFail($id);

            $request->validate([
                'title'       => 'required|string|max:255',
                'description' => 'required|string',
                'image'       => 'nullable|image|max:2048',
            ]);

            $imagePath = $ebook->image_path;

            if ($request->hasFile('image')) {
                if ($ebook->image_path && str_contains($ebook->image_path, '/storage/ebooks/')) {
                    $oldPath = str_replace('/storage/', '', $ebook->image_path);
                    Storage::delete('public/' . $oldPath);
                }

                $image = $request->file('image');
                $fileName = 'ebook_' . Str::random(40) . '.' . $image->getClientOriginalExtension();
                Storage::makeDirectory('public/ebooks');
                $image->storeAs('public/ebooks', $fileName);
                $imagePath = '/storage/ebooks/' . $fileName;
            }

            $ebook->update([
                'title'       => $request->title,
                'description' => $request->description,
                'image_path'  => $imagePath,
            ]);

            Cache::forget('ebooks_all');

            return response()->json($ebook, 200);
        } catch (\Throwable $e) {
            Log::error('🔥 EBook update error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Gagal memperbarui eBook'], 500);
        }
    }

    /**
     * 🗑️ Hapus eBook (flush cache)
     */
    public function destroy($id)
    {
        try {
            $ebook = EBook::findOrFail($id);

            if ($ebook->image_path && str_contains($ebook->image_path, '/storage/ebooks/')) {
                $filePath = str_replace('/storage/', '', $ebook->image_path);
                Storage::delete('public/' . $filePath);
            }

            $ebook->delete();
            Cache::forget('ebooks_all');

            return response()->json([], 204);
        } catch (\Throwable $e) {
            Log::error('🔥 EBook delete error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Gagal menghapus eBook'], 500);
        }
    }
}
