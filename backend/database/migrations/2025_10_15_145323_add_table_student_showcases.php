<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('student_showcases', function (Blueprint $table) {
            $table->id();
            $table->string('student_name')->index();
            $table->string('student_class')->nullable()->index();
            $table->string('student_major')->nullable()->index(); 
            $table->string('contact_number');
            $table->string('title')->index(); 
            $table->string('slug')->unique(); 
            $table->text('description');
            $table->string('image_url')->nullable();
            $table->string('project_link')->nullable();
            $table->enum('status', ['draft', 'published'])->default('published')->index(); 
            $table->timestamps();

            $table->index(['student_major', 'status']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('student_showcases');
    }
};