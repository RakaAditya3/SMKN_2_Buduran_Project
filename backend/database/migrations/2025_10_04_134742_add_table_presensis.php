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
        Schema::create('presensis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')
                ->constrained('students')
                ->onDelete('cascade');

            $table->date('date');
            $table->enum('status', ['hadir', 'tidak hadir'])->default('tidak hadir');
            $table->timestamps();

            /**
             * 🔹 INDEX OPTIMISASI
             * 1. unique(['student_id', 'date']) → menjamin 1 siswa per hari 1 record.
             * 2. index('date') → mempercepat query harian/bulanan.
             * 3. index(['student_id', 'status']) → mempercepat rekap siswa & filter status.
             * 4. index('status') → mempercepat total hadir/tidak hadir per hari.
             */
            $table->unique(['student_id', 'date']);
            $table->index('date');
            $table->index(['student_id', 'status']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presensis');
    }
};
