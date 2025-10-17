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

        $students = [
            ['nama' => 'A. Ravi Rajab', 'nisn' => '0074799667', 'uid' => 'UID1'],
            ['nama' => 'Ach Ryan Adianto', 'nisn' => '0074155983', 'uid' => 'UID2'],
            ['nama' => 'Achmad Rayhan Al Matino', 'nisn' => '0076576653', 'uid' => 'UID3'],
            ['nama' => 'Ahmad Ar Raafi Apriyano', 'nisn' => '0082129323', 'uid' => 'UID4'],
            ['nama' => 'Alodia Kinnard Putri Kurnianto', 'nisn' => '0078483370', 'uid' => 'UID5'],
            ['nama' => 'Antonia Yoel Wahyu Vebrianti', 'nisn' => '0073700386', 'uid' => 'UID6'],
            ['nama' => 'Aryanto Tri Nashrullah', 'nisn' => '0082440438', 'uid' => 'UID7'],
            ['nama' => 'Bagus Kurniawan', 'nisn' => '0071023203', 'uid' => 'UID8'],
            ['nama' => 'Christopper Marcellino Kristiono Putra', 'nisn' => '0085514208', 'uid' => 'UID9'],
            ['nama' => 'Darma Sugiansyah Mustofa', 'nisn' => '0082302673', 'uid' => 'UID10'],
            ['nama' => 'Evan Adhiarja Yohanes', 'nisn' => '0075367041', 'uid' => 'UID11'],
            ['nama' => 'Ihsan Abdul Aziz', 'nisn' => '0073875923', 'uid' => 'UID12'],
            ['nama' => 'Luhung Archana Syahdagar', 'nisn' => '0089532157', 'uid' => 'UID13'],
            ['nama' => 'M. Ariel Dwi Ardiansyah', 'nisn' => '0087319783', 'uid' => 'UID14'],
            ['nama' => 'Maura Az Zahra', 'nisn' => '0071555908', 'uid' => 'UID15'],
            ['nama' => 'Mishbahul Ma Arif Al Jaly', 'nisn' => '0072855086', 'uid' => 'UID16'],
            ['nama' => 'Mohammad Febrian Afandi', 'nisn' => '0079705861', 'uid' => 'UID17'],
            ['nama' => 'Muhammad Rizki Firmansyah', 'nisn' => '0073364135', 'uid' => 'UID18'],
            ['nama' => 'Muhammad Andreas Athallah Saifa Anam', 'nisn' => '0071403441', 'uid' => 'UID19'],
            ['nama' => 'Muhammad Fathoni Firdaus', 'nisn' => '0079666134', 'uid' => 'UID20'],
            ['nama' => 'Muhammad Raihan Al Irsyad', 'nisn' => '0071124696', 'uid' => 'UID21'],
            ['nama' => 'Naufal Isham Putra', 'nisn' => '0076105169', 'uid' => 'UID22'],
            ['nama' => 'Raditya Abhinaya Akmal', 'nisn' => '0085871988', 'uid' => 'UID23'],
            ['nama' => 'Raka Aditya', 'nisn' => '0078583165', 'uid' => 'UID24'],
            ['nama' => 'Rasya Authar Ramadhani', 'nisn' => '0077285106', 'uid' => 'UID25'],
            ['nama' => 'Rehan Bintang Heryansyah', 'nisn' => '0077979667', 'uid' => 'UID26'],
            ['nama' => 'Reyno Hamzah Anugerah', 'nisn' => '0072205766', 'uid' => 'UID27'],
            ['nama' => 'Reyzha Abdillah Edy Pratama', 'nisn' => '0081529858', 'uid' => 'UID28'],
            ['nama' => 'Rizky Hadistya Rahmatullah', 'nisn' => '2025029', 'uid' => 'UID29'],
            ['nama' => 'Rizkyan Dwi Farizah', 'nisn' => '0088654375', 'uid' => 'UID30'],
            ['nama' => 'Robin Van Persie', 'nisn' => '0061422777', 'uid' => 'UID31'],
            ['nama' => 'Saka Putra Maulana', 'nisn' => '0076851598', 'uid' => 'UID32'],
            ['nama' => 'Satria Danadyaksa', 'nisn' => '0077158848', 'uid' => 'UID33'],
            ['nama' => 'Surya Setiawan Nugroho', 'nisn' => '0085529237', 'uid' => 'UID34'],
            ['nama' => 'Yardan Naufal Wicasa Rajendra', 'nisn' => '0078078496', 'uid' => 'UID35'],
            ['nama' => 'Zelina Irene Chrisani', 'nisn' => '0072582863', 'uid' => 'UID36'],
            ['nama' => 'Zillion Ichwanussafa', 'nisn' => '0084348458', 'uid' => 'UID37'],
        ];

        foreach ($students as $data) {
            Student::create([
                'nama' => $data['nama'],
                'nisn' => $data['nisn'],
                'password' => Hash::make('password123'),
                'uid' => $data['uid'],
                'kelas' => $kelasList[array_rand($kelasList)],
                'jurusan' => $jurusanList[array_rand($jurusanList)],
                'no_absen' => rand(1, 40),
            ]);
        }
    }
}
