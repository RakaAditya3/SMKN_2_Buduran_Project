<?php
namespace App\Http\Controllers;

use App\Models\RfidLog;
use Illuminate\Http\Request;

class RfidLogController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'uid' => 'required|string',
        ]);

        $log = RfidLog::create([
            'uid' => $request->uid,
            'scanned_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'UID berhasil disimpan',
            'data' => $log
        ]);
    }
}
