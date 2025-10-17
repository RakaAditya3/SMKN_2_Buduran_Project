<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Cache;
use App\Models\Student;
use App\Models\RfidLog;
use Carbon\Carbon;
use Illuminate\Http\Request;

class RfidLogController extends Controller
{

   public function store(Request $request)
{
    $uid = strval(trim($request->uid));

    RfidLog::create([
        'uid' => $uid,
        'scanned_at' => now(),
    ]);

    $student = Student::where('uid', $uid)->first();

    if ($student) {
        Cache::put("scan:{$uid}", $student->nama, now()->addMinutes(2));
    }

    return response()->json([
        'uid' => $uid,
        'student' => $student?->nama,
        'status' => $student ? 'cached' : 'unknown',
    ]);
}


    public function checkScan($uid)
    {
        $uid = strtoupper(trim($uid));
        $studentName = Cache::get("scan:{$uid}");

        if ($studentName) {
            return response()->json([
                'uid' => $uid,
                'student' => $studentName,
                'status' => 'cached'
            ]);
        }

        return response()->json([
            'uid' => $uid,
            'student' => null,
            'status' => 'not found in cache'
        ]);
    }
}