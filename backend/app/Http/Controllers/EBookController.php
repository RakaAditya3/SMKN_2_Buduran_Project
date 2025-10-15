<?php

namespace App\Http\Controllers;

use App\Models\EBook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use App\Http\Resources\EBookResource;
use Illuminate\Support\Facades\Log;
use App\Models\Student;
use Illuminate\Support\Facades\Hash;


class EBookController extends Controller
{

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

    // 🔥 tambahkan ability student
    $token = $student->createToken('student_token', ['student'])->plainTextToken;

    return response()->json([
        'success' => true,
        'message' => 'Login berhasil',
        'token' => $token,
        'user' => $student,
    ]);
}

    public function index()
    {
        $ebooks = EBook::all();
        return EBookResource::collection($ebooks);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'image'       => 'nullable|image|max:2048',
        ]);

        $imageUrl = null;

        if ($request->hasFile('image')) {
            $image    = $request->file('image');
            $fileName = 'ebooks/' . Str::random(40) . '.' . $image->getClientOriginalExtension();
            $bucket   = 'images';

            $response = Http::withToken(env('SUPABASE_KEY'))
                ->attach('file', fopen($image->getRealPath(), 'r'), $fileName)
                ->post(env('SUPABASE_URL') . "/storage/v1/object/$bucket/$fileName?upsert=true");

            if ($response->failed()) {
                Log::error('Supabase upload failed (store)', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return response()->json([
                    'message' => 'Upload gagal',
                    'error' => $response->body()
                ], 500);
            }

            $imageUrl = rtrim(env('SUPABASE_URL'), '/') . "/storage/v1/object/public/$bucket/$fileName";
        }

        $ebook = EBook::create([
            'title'       => $request->title,
            'description' => $request->description,
            'image_path'  => $imageUrl,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'EBook uploaded successfully',
            'ebook'   => $ebook,
        ], 201);
    }

    public function show($id)
    {
        $ebook = EBook::findOrFail($id);

        return response()->json([
            'data' => $ebook
        ]);
    }


    public function update(Request $request, $id)
    {
        try {
            $ebook = EBook::findOrFail($id);

            $request->validate([
                'title'       => 'required|string|max:255',
                'description' => 'required|string',
                'image'       => 'nullable|image|max:2048',
            ]);

            $imageUrl = $ebook->image_path;


            if ($request->hasFile('image')) {
                $image    = $request->file('image');
                $fileName = 'ebooks/' . Str::random(40) . '.' . $image->getClientOriginalExtension();
                $bucket   = 'images';

                $response = Http::withToken(env('SUPABASE_KEY'))
                    ->attach('file', fopen($image->getRealPath(), 'r'), $fileName)
                    ->post(env('SUPABASE_URL') . "/storage/v1/object/$bucket/$fileName?upsert=true");

                if ($response->failed()) {
                    Log::error('Supabase upload failed (update)', [
                        'status' => $response->status(),
                        'body' => $response->body(),
                    ]);

                    return response()->json([
                        'success' => false,
                        'message' => 'Upload gambar gagal',
                        'error' => $response->body(),
                    ], 500);
                }

                $imageUrl = rtrim(env('SUPABASE_URL'), '/') . "/storage/v1/object/public/$bucket/$fileName";
            }

            $ebook->update([
                'title'       => $request->title,
                'description' => $request->description,
                'image_path'  => $imageUrl,
            ]);

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


    public function destroy($id)
    {
        try {
            $ebook = EBook::findOrFail($id);

            $ebook->delete();

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
