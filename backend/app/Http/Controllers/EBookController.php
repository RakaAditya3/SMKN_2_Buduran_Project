<?php

namespace App\Http\Controllers;

use App\Models\EBook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\Student;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

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
        return response()->json($ebooks);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|max:2048', // max 2MB
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = Str::random(40) . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('ebooks/images', $imageName, 'public');
        }

        $ebook = EBook::create([
            'title' => $request->title,
            'description' => $request->description,
            'image_path' => $imagePath,
        ]);

        return response()->json([
            'message' => 'EBook uploaded successfully',
            'ebook' => $ebook,
        ], 201);
    }


    public function show($id)
{
    $ebook = Ebook::findOrFail($id);
    return response()->json($ebook);
    }
}