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
                'student_id'   => 1,
                'ebook_id'    => 1, // Laskar Pelangi
                'borrowed_at' => Carbon::now()->subDays(5),
                'returned_at' => null,
                'status'      => 'borrowed',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'student_id'   => 2,
                'ebook_id'    => 2, // Bumi Manusia
                'borrowed_at' => Carbon::now()->subDays(10),
                'returned_at' => Carbon::now()->subDays(2),
                'status'      => 'returned',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'student_id'   => 3,
                'ebook_id'    => 3, // Negeri 5 Menara
                'borrowed_at' => Carbon::now()->subDays(3),
                'returned_at' => null,
                'status'      => 'borrowed',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'student_id'   => 4,
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
