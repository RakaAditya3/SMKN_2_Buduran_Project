<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('companies')->insert([
            [
                'name' => 'PT. Maspion IT',
                'address' => 'Sidoarjo, Jawa Timur',
                'website' => 'https://www.maspion.com',
                'logo' => 'logos/maspion_it.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'PT. Awak Media Indonesia',
                'address' => 'Surabaya, Jawa Timur',
                'website' => 'https://www.awakmedia.com',
                'logo' => 'logos/awak_media.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'CV. Inovasi Dunia Edukasi',
                'address' => 'Malang, Jawa Timur',
                'website' => null,
                'logo' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'PT. E-T-A Indonesia',
                'address' => 'Sidoarjo, Jawa Timur',
                'website' => 'https://www.e-t-a.com',
                'logo' => 'logos/e-t-a.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
