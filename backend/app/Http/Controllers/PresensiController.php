<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Presensi;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\RfidLog;
use App\Models\Student;

class PresensiController extends Controller
{
    public function index(Request $request)
    {
        try {
            $kelas = $request->input('kelas');
            $jurusan = $request->input('jurusan');

            $query = Presensi::with('student:id,nama,nisn,kelas,jurusan,no_absen')
                ->when($kelas, fn($q) => $q->whereHas('student', fn($s) => $s->where('kelas', $kelas)))
                ->when($jurusan, fn($q) => $q->whereHas('student', fn($s) => $s->where('jurusan', $jurusan)))
                ->orderBy('date', 'desc');

            $presensis = $query->get()->map(function ($p) {
                return [
                    'id' => $p->id,
                    'nama' => $p->student->nama ?? '-',
                    'nisn' => $p->student->nisn ?? '-',
                    'kelas' => $p->student->kelas ?? '-',
                    'jurusan' => $p->student->jurusan ?? '-',
                    'no_absen' => $p->student->no_absen ?? '-',
                    'status' => $p->status,
                    'date' => $p->date,
                ];
            });

            return response()->json(['success' => true, 'data' => $presensis]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data presensi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function processToday()
{
    $today = Carbon::today();

    $scannedUids = RfidLog::whereDate('scanned_at', $today)
        ->pluck('uid')
        ->unique()
        ->toArray();

    $students = Student::all();
    $hadir = 0;
    $tidakHadir = 0;

    foreach ($students as $student) {
        $status = in_array($student->uid, $scannedUids) ? 'hadir' : 'tidak hadir';

        Presensi::updateOrCreate(
            ['student_id' => $student->id, 'date' => $today],
            ['status' => $status]
        );

        $status === 'hadir' ? $hadir++ : $tidakHadir++;
    }

    return response()->json([
        'success' => true,
        'message' => 'Presensi hari ini berhasil diproses',
        'total_siswa' => $students->count(),
        'hadir' => $hadir,
        'tidak_hadir' => $tidakHadir,
    ]);
}

}
