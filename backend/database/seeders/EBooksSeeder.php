<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EbooksSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('ebooks')->insert([
            [
                'title' => 'Laskar Pelangi',
                'description' => 'Novel karya Andrea Hirata yang menceritakan kisah perjuangan anak-anak Belitong dalam mengejar pendidikan.',
                'image_path' => 'images/ebooks/laskar_pelangi.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Bumi Manusia',
                'description' => 'Karya Pramoedya Ananta Toer yang menggambarkan kehidupan kolonial Belanda di Hindia Belanda.',
                'image_path' => 'images/ebooks/bumi_manusia.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Negeri 5 Menara',
                'description' => 'Novel karya Ahmad Fuadi tentang perjalanan enam santri di sebuah pesantren.',
                'image_path' => 'images/ebooks/negeri_5_menara.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Sang Pemimpi',
                'description' => 'Novel lanjutan dari Laskar Pelangi yang penuh motivasi dan cita-cita tinggi.',
                'image_path' => 'images/ebooks/sang_pemimpi.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Filosofi Kopi',
                'description' => 'Kumpulan cerita pendek karya Dewi Lestari yang mengangkat filosofi kehidupan dari secangkir kopi.',
                'image_path' => 'images/ebooks/filosofi_kopi.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Atomic Habits',
                'description' => 'Buku James Clear tentang bagaimana kebiasaan kecil bisa membawa perubahan besar dalam hidup.',
                'image_path' => 'images/ebooks/atomic_habits.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Rich Dad Poor Dad',
                'description' => 'Karya Robert T. Kiyosaki tentang perbedaan mindset keuangan orang kaya dan orang miskin.',
                'image_path' => 'images/ebooks/rich_dad_poor_dad.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'The Power of Habit',
                'description' => 'Buku karya Charles Duhigg tentang sains di balik kebiasaan dan bagaimana mengubahnya.',
                'image_path' => 'images/ebooks/power_of_habit.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
        'title' => 'Atomic Habits',
        'description' => 'Karya James Clear tentang perubahan kecil yang menghasilkan hasil luar biasa.',
        'image_path' => 'images/ebooks/atomic_habits.jpg',
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'title' => 'Deep Work',
        'description' => 'Cal Newport menjelaskan pentingnya fokus mendalam untuk mencapai produktivitas maksimal.',
        'image_path' => 'images/ebooks/deep_work.jpg',
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'title' => 'Thinking, Fast and Slow',
        'description' => 'Daniel Kahneman membahas dua sistem berpikir manusia: cepat intuitif dan lambat analitis.',
        'image_path' => 'images/ebooks/thinking_fast_and_slow.jpg',
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'title' => 'Sapiens: A Brief History of Humankind',
        'description' => 'Yuval Noah Harari menceritakan sejarah evolusi manusia dari zaman purba hingga modern.',
        'image_path' => 'images/ebooks/sapiens.jpg',
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'title' => 'Educated',
        'description' => 'Memoar Tara Westover tentang perjuangannya meraih pendidikan meskipun lahir dari keluarga konservatif.',
        'image_path' => 'images/ebooks/educated.jpg',
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'title' => 'Can’t Hurt Me',
        'description' => 'David Goggins membagikan kisah hidup dan prinsip mental toughness untuk mengalahkan batas diri.',
        'image_path' => 'images/ebooks/cant_hurt_me.jpg',
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'title' => 'Rich Dad Poor Dad',
        'description' => 'Robert Kiyosaki membahas perbedaan pola pikir orang kaya dan orang miskin dalam mengelola keuangan.',
        'image_path' => 'images/ebooks/rich_dad_poor_dad.jpg',
        'created_at' => now(),
        'updated_at' => now(),
    ],
        ]);
    }
}
