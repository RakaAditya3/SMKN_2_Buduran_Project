<?php

namespace App\Http\Controllers;

use App\Models\EBook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use App\Models\Student;
use Illuminate\Support\Facades\Hash;

class EBookController extends Controller
{
    /**
     * Login siswa (token student_token)
     */
    public function login(Request $request)
    {
        $request->validate([
            'nisn' => 'required|string',
            'password' => 'required|string',
        ]);

        $student = Student::where('nisn', $request->nisn)->first();

        if (!$student || !Hash::check($request->password, $student->password)) {
            return response()->json(['success' => false, 'message' => 'NISN atau Password salah'], 401);
        }

        $student->tokens()->delete();
        $token = $student->createToken('student_token', ['student'])->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'token' => $token,
            'user' => $student,
        ]);
    }

    /**
     * Ambil semua eBook (dengan cache Redis selama 1 jam)
     */
    public function index()
    {
        try {
            // ✅ Gunakan cache key unik agar tidak bentrok
            $cacheKey = 'ebooks_all';

            $ebooks = Cache::remember($cacheKey, 3600, function () {
                return EBook::all()->map(function ($ebook) {
                    if ($ebook->image_path && !str_starts_with($ebook->image_path, 'http')) {
                        $ebook->image_path = url($ebook->image_path);
                    }
                    return $ebook;
                });
            });

            return response()->json([
                'success' => true,
                'data' => $ebooks,
            ]);
        } catch (\Throwable $e) {
            Log::error('EBook index cache error', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Tambah eBook baru (flush cache agar data segar)
     */
    public function store(Request $request)
    {
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

        // ✅ Hapus cache agar data eBook diindex() di-refresh
        Cache::forget('ebooks_all');

        return response()->json([
            'success' => true,
            'message' => 'EBook berhasil ditambahkan.',
            'data'    => $ebook,
        ], 201);
    }

    /**
     * Detail eBook berdasarkan ID (tanpa cache agar data selalu real-time)
     */
    public function show($id)
    {
        $ebook = EBook::findOrFail($id);

        if ($ebook->image_path && !str_starts_with($ebook->image_path, 'http')) {
            $ebook->image_path = url($ebook->image_path);
        }

        return response()->json([
            'success' => true,
            'data' => $ebook,
        ]);
    }

    /**
     * Update eBook (flush cache setelah update)
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

            // ✅ Flush cache agar data diindex() segar
            Cache::forget('ebooks_all');

            return response()->json([
                'success' => true,
                'message' => 'EBook berhasil diperbarui.',
                'data'    => $ebook,
            ]);
        } catch (\Throwable $e) {
            Log::error('EBook update error', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Hapus eBook (flush cache setelah delete)
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

            // ✅ Flush cache agar data diindex() segar
            Cache::forget('ebooks_all');

            return response()->json([
                'success' => true,
                'message' => 'EBook berhasil dihapus.',
            ]);
        } catch (\Throwable $e) {
            Log::error('EBook delete error', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
