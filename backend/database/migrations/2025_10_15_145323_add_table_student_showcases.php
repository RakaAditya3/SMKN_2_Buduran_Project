<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('student_showcases', function (Blueprint $table) {
            $table->id();
            $table->string('student_name');
            $table->string('student_class')->nullable();
            $table->string('student_major')->nullable();
            $table->string('contact_number');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('image_url')->nullable();
            $table->string('project_link')->nullable();
            $table->enum('status', ['draft', 'published'])->default('published');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('student_showcases');
    }
};
