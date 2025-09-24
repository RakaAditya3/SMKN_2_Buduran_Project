'use client'

import React from 'react';
import Image from 'next/image';
import Head from 'next/head';
import * as motion from "motion/react-client"
import Link from 'next/link';
import { useRef } from 'react';
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'


interface ActivityItem {
  id: number;
  title: string;
  image: string;
  description: string;
  href : string;
}

const SchoolPortfolio: React.FC = () => {
  const ekstrakurikulerData: ActivityItem[] = [
    {
      id: 1,
      title: "Pramuka",
      image: "/images/dummyImage.jpg",
      description: "Kegiatan pramuka yang mengembangkan karakter dan kepemimpinan siswa melalui berbagai aktivitas outdoor dan indoor.",
      href : "/Pages/Extrakurikuler/pramuka",
    },
    {
      id: 2,
      title: "Paskibra",
      image: "/images/dummyImage.jpg",
      description: "Program olahraga yang beragam untuk mengembangkan fisik dan mental siswa dengan berbagai cabang olahraga.",
       href : "/Pages/Extrakurikuler/paskibra",
    },
    {
      id: 3,
      title: "English CLub",
      image: "/images/dummyImage.jpg",
      description: "Kegiatan seni dan budaya yang mengasah kreativitas siswa dalam bidang musik, tari, dan seni rupa.",
       href : "/Pages/Extrakurikuler/english",
    }
  ];

  const fasilitasData: ActivityItem[] = [
    {
      id: 1,
      title: "Banjari",
      image: "/images/dummyImage.jpg",
      description: "Laboratorium lengkap dengan peralatan modern untuk mendukung pembelajaran sains dan teknologi.",
       href : "/Pages/Extrakurikuler/banjari",
    },
    {
      id: 2,
      title: "Pencak Organisasi", 
      image: "/images/dummyImage.jpg",
      description: "Perpustakaan dengan koleksi buku yang lengkap dan suasana belajar yang nyaman untuk siswa.",
       href : "/Pages/Extrakurikuler/pencak",
    },
    {
      id: 3,
      title: "Cheer Leader",
      image: "/images/dummyImage.jpg",
      description: "Ruang kelas yang dilengkapi dengan fasilitas pembelajaran modern dan nyaman.",
       href : "/Pages/Extrakurikuler/cheerleader",
    }
  ];

  const englishClubData: ActivityItem[] = [
    {
      id: 1,
      title: "Futsal",
      image: "/images/dummyImage.jpg",
      description: "Klub percakapan bahasa Inggris untuk meningkatkan kemampuan berbicara siswa dalam bahasa internasional.",
       href : "/Pages/Extrakurikuler/futsal",
    },
    {
      id: 2,
      title: "Basket",
      image: "/images/dummyImage.jpg",
      description: "Kegiatan drama dan teater dalam bahasa Inggris untuk mengembangkan kepercayaan diri siswa.",
       href : "/Pages/Extrakurikuler/basket",
    },
    {
      id: 3,
      title: "Paduan Suara",
      image: "/images/dummyImage.jpg",
      description: "Klub debat bahasa Inggris yang melatih kemampuan berargumentasi dan berpikir kritis siswa.",
       href : "/Pages/Extrakurikuler/paduan",
    }
  ];

  const basketData: ActivityItem[] = [
    {
      id: 1,
      title: "Badminton",
      image: "/images/dummyImage.jpg",
      description: "Tim basket putra sekolah yang aktif mengikuti kompetisi antar sekolah dan meraih berbagai prestasi.",
       href : "/Pages/Extrakurikuler/badminton",
    },
    {
      id: 2,
      title: "Dance Club", 
      image: "/images/dummyImage.jpg",
      description: "Tim basket putri yang menunjukkan dedikasi tinggi dalam latihan dan pertandingan resmi.",
       href : "/Pages/Extrakurikuler/dance",
    },
    {
      id: 3,
      title: "Robotik",
      image: "/images/dummyImage.jpg",
      description: "Turnamen basket internal sekolah yang diselenggarakan setiap tahun untuk semua siswa.",
       href : "/Pages/Extrakurikuler/robotik",
    }
  ];
  const Kompetensi1: ActivityItem[] = [
    {
      id: 1,
      title: "Rekayasa Perangkat Lunak",
      image: "/images/dummyImage.jpg",
      description: "Tim basket putra sekolah yang aktif mengikuti kompetisi antar sekolah dan meraih berbagai prestasi.",
       href : "/Pages/Jurusan/RPL",
    },
    {
      id: 2,
      title: "Desain Komunikasi Visual", 
      image: "/images/dummyImage.jpg",
      description: "Tim basket putri yang menunjukkan dedikasi tinggi dalam latihan dan pertandingan resmi.",
       href : "/Pages/Jurusan/DKV",
    },
    {
      id: 3,
      title: "Akutansi",
      image: "/images/dummyImage.jpg",
      description: "Turnamen basket internal sekolah yang diselenggarakan setiap tahun untuk semua siswa.",
       href : "/Pages/Jurusan/AK",
    }
  ];
  const Kompetensi2: ActivityItem[] = [
    {
      id: 1,
      title: "Bisnis Digital",
      image: "/images/dummyImage.jpg",
      description: "Tim basket putra sekolah yang aktif mengikuti kompetisi antar sekolah dan meraih berbagai prestasi.",
       href : "/Pages/Jurusan/BD",
    },
    {
      id: 2,
      title: "Layanan Perbankan", 
      image: "/images/dummyImage.jpg",
      description: "Tim basket putri yang menunjukkan dedikasi tinggi dalam latihan dan pertandingan resmi.",
       href : "/Pages/Jurusan/LPB",
    },
    {
      id: 3,
      title: "Manajemen Perkantoran Layanan Bisnis",
      image: "/images/dummyImage.jpg",
      description: "Turnamen basket internal sekolah yang diselenggarakan setiap tahun untuk semua siswa.",
       href : "/Pages/Jurusan/MP",
    }
  ];


   const scrollRef = useRef(null)
   

  const ActivityGrid: React.FC<{ title: string; data: ActivityItem[] }> = ({ title, data }) => (
    <section className="mt-30 mb-12">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-40">
        
        {data.map((item, index) => (
          <Link key={item.id} href={item.href}>
          <motion.div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow" 
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}   
            transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.1 }}
            viewport={{ once: true, amount: 0.3 }}>
            <div className="relative h-80 w-full">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
            </div>
          </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );

  return (
    <>
    <Navbar />
      <div className="min-h-screen bg-gray-50">

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ActivityGrid title="Kompetensi Keahlian" data={Kompetensi1} />
          <ActivityGrid title="" data={Kompetensi2} />
          <ActivityGrid title="Ekstrakurikuler" data={ekstrakurikulerData} />
          <ActivityGrid title="" data={fasilitasData} />
          <ActivityGrid title="" data={englishClubData} />
          <ActivityGrid title="" data={basketData} />
        </main>

        {/* Footer */}
      </div>
      <Footer />
    </>
  );
};

export default SchoolPortfolio;