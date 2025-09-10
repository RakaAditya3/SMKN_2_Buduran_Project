import React from 'react';
import Image from 'next/image';
import Head from 'next/head';

interface ActivityItem {
  id: number;
  title: string;
  image: string;
  description: string;
}

const SchoolPortfolio: React.FC = () => {
  const ekstrakurikulerData: ActivityItem[] = [
    {
      id: 1,
      title: "Pramuka",
      image: "/images/pramuka.jpg",
      description: "Kegiatan pramuka yang mengembangkan karakter dan kepemimpinan siswa melalui berbagai aktivitas outdoor dan indoor."
    },
    {
      id: 2,
      title: "Olahraga",
      image: "/images/olahraga.jpg", 
      description: "Program olahraga yang beragam untuk mengembangkan fisik dan mental siswa dengan berbagai cabang olahraga."
    },
    {
      id: 3,
      title: "Seni & Budaya",
      image: "/images/seni-budaya.jpg",
      description: "Kegiatan seni dan budaya yang mengasah kreativitas siswa dalam bidang musik, tari, dan seni rupa."
    }
  ];

  const fasilitasData: ActivityItem[] = [
    {
      id: 1,
      title: "Laboratorium",
      image: "/images/laboratorium.jpg",
      description: "Laboratorium lengkap dengan peralatan modern untuk mendukung pembelajaran sains dan teknologi."
    },
    {
      id: 2,
      title: "Perpustakaan", 
      image: "/images/perpustakaan.jpg",
      description: "Perpustakaan dengan koleksi buku yang lengkap dan suasana belajar yang nyaman untuk siswa."
    },
    {
      id: 3,
      title: "Ruang Kelas",
      image: "/images/ruang-kelas.jpg",
      description: "Ruang kelas yang dilengkapi dengan fasilitas pembelajaran modern dan nyaman."
    }
  ];

  const englishClubData: ActivityItem[] = [
    {
      id: 1,
      title: "Speaking Club",
      image: "/images/speaking-club.jpg",
      description: "Klub percakapan bahasa Inggris untuk meningkatkan kemampuan berbicara siswa dalam bahasa internasional."
    },
    {
      id: 2,
      title: "Drama & Theater",
      image: "/images/drama.jpg",
      description: "Kegiatan drama dan teater dalam bahasa Inggris untuk mengembangkan kepercayaan diri siswa."
    },
    {
      id: 3,
      title: "Debate Club",
      image: "/images/debate.jpg",
      description: "Klub debat bahasa Inggris yang melatih kemampuan berargumentasi dan berpikir kritis siswa."
    }
  ];

  const basketData: ActivityItem[] = [
    {
      id: 1,
      title: "Tim Basket Putra",
      image: "/images/basket-putra.jpg",
      description: "Tim basket putra sekolah yang aktif mengikuti kompetisi antar sekolah dan meraih berbagai prestasi."
    },
    {
      id: 2,
      title: "Tim Basket Putri", 
      image: "/images/basket-putri.jpg",
      description: "Tim basket putri yang menunjukkan dedikasi tinggi dalam latihan dan pertandingan resmi."
    },
    {
      id: 3,
      title: "Turnamen Sekolah",
      image: "/images/turnamen.jpg", 
      description: "Turnamen basket internal sekolah yang diselenggarakan setiap tahun untuk semua siswa."
    }
  ];

  const ActivityGrid: React.FC<{ title: string; data: ActivityItem[] }> = ({ title, data }) => (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {data.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full">
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
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <>
      <Head>
        <title>Web Sekolah - Portfolio Kegiatan</title>
        <meta name="description" content="Portfolio kegiatan dan fasilitas sekolah" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Image
                  src="/images/logo-sekolah.png"
                  alt="Logo Sekolah"
                  width={40}
                  height={40}
                  className="mr-3"
                />
                <h1 className="text-xl font-bold text-gray-800">SMA Negeri 1</h1>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  Beranda
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  Tentang
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  Kegiatan
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  Kontak
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ActivityGrid title="Ekstrakurikuler" data={ekstrakurikulerData} />
          <ActivityGrid title="Fasilitas" data={fasilitasData} />
          <ActivityGrid title="English Club" data={englishClubData} />
          <ActivityGrid title="Basket" data={basketData} />
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">SMA Negeri 1</h3>
                <p className="text-gray-300 text-sm">
                  Sekolah unggulan yang berkomitmen memberikan pendidikan berkualitas untuk masa depan yang cerah.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-gray-300 hover:text-white">Beranda</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Tentang Kami</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Kegiatan</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Kontak</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Program</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-gray-300 hover:text-white">Ekstrakurikuler</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">English Club</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Olahraga</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Seni & Budaya</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Kontak</h4>
                <div className="text-sm text-gray-300 space-y-2">
                  <p>Jl. Pendidikan No. 123</p>
                  <p>Jakarta, Indonesia</p>
                  <p>Tel: (021) 123-4567</p>
                  <p>Email: info@sman1.sch.id</p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center">
              <p className="text-gray-300 text-sm">
                © 2024 SMA Negeri 1. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default SchoolPortfolio;