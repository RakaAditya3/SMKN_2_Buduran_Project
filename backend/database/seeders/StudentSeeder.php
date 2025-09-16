<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Student;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $jurusanList = ['RPL', 'DKV', 'BD', 'MP', 'AK', 'LPB'];
        $kelasList = ['X', 'XI', 'XII'];

        for ($i = 1; $i <= 50; $i++) {
            Student::create([
                'nama' => "Siswa $i",
                'nisn' => "202500$i",
                'password' => Hash::make('password123'),
                'uid' => "UID$i",
                'kelas' => $kelasList[array_rand($kelasList)],
                'jurusan' => $jurusanList[array_rand($jurusanList)],
                'no_absen' => rand(1, 40),
            ]);
        }
    }
}
