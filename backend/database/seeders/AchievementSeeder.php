<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AchievementSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('achievements')->insert([
            [
                'title' => 'Lomba Senam Pramuka',
                'description' => 'Juara 1 Lomba Senam Pramuka Tingkat Kabupaten/Kota.',
                'student_name' => 'Tim Pramuka SMKN 2 Buduran',
                'slug' => Str::slug('Lomba Senam Pramuka'),
                'published_at' => '2014-05-15 09:00:00',
                'category_id' => 2, // Asumsi 'Prestasi' memiliki ID 2
                'thumbnail' => 'thumbnails/senam_pramuka.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Kepala SMK Inovatif Terfavorit',
                'description' => 'Penghargaan untuk Kepala SMK Inovatif Terfavorit Tingkat Nasional.',
                'student_name' => 'Kepala Sekolah',
                'slug' => Str::slug('Kepala SMK Inovatif Terfavorit'),
                'published_at' => '2024-01-20 14:00:00',
                'category_id' => 2, // Asumsi 'Prestasi' memiliki ID 2
                'thumbnail' => 'thumbnails/kepala_sekolah.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
