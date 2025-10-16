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
            $table->string('name')->index(); // 🔍 sering dicari (filter, search)
            $table->string('address')->index(); // 🔍 sering dipakai di filter
            $table->string('website')->nullable()->index(); // 🔍 bisa digunakan untuk filter/pencarian
            $table->string('logo')->nullable();
            $table->timestamps();

            // ✅ Gabungan index opsional untuk mempercepat multi-filter (name + address)
            $table->index(['name', 'address'], 'idx_name_address');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
