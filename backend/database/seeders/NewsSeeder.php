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
        'title' => 'Kunjungan SMKN JENAWI JATENG ke SMKN 2 BUDURAN',
        'description' => 'Kunjungan silaturahmi SMKN Jenawi Jateng ke SMKN 2 Buduran untuk mempererat hubungan antar sekolah.',
        'slug' => Str::slug('Kunjungan SMKN JENAWI JATENG ke SMKN 2 BUDURAN'),
        'published_at' => '2025-11-09 08:00:00',
        'category_id' => 2,
        'thumbnail' => 'https://kmzmzmrdwbaaibcgqowh.supabase.co/storage/v1/object/public/images/news/news1.jpg',
        'content' => 'SMKN 2 Buduran menyambut kedatangan rombongan dari SMKN Jenawi Jateng. Kunjungan ini bertujuan untuk mempererat hubungan antar sekolah serta berbagi pengalaman dalam pengembangan pendidikan dan kegiatan siswa.',
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'title' => 'Kegiatan Jum’at “Berseri” Bersih Sehat Religi',
        'description' => 'Program rutin Jum’at Berseri untuk membentuk lingkungan sekolah yang bersih, sehat, dan religius.',
        'slug' => Str::slug('Kegiatan Jum’at “Berseri” Bersih Sehat Religi'),
        'published_at' => '2025-09-12 10:30:00',
        'category_id' => 2, 
        'thumbnail' => 'https://kmzmzmrdwbaaibcgqowh.supabase.co/storage/v1/object/public/images/news/news2.jpg',
        'content' => 'Setiap hari Jumat, SMKN 2 Buduran melaksanakan kegiatan Jum’at Berseri (Bersih, Sehat, Religi). Kegiatan ini melibatkan siswa, guru, dan staf dalam menjaga kebersihan sekolah, menjaga kesehatan, serta memperkuat nilai-nilai religius.',
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'title' => 'Selamat! Dinda Dwi Wulandari Juara 1 Karate Provinsi Jawa Timur',
        'description' => 'Prestasi membanggakan dari Dinda Dwi Wulandari sebagai Juara 1 Karate tingkat Provinsi Jawa Timur.',
        'slug' => Str::slug('Selamat! Dinda Dwi Wulandari Juara 1 Karate Provinsi Jawa Timur'),
        'published_at' => '2025-09-09 10:30:00',
        'category_id' => 1, 
        'thumbnail' => 'https://kmzmzmrdwbaaibcgqowh.supabase.co/storage/v1/object/public/images/news/news3.jpg',
        'content' => 'Dinda Dwi Wulandari, siswi SMKN 2 Buduran, berhasil meraih Juara 1 dalam kejuaraan Karate tingkat Provinsi Jawa Timur. Prestasi ini menjadi kebanggaan bagi sekolah dan memotivasi siswa lain untuk terus berprestasi.',
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'title' => 'Kegiatan Pengimbasan Implementasi Pembelajaran Mendalam',
        'description' => 'SMKN 2 Buduran melaksanakan pengimbasan terkait implementasi pembelajaran mendalam.',
        'slug' => Str::slug('Kegiatan Pengimbasan Implementasi Pembelajaran Mendalam'),
        'published_at' => '2025-08-25 10:30:00',
        'category_id' => 2, 
        'thumbnail' => 'https://kmzmzmrdwbaaibcgqowh.supabase.co/storage/v1/object/public/images/news/news4.jpg',
        'content' => 'Dalam rangka meningkatkan kualitas pembelajaran, SMKN 2 Buduran mengadakan kegiatan pengimbasan implementasi pembelajaran mendalam. Acara ini diikuti oleh guru dan siswa untuk menguatkan pemahaman serta praktik pembelajaran berbasis proyek.',
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'title' => 'Kegiatan “Pitulasan” Memperingati HUT RI yang ke 80',
        'description' => 'SMKN 2 Buduran menyelenggarakan kegiatan Pitulasan untuk meriahkan HUT RI ke-80.',
        'slug' => Str::slug('Kegiatan “Pitulasan” Memperingati HUT RI yang ke 80'),
        'published_at' => '2025-08-27 10:30:00',
        'category_id' => 2, 
        'thumbnail' => 'https://kmzmzmrdwbaaibcgqowh.supabase.co/storage/v1/object/public/images/news/news5.jpg',
        'content' => 'Dalam rangka memperingati Hari Ulang Tahun Republik Indonesia ke-80, SMKN 2 Buduran mengadakan kegiatan Pitulasan. Acara ini diisi dengan berbagai lomba, upacara, dan kegiatan kebersamaan yang penuh semangat kebangsaan.',
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'title' => 'Selamat! ananda Rafqa Pietra Juara 2 Lomba Vlog Universitas Brawijaya',
        'description' => 'Rafqa Pietra, siswa SMKN 2 Buduran, meraih Juara 2 dalam Lomba Vlog Universitas Brawijaya.',
        'slug' => Str::slug('Selamat! ananda Rafqa Pietra Juara 2 Lomba Vlog Universitas Brawijaya'),
        'published_at' => '2025-08-15 10:30:00',
        'category_id' => 1, 
        'thumbnail' => 'https://kmzmzmrdwbaaibcgqowh.supabase.co/storage/v1/object/public/images/news/news6.jpg',
        'content' => 'Rafqa Pietra, siswa SMKN 2 Buduran, berhasil meraih Juara 2 dalam kompetisi Vlog yang diselenggarakan Universitas Brawijaya. Karya kreatifnya diapresiasi oleh juri dan menjadi inspirasi bagi siswa lain untuk berkarya.',
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'title' => 'Gubernur Khofifah Beri Apresiasi Kepala SMK Negeri 2 Buduran',
        'description' => 'Gubernur Jawa Timur, Khofifah Indar Parawansa, memberikan apresiasi kepada Kepala SMKN 2 Buduran.',
        'slug' => Str::slug('Gubernur Khofifah Beri Apresiasi Kepala SMK Negeri 2 Buduran'),
        'published_at' => '2025-03-05 10:30:00',
        'category_id' => 1, 
        'thumbnail' => 'https://kmzmzmrdwbaaibcgqowh.supabase.co/storage/v1/object/public/images/news/news7.jpg',
        'content' => 'Dalam kunjungannya, Gubernur Jawa Timur Khofifah Indar Parawansa memberikan apresiasi atas kepemimpinan Kepala SMKN 2 Buduran yang dinilai berhasil meningkatkan mutu pendidikan dan berbagai prestasi sekolah.',
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'title' => 'Alhamdulillah Mohammad Rifal Al Fahri XII RPL SMKN 2 Buduran meraih Juara 3 IT SOFTWARE SOLUTIONS FOR BUSINESS',
        'description' => 'Mohammad Rifal Al Fahri berhasil meraih Juara 3 IT Software Solutions for Business tingkat nasional.',
        'slug' => Str::slug('Alhamdulillah Mohammad Rifal Al Fahri XII RPL SMKN 2 Buduran meraih Juara 3 IT SOFTWARE SOLUTIONS FOR BUSINESS'),
        'published_at' => '2025-04-26 10:30:00',
        'category_id' => 1, 
        'thumbnail' => 'https://kmzmzmrdwbaaibcgqowh.supabase.co/storage/v1/object/public/images/news/news8.jpg',
        'content' => 'Prestasi membanggakan kembali diraih siswa SMKN 2 Buduran. Mohammad Rifal Al Fahri dari jurusan RPL kelas XII berhasil meraih Juara 3 dalam kompetisi IT Software Solutions for Business tingkat nasional.',
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'title' => 'Kegiatan Magang Mahasiswa UMSIDA',
        'description' => 'Mahasiswa UMSIDA melaksanakan kegiatan magang di SMKN 2 Buduran.',
        'slug' => Str::slug('Kegiatan Magang Mahasiswa UMSIDA'),
        'published_at' => '2025-08-12 10:30:00',
        'category_id' => 2, 
        'thumbnail' => 'https://kmzmzmrdwbaaibcgqowh.supabase.co/storage/v1/object/public/images/news/news9.jpg',
        'content' => 'Sebagai bentuk kerjasama antar lembaga pendidikan, mahasiswa Universitas Muhammadiyah Sidoarjo (UMSIDA) melaksanakan kegiatan magang di SMKN 2 Buduran. Program ini bertujuan untuk memberikan pengalaman praktis di dunia pendidikan.',
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'title' => 'Prestasi Keagamaan dari KEMENAG untuk SMKN 2 Buduran',
        'description' => 'Kementerian Agama memberikan penghargaan atas prestasi keagamaan siswa SMKN 2 Buduran.',
        'slug' => Str::slug('Prestasi Keagamaan dari KEMENAG untuk SMKN 2 Buduran'),
        'published_at' => '2025-09-12 10:30:00',
        'category_id' => 1, 
        'thumbnail' => 'https://kmzmzmrdwbaaibcgqowh.supabase.co/storage/v1/object/public/images/news/news10.jpg',
        'content' => 'SMKN 2 Buduran menerima penghargaan dari Kementerian Agama atas berbagai prestasi keagamaan yang diraih oleh para siswanya. Penghargaan ini diharapkan memotivasi siswa untuk terus meningkatkan keimanan dan prestasi spiritual.',
        'created_at' => now(),
        'updated_at' => now(),
    ],
]

        );
    }
}
