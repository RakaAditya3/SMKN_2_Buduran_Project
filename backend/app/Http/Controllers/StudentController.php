<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class StudentController extends Controller
{
    /**
     * 🔍 Ambil semua siswa
     */
    public function index()
    {
        try {
            $students = Student::all();

            return response()->json([
                'success' => true,
                'data' => $students,
            ]);
        } catch (\Throwable $e) {
            Log::error('Student index error', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data siswa',
                'error' => $e->getMessage(),
            ], 500);
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

            // ✅ Pastikan UID selalu uppercase jika diisi
            if (!empty($validated['uid'])) {
                $validated['uid'] = strtoupper(trim($validated['uid']));
            }

            if ($id) {
                // 🔹 Update data siswa
                $student = Student::findOrFail($id);
                $student->update($validated);
                $message = 'Siswa berhasil diperbarui.';
            } else {
                // 🔹 Tambah siswa baru
                $validated['password'] = Hash::make('password123');
                $student = Student::create($validated);
                $message = 'Siswa baru berhasil ditambahkan.';
            }

            return response()->json([
                'success' => true,
                'message' => $message,
                'data'    => $student,
            ]);
        } catch (\Throwable $e) {
            Log::error('Student store error', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan data siswa',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * 📄 Tampilkan detail siswa berdasarkan ID
     */
    public function show($id)
    {
        $student = Student::find($id);

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Siswa tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $student,
        ]);
    }

    /**
     * 🗑️ Hapus siswa
     */
    public function destroy($id)
    {
        $student = Student::find($id);

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Siswa tidak ditemukan.',
            ], 404);
        }

        $student->delete();

        return response()->json([
            'success' => true,
            'message' => 'Siswa berhasil dihapus.',
        ]);
    }
}
