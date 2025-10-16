<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rfid_logs', function (Blueprint $table) {
            $table->id();

            // UID siswa / tag RFID
            $table->string('uid')->index('idx_uid'); // 🔹 Index untuk pencarian UID cepat

            // Waktu pemindaian RFID
            $table->timestamp('scanned_at')->useCurrent()->index('idx_scanned_at'); // 🔹 Index untuk filter/sort tanggal

            // 🔹 (Opsional tapi sangat direkomendasikan)
            // Jika kamu ingin banyak query gabungan (misal UID + tanggal)
            $table->index(['uid', 'scanned_at'], 'idx_uid_scanned_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rfid_logs');
    }
};
