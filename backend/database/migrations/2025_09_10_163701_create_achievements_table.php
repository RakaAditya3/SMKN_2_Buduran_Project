<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('student_name');
            $table->string('slug')->unique();
            $table->dateTime('published_at');
            $table->foreignId('category_id')->constrained('categories');
            $table->string('thumbnail');
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('achievements');
    }
};
