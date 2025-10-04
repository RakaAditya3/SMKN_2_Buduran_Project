<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ComplaintController extends Controller
{

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

        Mail::raw("Terima kasih sudah mengirim pengaduan.\n\nNomor Ticket Anda: {$ticketNumber}\nStatus: Ditinjau", function ($message) use ($complaint) {
            $message->to($complaint->email)
                    ->subject('Pengaduan Anda Sedang Diproses');
        });

        return response()->json([
            'success' => true,
            'ticket_number' => $ticketNumber,
        ]);
    }

    public function show($ticketNumber)
    {
        $complaint = Complaint::where('ticket_number', $ticketNumber)->first();

        if (!$complaint) {
            return response()->json(['message' => 'Ticket tidak ditemukan'], 404);
        }

        return response()->json($complaint);
    }

    public function update(Request $request, $id)
    {
        $complaint = Complaint::findOrFail($id);

        $complaint->update([
            'status'     => $request->status ?? $complaint->status,
            'admin_note' => $request->admin_note ?? $complaint->admin_note,
        ]);
        
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
