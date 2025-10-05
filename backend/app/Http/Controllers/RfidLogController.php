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
        $uid = strtoupper(trim($request->uid));


        RfidLog::create([
            'uid' => $uid,
            'scanned_at' => Carbon::now(),
        ]);

        $student = Student::where('uid', $uid)->first();

        Cache::put(
            "scan:{$uid}",
            $student?->nama ?? null,
            now()->addMinutes(2)
        );

        return response()->json([
            'uid' => $uid,
            'message' => 'UID ditemukan',      
            'student' => $student?->nama,       
            'status' => 'cached'
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
