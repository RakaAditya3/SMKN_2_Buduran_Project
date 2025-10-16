<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('student_showcases', function (Blueprint $table) {
            $table->id();
            $table->string('student_name')->index(); // 🔹 sering dipakai untuk filter / pencarian
            $table->string('student_class')->nullable()->index(); // 🔹 untuk grouping data
            $table->string('student_major')->nullable()->index(); // 🔹 filter berdasarkan jurusan
            $table->string('contact_number');
            $table->string('title')->index(); // 🔹 untuk pencarian cepat di judul karya
            $table->string('slug')->unique(); // 🔹 tetap unique untuk akses detail
            $table->text('description');
            $table->string('image_url')->nullable();
            $table->string('project_link')->nullable();
            $table->enum('status', ['draft', 'published'])->default('published')->index(); // 🔹 bantu filter status
            $table->timestamps();

            // 🔸 Kombinasi index untuk query kompleks (misalnya filter jurusan + status)
            $table->index(['student_major', 'status']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('student_showcases');
    }
};
