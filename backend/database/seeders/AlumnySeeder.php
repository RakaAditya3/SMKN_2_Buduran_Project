<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AlumnySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('alumni')->insert([
            [
                'name' => 'Milzam Ghazian Alhazmi',
                'batch' => 2016,
                'company_id' => 2, // Asumsi 'PT. Awak Media Indonesia' memiliki ID 2
                'photo' => 'photos/milzam.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Bagus Alfan Maulana',
                'batch' => 2018,
                'company_id' => 1, // Asumsi 'PT. Maspion IT' memiliki ID 1
                'photo' => 'photos/bagus.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Wahyu Firman Syahputra',
                'batch' => 2018,
                'company_id' => 3, // Asumsi 'CV. Inovasi Dunia Edukasi' memiliki ID 3
                'photo' => 'photos/wahyu.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
