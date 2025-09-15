<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RecordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('records')->insert([
            [
                'user_name'   => 'Budi Santoso',
                'nisn'        => '1234567890',
                'ebook_id'    => 1, // Laskar Pelangi
                'borrowed_at' => Carbon::now()->subDays(5),
                'returned_at' => null,
                'status'      => 'borrowed',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'user_name'   => 'Siti Aminah',
                'nisn'        => '1234567891',
                'ebook_id'    => 2, // Bumi Manusia
                'borrowed_at' => Carbon::now()->subDays(10),
                'returned_at' => Carbon::now()->subDays(2),
                'status'      => 'returned',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'user_name'   => 'Raka Aditya',
                'nisn'        => '1234567892',
                'ebook_id'    => 3, // Negeri 5 Menara
                'borrowed_at' => Carbon::now()->subDays(3),
                'returned_at' => null,
                'status'      => 'borrowed',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'user_name'   => 'Ani Kusuma',
                'nisn'        => '1234567893',
                'ebook_id'    => 4, // Sang Pemimpi
                'borrowed_at' => Carbon::now()->subDays(15),
                'returned_at' => Carbon::now()->subDays(5),
                'status'      => 'returned',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
        ]);
    }
}
