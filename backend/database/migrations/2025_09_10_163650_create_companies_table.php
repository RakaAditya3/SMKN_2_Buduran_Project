<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name')->index();
            $table->string('address')->index(); 
            $table->string('website')->nullable()->index(); 
            $table->string('logo')->nullable();
            $table->timestamps();

            $table->index(['name', 'address'], 'idx_name_address');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};