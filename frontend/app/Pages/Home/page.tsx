'use client'

import React from 'react'
import Image from 'next/image'
import { GraduationCap, Star, ChevronLeft, ChevronRight, Shield, TrendingUp, Users, Zap, CheckCircle, MessageCircle, BarChart3} from 'lucide-react';
import Link from 'next/link';
import dynamic from "next/dynamic";
import { useState } from 'react';

const CountUp = dynamic(() => import("react-countup"), { ssr: false });

interface AnimatedCountUpProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

function AnimatedCountUp({ end, suffix = "", prefix = "", duration = 2.5 }: AnimatedCountUpProps) {
  return (
    <div className="text-4xl font-bold text-blue-500 mb-2">
      <CountUp
        start={0}
        end={end}
        duration={duration}
        separator=","
        prefix={prefix}
        suffix={suffix}
        enableScrollSpy
        scrollSpyOnce
      />
    </div>
  );
}

interface Program {
  title: string
  description: string
  color: string
  href: string
}

const ProgramsCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | ''>('')

  const programs: Program[] = [
    {
      title: 'Rekayasa Perangkat Lunak',
      description: 'Belajar bikin aplikasi, website, dan sistem komputer.',
      color: 'bg-blue-500',
      href: '/Pages/Jurusan/RPL',
    },
    {
      title: 'Manajemen Perkantoran',
      description: 'Belajar ngatur dokumen, administrasi, dan kerja kantor.',
      color: 'bg-blue-500',
      href: '/Pages/Jurusan/MP',
    },
    {
      title: 'Desain Komunikasi Visual',
      description: 'Belajar desain grafis, ilustrasi, dan media visual kreatif.',
      color: 'bg-blue-500',
      href: '/Pages/Jurusan/DKV',
    },
    {
      title: 'Layanan Perbankan',
      description: 'Belajar layanan transaksi keuangan, dan administrasi perbankan.',
      color: 'bg-blue-500',
      href: '/Pages/Jurusan/LPB',
    },
    {
      title: 'Akutansi',
      description: 'Belajar pencatatan transaksi, menyusun laporan keuangan, dan analisis akuntansi.',
      color: 'bg-blue-500',
      href: '/Pages/Jurusan/AK',
    },
    {
      title: 'Bisnis Digital',
      description: 'Belajar pemasaran digital, e-commerce, analisis data, dan strategi bisnis modern.',
      color: 'bg-blue-500',
      href: '/Pages/Jurusan/BD',
    },
  ]

  const totalSlides = Math.ceil(programs.length / 3)

  const handleSlideChange = (direction: 'left' | 'right', targetSlide: number) => {
    if (isTransitioning) return

    setIsTransitioning(true)
    setSlideDirection(direction)

    setTimeout(() => {
      setCurrentSlide(targetSlide)
      setTimeout(() => {
        setIsTransitioning(false)
        setSlideDirection('')
      }, 50)
    }, 150)
  }

  const nextSlide = () => {
    const nextIndex = (currentSlide + 1) % totalSlides
    handleSlideChange('right', nextIndex)
  }

  const prevSlide = () => {
    const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides
    handleSlideChange('left', prevIndex)
  }

  const goToSlide = (index: number) => {
    if (index === currentSlide) return
    const direction: 'left' | 'right' = index > currentSlide ? 'right' : 'left'
    handleSlideChange(direction, index)
  }

  const getVisiblePrograms = (): Program[] => {
    const startIndex = currentSlide * 3
    return programs.slice(startIndex, startIndex + 3)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">JURUSAN</span>
          </div>
          <div className=" text-center ">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              6 JURUSAN YANG ADA DI SMKN 2 BUDURAN
            </h1>
          </div>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50">
        <div className="container mx-auto px-4 mt-5">
          {/* Carousel Indicators */}
          <div className="flex justify-center mb-12 space-x-3">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  currentSlide === index ? 'bg-gray-800' : 'bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Carousel Content */}
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              disabled={isTransitioning}
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg transition-all duration-300 ${
                isTransitioning
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-xl hover:scale-110 hover:bg-blue-50'
              }`}
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            <button
              onClick={nextSlide}
              disabled={isTransitioning}
              className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg transition-all duration-300 ${
                isTransitioning
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-xl hover:scale-110 hover:bg-blue-50'
              }`}
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>

            {/* Cards Container */}
            <div className="mx-16 overflow-hidden">
              <div
                className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500 ease-in-out transform ${
                  isTransitioning
                    ? slideDirection === 'right'
                      ? 'translate-x-full opacity-0'
                      : '-translate-x-full opacity-0'
                    : 'translate-x-0 opacity-100'
                }`}
              >
                {getVisiblePrograms().map((program, index) => (
                  <div
                    key={`${currentSlide}-${index}`}
                    className={`bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-700 ease-out ${
                      isTransitioning ? 'scale-95' : 'scale-100'
                    }`}
                  >

                    <div className={`${program.color} h-24 relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
                      <div
                        className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform transition-transform duration-1000 ${
                          isTransitioning ? 'translate-x-full' : '-translate-x-full'
                        }`}
                      ></div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <h3
                        className={`text-lg font-semibold text-blue-600 mb-3 transform transition-all duration-500 ${
                          isTransitioning ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
                        }`}
                      >
                        {program.title}
                      </h3>
                      <p
                        className={`text-gray-600 text-sm mb-4 leading-relaxed transform transition-all duration-600 ${
                          isTransitioning ? 'translate-y-3 opacity-0' : 'translate-y-0 opacity-100'
                        }`}
                      >
                        {program.description}
                      </p>
                      <a
                        href={program.href}
                        className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center ${
                          isTransitioning
                            ? 'opacity-0'
                            : 'opacity-100 hover:scale-105'
                        }`}
                      >
                        Lebih Lanjut
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const InfiniteCarousel: React.FC = () => {
  const images = [
    '/images/LogoJagoan-1.png',
    '/images/komdigi.png',
    '/images/maspion.png',
    '/images/1000sd.png',
    '/images/LogoJagoan-1.png',
    '/images/komdigi.png',
    '/images/maspion.png',
    '/images/1000sd.png',
  ]

  return (
    <div className="relative w-full overflow-hidden py-8">
      <div className="flex animate-loop-scroll">
        {[...images, ...images].map((src, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[100px] mx-6 flex items-center justify-center"
          >
            <div className="transition-all duration-500 transform hover:scale-105">
              <Image
                src={src}
                alt={`carousel-${i}`}
                width={70}
                height={120}
                className="object-contain w-[200px] h-[120px] hover:grayscale-0 transition duration-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const Feature = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50">
      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Section */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-600">
                  Jelajahi 
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-300">
                  Fitur
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Jelahi Fitur dari Website Ini 
              </p>
            </div>

            {/* Illustration */}
            <div className="relative">
              <div className="bg-gradient-to-r from-pink-100 to-blue-100 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-r from-blue-400 to-pink-400 rounded-full opacity-20"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-20"></div>
                
                {/* Device Mockup */}
                <div className="bg-white rounded-2xl p-4 shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-gradient-to-r from-blue-100 to-pink-100 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-white/50 rounded h-2 w-3/4"></div>
                      <div className="bg-white/50 rounded h-2 w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-gray-100 rounded h-2 w-full"></div>
                    <div className="bg-gray-100 rounded h-2 w-2/3"></div>
                  </div>
                </div>

                {/* Character Illustration */}
                <div className="absolute -right-4 -bottom-2">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Service Cards */}
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">

              {/* Service Card 1 */}
              <Link href={"/Pages/Presensi"}>
              <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-2xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Presensi Online</h3>
                <p className="text-gray-600 text-sm">
                  Fitur presensi online membantu siswa mencatat kehadiran tanpa ribet, kapan saja dan di mana saja.
                </p>
              </div>
              </Link>

              {/* Service Card 2 */}
              <Link href={"/Login-eLibrary"}>
              <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-2xl flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">eLibrary</h3>
                <p className="text-gray-600 text-sm">
                  eLibrary memudahkan siswa meminjam dan membaca buku secara online tanpa harus datang ke perpustakaan.
                </p>
              </div>
              </Link>

              {/* Service Card 3 */}
              <Link href={"/Pages/eComplaint"}>
              <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-400 rounded-2xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">eComplaint</h3>
                <p className="text-gray-600 text-sm">
                  eComplaint memudahkan siswa menyampaikan keluh kesah dan masukan kepada sekolah secara online.
                </p>
              </div>
              </Link>

              {/* Service Card 4 */}
              <Link href={"/Pages/Student-Showcase"}>
              <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-blue-400 rounded-2xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Student Showcase</h3>
                <p className="text-gray-600 text-sm">
                  Student Showcase menjadi ruang bagi siswa untuk menampilkan karya dan prestasi mereka secara online.
                </p>
              </div>
              </Link>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const page = () => {
  
  return (
    <>
    <div className="relative w-full h-[800px]">
      <Image
        src="/images/Smkn2Buduran.jpg"
        alt="SMKN 2 Buduran"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex items-center justify-center h-full">
        <h1 className="text-white text-5xl font-bold">
          Selamat Datang di SMKN 2 Buduran
        </h1>
      </div>
    </div>

    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50 p-4">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          {/* Kelulusan Card */}
          <div className="bg-blue-500 rounded-lg p-4 text-white flex flex-col items-center min-w-[140px]">
            <GraduationCap size={32} className="mb-2" />
            <span className="text-2xl font-bold">98%</span>
            <span className="text-sm">KELULUSAN</span>
          </div>

          {/* Main Header */}
          <div className="flex-1 mx-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center border">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                TERAKREDITASI <span className="text-yellow-500">A</span>
              </h1>
              <p className="text-gray-600 text-sm">
                SMKN 2 telah meraih predikat Akreditasi A dari Badan Akreditasi Nasional dengan skor tertinggi di wilayah ini.
              </p>
            </div>
          </div>

          {/* Akreditasi Card */}
          <div className="bg-blue-500 rounded-lg p-4 text-white flex flex-col items-center min-w-[140px]">
            <Star size={32} className="mb-2" />
            <span className="text-sm text-center">SKOR AKREDITASI</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-6">
          {/* Left Column */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 h-[410]">
              <div className="bg-blue-500 text-white p-4">
                <h2 className="text-2xl font-bold">Sambutan kepala sekolah</h2>
              </div>
              
              <div className="p-6">
                <div className="flex gap-52">
                    <img 
                      src="https://kmzmzmrdwbaaibcgqowh.supabase.co/storage/v1/object/public/images/Images/SMKN2BuduranVM.jpg" 
                      alt="SMK Building" 
                      className="w-[700] h-full object-cover rounded z-0"
                    />
                  <div className="w-full absolute z-10 pl-95 pt-23 ">
                    <img 
                      src="https://kmzmzmrdwbaaibcgqowh.supabase.co/storage/v1/object/public/images/Images/image.png" 
                      alt="Kepala Sekolah" 
                      className="w-[280] h-fit object-cover rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
                <div className="bg-white rounded-md shadow-md overflow-hidden mt-35">
                  <div className="relative w-full h-100">
                    <iframe
                      className="absolute inset-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/OnlrEXnjrBY?si=eqrw318vc1mSO97O"
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 hover:text-blue-600 cursor-pointer text-black">
                    Profil SMKN 2 Buduran Sidoarjo
                  </h3>
                  <p className="text-gray-600 text-sm">
                    7,3 RB x ditonton • 9 tahun yang lalu
                  </p>
                </div>
              </div>
            </div>

          {/* Right Column */}
          <div className="w-110">
              <div className="bg-white rounded-md p-6">
                <div className="border-2 border-blue-500 rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-4 text-center text-black">Membangun Karakter, Meraih Prestasi</h3>
                  
                  <p className="text-sm text-gray-700 leading-relaxed mb-6">
                    Selamat datang di SMKN 2 Buduran! Sebagai kepala sekolah, saya bangga memimpin 
                    institusi yang tidak hanya fokus pada pencapaian akademik, tetapi juga pembentukan 
                    karakter yang kuat. Kami berkomitmen untuk menciptakan lingkungan belajar yang 
                    inspiratif, di mana setiap siswa dapat mengembangkan potensi terbaiknya. Dengan 
                    dukungan guru berpengalaman dan fasilitas modern, kami yakin dapat 
                    mengantarkan putra-putri terbaik bangsa menuju masa depan yang gemilang.
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <div className="text-gray-600 text-xl">💬</div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">Dra. Hj. Mariya Ernawati, M.M.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-md shadow-md overflow-hidden mt-20">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/_h2rZ_YWxRM"
                    title="YouTube Video Player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>

              <div className="bg-white rounded-md shadow-md overflow-hidden mt-25 ">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/p7netIefoeI?si=_GE9oFZ0-9wq_fDh"
                    title="YouTube Video Player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
    
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mt-30">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-blue-600 font-semibold text-lg mb-4 tracking-wider">
            TENTANG KAMI
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            KEUNGGULAN SMK NEGERI 2 BUDURAN
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Dengan pengalaman lebih dari 29 tahun, kami telah membuktikan 
            komitmen dalam menghasilkan lulusan terbaik
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Tahun Pengalaman */}
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className='animate-bounce'>
            <AnimatedCountUp end={25} suffix="+" duration={2.5} />
            </div>
            <div className="text-gray-600 font-medium">Tahun Pengalaman</div>
          </div>

          {/* Jumlah Siswa */}
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className='animate-bounce'>
            <AnimatedCountUp end={1200} suffix="+" duration={3} />
            </div>
            <div className="text-gray-600 font-medium">Jumlah Siswa</div>
          </div>

          {/* Lulus PTN */}
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className='animate-bounce'>
            <AnimatedCountUp end={95} suffix="%" duration={2.2} />
            </div>
            <div className="text-gray-600 font-medium">Lulus PTN</div>
          </div>

          {/* Akreditasi */}
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="text-4xl font-bold text-blue-500 mb-2 animate-bounce">A+</div>
            <div className="text-gray-600 font-medium">Akreditasi</div>
          </div>
        </div>


        {/* Content Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg" id='selengkapnya'>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                SMK 2 Buduran telah menjadi rujukan pendidikan menengah atas terkemuka di Jawa 
                Timur. Kami menggabungkan kurikulum nasional dengan standar internasional untuk 
                menghasilkan lulusan yang kompeten dan berkarakter.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Keunggulan Kami
              </h3>
              
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Dengan tenaga pendidik profesional yang berpengalaman dan fasilitas modern, kami 
                menciptakan lingkungan belajar yang kondusif dan inspiratif. Program ekstrakurikuler 
                yang beragam membantu siswa mengembangkan bakat dan minat mereka secara optimal.
              </p>
              
              <p className="text-gray-700 text-lg leading-relaxed">
                Komitmen kami tidak hanya pada pencapaian akademik, tetapi juga pembentukan 
                karakter yang kuat, jiwa kepemimpinan, dan kepedulian sosial yang tinggi.
              </p>
            </div>

            <div className="lg:pl-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 text-white">
                <h4 className="text-xl font-bold mb-6">Visi & Misi</h4>
                
                <div className="mb-6">
                  <p className="text-blue-100 text-sm leading-relaxed">
                   Terwujudnya lembaga pendidikan dan pelatihan yang Unggul, Mumpuni dan Berkarakter berdasarkan IMTAQ dan IPTEK, serta peduli dan berbudaya lingkungan.
                  </p>
                </div>
                
                <div>
                  <ul className="text-blue-100 text-sm space-y-1 leading-relaxed">
                    <li>• Menyelenggarakan pendidikan dan pelatihan yang berorientasi pada ilmu pengetahuan dan teknologi (iptek), berlandaskan keimanan dan ketaqwaan (imtaq) serta berwawasan lingkungan hidup.</li>
                    <li>• Menghasilkan tamatan yang berkualitas sesuai dengan tuntutan kebutuhan masyarakat dan mampu bersaing dalam pasar kerja serta dapat mengembangkan sikap profesional dalam bidang keahlian.</li>
                    <li>• Menyiapkan siswa agar menjadi manusia yang produktif, mampu bekerja mandiri dan mengisi lowongan pekerjaan yang ada sesuai dengan kompetensinya.</li>
                    <li>• Lingkungan dan budaya sekolah yang tertib aman dan nyaman.</li>
                    <li>• Mencapai keunggulan lingkungan.</li>
                    <li>• Santun dalam berkomunikasi.</li>
                    <li>• Melestarikan fungsi lingkungan.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
    </div>

    <ProgramsCarousel />
    <InfiniteCarousel />
    <Feature />

    </>
  )
}

export default page
