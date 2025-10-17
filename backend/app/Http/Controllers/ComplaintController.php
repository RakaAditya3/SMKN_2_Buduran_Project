<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class ComplaintController extends Controller
{
    /**
     * Menampilkan daftar pengaduan (dengan cache Redis selama 10 menit)
     */
    public function index()
    {
        try {
            // ✅ Key cache unik supaya aman
            $cacheKey = 'complaints_list';

            // Ambil dari cache, kalau tidak ada ambil dari DB dan simpan ke cache
            $complaints = Cache::remember($cacheKey, 600, function () {
                return Complaint::orderBy('created_at', 'desc')->get();
            });

            return response()->json($complaints);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'error'   => $e->getMessage(),
                'trace'   => $e->getFile() . ':' . $e->getLine(),
            ], 500);
        }
    }

    /**
     * Menyimpan pengaduan baru
     */
    public function store(Request $request)
    {
        $request->validate([
            'email'   => 'required|email',
            'message' => 'required|string',
        ]);

        $ticketNumber = str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);

        $complaint = Complaint::create([
            'email'         => $request->email,
            'message'       => $request->message,
            'ticket_number' => $ticketNumber,
        ]);

        // ✅ Flush cache agar daftar terbaru muncul saat index dipanggil lagi
        Cache::forget('complaints_list');

        // Kirim email konfirmasi
        Mail::raw("Terima kasih sudah mengirim pengaduan.\n\nNomor Ticket Anda: {$ticketNumber}\nStatus: Ditinjau", function ($message) use ($complaint) {
            $message->to($complaint->email)
                    ->subject('Pengaduan Anda Sedang Diproses');
        });

        return response()->json([
            'success'        => true,
            'ticket_number'  => $ticketNumber,
        ]);
    }

    /**
     * Menampilkan detail pengaduan berdasarkan ticket_number
     * (tanpa cache agar data status/admin_note selalu real-time)
     */
    public function show($ticketNumber)
    {
        $complaint = Complaint::where('ticket_number', $ticketNumber)->first();

        if (!$complaint) {
            return response()->json(['message' => 'Ticket tidak ditemukan'], 404);
        }

        return response()->json($complaint);
    }

    /**
     * Memperbarui status atau admin note pengaduan
     * (otomatis flush cache agar index() menampilkan data terbaru)
     */
    public function update(Request $request, $id)
    {
        $complaint = Complaint::findOrFail($id);

        $complaint->update([
            'status'     => $request->status ?? $complaint->status,
            'admin_note' => $request->admin_note ?? $complaint->admin_note,
        ]);

        // ✅ Hapus cache agar daftar complaint di index() diperbarui
        Cache::forget('complaints_list');

        // Kirim notifikasi update via email
        $message = "Status pengaduan Anda dengan Ticket {$complaint->ticket_number} telah diperbarui.\n\n";
        $message .= "Status: {$complaint->status}\n";
        if ($complaint->admin_note) {
            $message .= "Catatan: {$complaint->admin_note}";
        }

        Mail::raw($message, function ($msg) use ($complaint) {
            $msg->to($complaint->email)
                ->subject("Update Status Pengaduan #{$complaint->ticket_number}");
        });

        return response()->json([
            'success' => true,
            'data'    => $complaint,
        ]);
    }
}
