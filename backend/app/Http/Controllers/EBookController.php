<?php

namespace App\Http\Controllers;

use App\Models\EBook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\Student;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use App\Http\Resources\EBookResource;


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
            return response()->json([
                'success' => false,
                'message' => 'NISN atau Password salah'
            ], 401);
        }
    
        // Generate token menggunakan Laravel Sanctum
        $token = $student->createToken('elibrary_token')->plainTextToken;
    
        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'token' => $token,
            'user' => [
                'id' => $student->id,
                'nisn' => $student->nisn,
                'nama' => $student->nama,
                'kelas' => $student->kelas,
                'jurusan' => $student->jurusan,
                'no_absen' => $student->no_absen,
            ]
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
            'image'       => 'nullable|image|max:2048', // max 2MB
        ]);

        $imageUrl = null;

        if ($request->hasFile('image')) {
            $image     = $request->file('image');
            $fileName  = 'ebooks/' . Str::random(40) . '.' . $image->getClientOriginalExtension();

            $response = Http::withToken(env('SUPABASE_KEY'))
                ->attach('file', fopen($image->getRealPath(), 'r'), $fileName)
                ->post(env('SUPABASE_URL')."/storage/v1/object/images/".$fileName);

            if ($response->failed()) {
                return response()->json([
                    'message' => 'Upload gagal',
                    'error'   => $response->body()
                ], 500);
            }

            $imageUrl = env('SUPABASE_URL')."/storage/v1/object/public/images/".$fileName;
        }

        $ebook = EBook::create([
            'title'       => $request->title,
            'description' => $request->description,
            'image_path'  => $imageUrl,
        ]);

        return response()->json([
            'message' => 'EBook uploaded successfully',
            'ebook'   => $ebook,
        ], 201);
    }


   public function show($id)
    {
    $ebook = Ebook::with('records.student')->findOrFail($id);
    $ebook->image_url = $ebook->image_path 
        ? "https://kmzmzmrdwbaaibcgqowh.supabase.co/storage/v1/object/public/{$ebook->image_path}"
        : null;

    return response()->json([
        'data' => $ebook
    ]);
    }

}