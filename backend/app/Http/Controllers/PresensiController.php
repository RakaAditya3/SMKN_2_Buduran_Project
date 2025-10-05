<?php
namespace App\Http\Controllers;

use App\Models\RfidLog;
use App\Models\Student;
use App\Models\Presensi;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PresensiController extends Controller
{
    public function processToday()
    {
        $today = Carbon::today();

        $scannedUids = RfidLog::whereDate('scanned_at', $today)
            ->pluck('uid')
            ->unique()
            ->toArray();

        $students = Student::all();

        foreach ($students as $student) {
            $status = in_array($student->uid, $scannedUids) ? 'hadir' : 'tidak hadir';

            Presensi::updateOrCreate(
                ['student_id' => $student->id, 'date' => $today],
                ['status' => $status]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Presensi hari ini berhasil diproses',
        ]);
    }

    public function check($uid)
    {
        $student = Student::where('uid', $uid)->firstOrFail();
        $today = Carbon::today();

        $presensi = Presensi::where('student_id', $student->id)
            ->where('date', $today)
            ->first();

        return response()->json([
            'student' => $student->name,
            'date' => $today->toDateString(),
            'status' => $presensi->status ?? 'belum diproses',
        ]);
    }
}
