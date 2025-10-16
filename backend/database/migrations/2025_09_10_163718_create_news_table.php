<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('news', function (Blueprint $table) {
            $table->id();
            $table->string('title')->index(); // 🔹 untuk pencarian cepat by title (LIKE)
            $table->text('description');
            $table->string('slug')->unique(); // 🔹 slug unik dan otomatis terindeks
            $table->dateTime('published_at')->index(); // 🔹 untuk sorting/filter
            $table->foreignId('category_id')
                  ->constrained('categories')
                  ->cascadeOnDelete()
                  ->index(); // 🔹 untuk filter by kategori
            $table->string('thumbnail')->nullable();
            $table->longText('content');
            $table->timestamps();

            // 🔹 Kombinasi index untuk pencarian/filter gabungan
            $table->index(['category_id', 'published_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('news');
    }
};
