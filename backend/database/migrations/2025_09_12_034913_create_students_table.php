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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('nisn')->unique(); // unik untuk identifikasi siswa
            $table->string('password');       // bcrypt untuk login eLibrary
            $table->string('uid')->unique();  // RFID UID, unik untuk absensi
            $table->enum('kelas', ['X', 'XI', 'XII']);
            $table->enum('jurusan', ['RPL', 'DKV', 'BD', 'MP', 'AK', 'LPB']);
            $table->unsignedInteger('no_absen'); // nomor absen dalam kelas
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
