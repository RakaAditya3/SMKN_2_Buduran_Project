<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class StudentController extends Controller
{
    /**
     * 🔍 Ambil semua siswa
     */
    public function index()
    {
        try {
            $students = Student::all();
            return response()->json($students, 200);
        } catch (\Throwable $e) {
            Log::error('🔥 Student index error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Gagal mengambil data siswa'], 500);
        }
    }

    /**
     * 💾 Tambah / Update data siswa
     */
    public function store(Request $request)
    {
        try {
            $id = $request->input('id');

            $rules = [
                'nama'     => 'required|string|max:255',
                'nisn'     => 'required|string|max:20|unique:students,nisn,' . $id,
                'kelas'    => 'required|string|max:10',
                'jurusan'  => 'required|string|max:50',
                'no_absen' => 'required|integer|min:1',
                'uid'      => 'nullable|string|unique:students,uid,' . $id,
            ];

            $validated = $request->validate($rules);
        } catch (ValidationException $e) {
            return response()->json($e->errors(), 422);
        }

        try {
            // ✅ UID selalu uppercase jika diisi
            if (!empty($validated['uid'])) {
                $validated['uid'] = strtoupper(trim($validated['uid']));
            }

            if ($id) {
                // 🔹 Update data siswa
                $student = Student::find($id);
                if (!$student) {
                    return response()->json(['message' => 'Siswa tidak ditemukan'], 404);
                }
                $student->update($validated);
            } else {
                // 🔹 Tambah siswa baru
                $validated['password'] = Hash::make('password123');
                $student = Student::create($validated);
            }

            return response()->json($student, $id ? 200 : 201);
        } catch (\Throwable $e) {
            Log::error('🔥 Student store error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Gagal menyimpan data siswa'], 500);
        }
    }

    /**
     * 📄 Tampilkan detail siswa berdasarkan ID
     */
    public function show($id)
    {
        try {
            $student = Student::find($id);

            if (!$student) {
                return response()->json(['message' => 'Siswa tidak ditemukan'], 404);
            }

            return response()->json($student, 200);
        } catch (\Throwable $e) {
            Log::error('🔥 Student show error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Gagal mengambil data siswa'], 500);
        }
    }

    /**
     * 🗑️ Hapus siswa
     */
    public function destroy($id)
    {
        try {
            $student = Student::find($id);

            if (!$student) {
                return response()->json(['message' => 'Siswa tidak ditemukan'], 404);
            }

            $student->delete();
            return response()->json(['message' => 'Siswa berhasil dihapus'], 200);
        } catch (\Throwable $e) {
            Log::error('🔥 Student delete error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Gagal menghapus data siswa'], 500);
        }
    }
}
