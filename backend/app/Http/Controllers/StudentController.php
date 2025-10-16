<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    public function index()
    {
        $students = Student::all();
        return response()->json($students);
    }

    public function store(Request $request)
    {
        try {
            $id = $request->input('id');

            $rules = [
                'nama' => 'required|string|max:255',
                'nisn' => 'required|string|max:20|unique:students,nisn,' . $id,
                'kelas' => 'required|string|max:10',
                'jurusan' => 'required|string|max:50',
                'no_absen' => 'required|integer|min:1',
                'uid' => 'nullable|string|unique:students,uid,' . $id,
            ];

            $validated = $request->validate($rules);

            if ($id) {
            
                $student = Student::findOrFail($id);
                $student->update($validated);
                $message = 'Siswa berhasil diperbarui.';
                $validated['password'] = Hash::make('password123');
                $student = Student::create($validated);
                $message = 'Siswa berhasil ditambahkan.';
            }

            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => $student,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getFile() . ':' . $e->getLine(),
            ], 500);
        }
    }

    public function show($id)
    {
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['message' => 'Siswa tidak ditemukan.'], 404);
        }
        return response()->json($student);
    }

    public function destroy($id)
    {
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['message' => 'Siswa tidak ditemukan.'], 404);
        }

        $student->delete();
        return response()->json(['success' => true, 'message' => 'Siswa berhasil dihapus.']);
    }
}
