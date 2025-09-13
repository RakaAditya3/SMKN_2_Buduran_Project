<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class NewsSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('news')->insert([
            [
                'title' => 'Tahun 2024, SMK Negeri 2 Buduran Berhasil Mengoleksi 102 Penghargaan',
                'description' => 'SMKN 2 Buduran mencatatkan prestasi luar biasa dengan meraih 102 penghargaan di tahun 2024.',
                'slug' => Str::slug('Tahun 2024, SMK Negeri 2 Buduran Berhasil Mengoleksi 102 Penghargaan'),
                'published_at' => '2024-06-01 08:00:00',
                'category_id' => 2, // Asumsi 'Prestasi' memiliki ID 2
                'thumbnail' => 'thumbnails/news_102_awards.jpg',
                'content' => 'SMKN 2 Buduran berhasil meraih 102 penghargaan di berbagai ajang kompetisi, baik di tingkat lokal maupun nasional...',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Belasan Calon Siswa SMKN 2 Buduran Kena Prank SPMB',
                'description' => 'Belasan calon siswa mengalami kekecewaan terkait kesalahan teknis saat pengumuman penerimaan.',
                'slug' => Str::slug('Belasan Calon Siswa SMKN 2 Buduran Kena Prank SPMB'),
                'published_at' => '2024-07-20 10:30:00',
                'category_id' => 1, // Asumsi 'Pendidikan' memiliki ID 1
                'thumbnail' => 'thumbnails/news_spmb.jpg',
                'content' => 'Proses seleksi penerimaan peserta didik baru di SMKN 2 Buduran sempat mengalami kendala teknis yang menyebabkan...',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
