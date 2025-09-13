<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExtracurricularSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('extracurriculars')->insert([
            [
                'name' => 'Pramuka',
                'description' => 'Kegiatan kepanduan yang melatih kedisiplinan dan kemandirian.',
                'thumbnail' => 'thumbnails/pramuka.jpg',
                'images' => '["images/pramuka_1.jpg", "images/pramuka_2.jpg"]',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'PMR',
                'description' => 'Palang Merah Remaja yang berfokus pada pertolongan pertama.',
                'thumbnail' => 'thumbnails/pmr.jpg',
                'images' => '["images/pmr_1.jpg"]',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Futsal',
                'description' => 'Ekstrakurikuler olahraga futsal yang aktif di berbagai turnamen.',
                'thumbnail' => 'thumbnails/futsal.jpg',
                'images' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
