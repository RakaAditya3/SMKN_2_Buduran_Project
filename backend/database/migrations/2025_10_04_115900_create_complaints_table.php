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
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->string('email')->index(); // 🔹 Tambah index untuk pencarian cepat berdasarkan email
            $table->text('message');
            $table->string('ticket_number', 10)->unique(); // 🔹 Sudah unique = otomatis terindex
            $table->enum('status', ['Ditinjau', 'Diproses', 'Selesai'])->default('Ditinjau')->index(); // 🔹 Index untuk filter status
            $table->text('admin_note')->nullable();
            $table->timestamps();

            // 🔹 Index tambahan untuk pengurutan cepat di halaman admin (orderBy created_at)
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
