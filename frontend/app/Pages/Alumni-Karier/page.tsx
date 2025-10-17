'use client'

import React, { useState, useEffect, useRef } from 'react';
import { GraduationCap, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '@/app/Components/Footer';
import Navbar from '@/app/Components/Navbar';
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import "swiper/css";
import "swiper/css/pagination";

interface AlumniData {
  id: number;
  name: string;
  company: string;
  image: string;
}

interface AlumniCarouselProps {
  data?: AlumniData[];
  autoPlayInterval?: number;
  title?: string;
}

const defaultAlumniData: AlumniData[] = [
  { id: 1, name: "Kaoruko Waguri", company: "Melanjutkan di Universitas Indonesia (UI) S1", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" },
  { id: 2, name: "Bagus Kurniawan", company: "Melanjutkan di Institut Teknologi Sepuluh November (ITS) S2", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
  { id: 3, name: "Siti Nurhaliza", company: "Bekerja di PT. Bank Mandiri", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop" },
  { id: 4, name: "Budi Santoso", company: "Bekerja di PT. Gojek Indonesia", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" },
  { id: 5, name: "Surya Setiawan Nugroho", company: "Melanjutkan di Universitas Gadjah Mada (UGM) S1", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" },
  { id: 6, name: "Reyno Hamzah Anugerah", company: "Mendirikan Perusahaan IT Consultant (Rey IT)", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" },
  { id: 7, name: "Ahmad Ar - Raafi Apriyano", company: "Melanjutkan di Institut Teknologi Sepuluh November (ITS) S3", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" },
  { id: 8, name: "Dewi Lestari", company: "Bekerja di PT. Unilever Indonesia", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop" }
];

export function createAlumniCarousel(props?: AlumniCarouselProps) {
  return <AlumniCarousel {...props} />;
}

function AlumniCarousel({
  data = defaultAlumniData,
  autoPlayInterval = 3000,
  title = "Alumni SMKN 2 Buduran",
}: AlumniCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [currentIndex, autoPlayInterval]);

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev + 1) % data.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const currentAlumni = data[currentIndex];

  return (
    <div className="min-h-[50vh] md:min-h-[90vh] bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-6 md:mb-10">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-900">
            {title.split('SMKN 2')[0]}
            <span className="text-blue-600">SMKN 2</span>
            {title.split('SMKN 2')[1]}
          </h1>
        </div>

        <div className="relative flex flex-col items-center">
          {/* Card */}
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-16 mx-2 md:mx-4 mt-4 md:mt-8 w-full max-w-5xl relative group">
            {/* Navigation - selalu muncul di mobile, hover di desktop */}
            <button
              onClick={prevSlide}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full p-2 md:p-3 shadow-lg transition-all duration-300 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 md:w-8 md:h-8 text-gray-700" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full p-2 md:p-3 shadow-lg transition-all duration-300 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 md:w-8 md:h-8 text-gray-700" />
            </button>

            <div className={`flex flex-col md:flex-row items-center gap-4 md:gap-12 transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
              <div className="w-40 h-40 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                <img src={currentAlumni.image} alt={currentAlumni.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 md:mb-4">{currentAlumni.name}</h2>
                <p className="text-base md:text-2xl lg:text-3xl font-semibold text-gray-800">{currentAlumni.company}</p>
              </div>
            </div>
          </div>

          {/* Indicator */}
          <div className="flex justify-center gap-2 md:gap-3 mt-4 md:mt-6">
            {data.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full ${index === currentIndex ? 'w-6 md:w-12 h-2.5 md:h-3 bg-blue-600' : 'w-2.5 md:w-3 h-2.5 md:h-3 bg-gray-300 hover:bg-gray-400'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface Partner {
  id: number
  name: string
  address: string
  logo: string
}

const ITEMS_PER_PAGE = 6

// ✅ Komponen PartnerList — sudah support swipe di mobile
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

function PartnerList() {
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, error, isLoading } = useSWR<Partner[]>("/company", fetcher);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const partners = data || [];
  const totalPages = Math.ceil(partners.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = partners.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-10">Hubungan Mitra</h2>

      {isLoading ? (
        <div className="text-center py-12 text-gray-600">Loading...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          Gagal memuat data mitra
        </div>
      ) : isMobile ? (
        // 🌀 MOBILE (Swiper)
        <Swiper
          modules={[Pagination]}
          pagination={{
            clickable: true,
            el: ".custom-pagination",
          }}
          spaceBetween={16}
          slidesPerView={1}
          className="!pb-10"
        >
          {partners.map((partner) => (
            <SwiperSlide key={partner.id}>
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-8 text-center">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-20 object-contain mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {partner.name}
                </h3>
                <p className="text-sm text-gray-600 mb-6">{partner.address}</p>
                <button className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                  Hubungi
                </button>
              </div>
            </SwiperSlide>
          ))}

          {/* ✅ Custom pagination bullet — disembunyikan di mobile */}
          <div className="custom-pagination hidden" />
        </Swiper>
      ) : (
        // 💻 DESKTOP GRID
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {currentItems.map((partner) => (
              <div
                key={partner.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all p-6 flex flex-col text-center"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-16 object-contain mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {partner.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {partner.address}
                </p>
                <button className="mt-auto px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                  Hubungi
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-3">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-full border transition ${
                  currentPage === 1
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-gray-200"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-3 h-3 rounded-full transition-transform ${
                        currentPage === page
                          ? "bg-blue-600 scale-110"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  )
                )}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full border transition ${
                  currentPage === totalPages
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-gray-200"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}


export default function AlumniKarierPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 mt-28">
        {/* Hero Section */}
        <div className="relative h-[400px] md:h-[600px]">
          <img 
            src="/images/Smkn2Buduran.jpg" 
            alt="SMKN 2 Buduran" 
            className="absolute inset-0 w-full h-full object-cover z-0" 
          />
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="relative h-full flex items-center justify-center z-20">
            <h1 className="text-white text-4xl md:text-6xl font-bold tracking-wider text-center px-4">
              ALUMNI & KARIER
            </h1>
          </div>

          {/* Stats Cards */}
          <div className="absolute bottom-[-4rem] left-1/2 transform -translate-x-1/2 z-20 w-full max-w-md">
            <div className="flex flex-row flex-nowrap justify-center items-stretch shadow-2xl bg-white rounded-lg">
              <div className="flex-1 px-6 md:px-12 py-4 md:py-6 text-center border-r border-gray-200 relative z-10">
                <GraduationCap className="w-10 h-10 md:w-14 md:h-14 mx-auto mb-2 md:mb-3 text-gray-800" strokeWidth={1.5} />
                <div className="text-2xl md:text-4xl font-bold text-gray-900 mb-1">12.960</div>
                <div className="text-gray-700 font-medium text-sm md:text-base">Alumni</div>
              </div>
              <div className="flex-1 px-6 md:px-12 py-4 md:py-6 text-center relative z-10">
                <Building2 className="w-10 h-10 md:w-14 md:h-14 mx-auto mb-2 md:mb-3 text-gray-800" strokeWidth={1.5} />
                <div className="text-2xl md:text-4xl font-bold text-gray-900 mb-1">119</div>
                <div className="text-gray-700 font-medium text-sm md:text-base">Hubungan Mitra</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 pt-32 pb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">Selamat Datang Kembali, Alumni SMKN 2 Buduran</h2>

          <div className="flex flex-col md:flex-row gap-10 md:gap-12 items-center md:items-start">
            <div className="flex-1 space-y-6 text-center md:text-left">
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                Sekolah kami bangga telah melahirkan alumni-alumni luar biasa yang tidak hanya 
                unggul dalam bidang akademik, tetapi juga berprestasi di dunia kerja. Melalui 
                pendidikan berkualitas, pembinaan karakter, dan pengalaman nyata di lapangan, 
                para lulusan kami mampu beradaptasi, berinovasi, serta memberikan kontribusi 
                nyata bagi masyarakat.
              </p>

              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                Didukung oleh jaringan hubungan industri yang luas, sekolah kami terus menjalin 
                kerja sama strategis dengan berbagai perusahaan, lembaga, dan instansi, sehingga 
                membuka peluang magang, pelatihan, dan penempatan kerja yang maksimal bagi 
                siswa dan alumni. Kami percaya, kolaborasi kuat antara dunia pendidikan dan industri 
                adalah kunci untuk mencetak generasi yang siap bersaing di era global.
              </p>
            </div>

            <div className="flex-shrink-0 relative flex justify-center">
              <div className="relative w-56 md:w-80">
                <img src="/images/alumni.png" alt="Alumni SMKN 2 Buduran" className="relative z-10 w-full object-contain drop-shadow-2xl" />
                <div className="absolute -bottom-5 -left-5 right-0 h-40 md:h-48 bg-cyan-400 rounded-2xl -z-0"></div>
              </div>
            </div>
          </div>
        </div>

        <AlumniCarousel />
        <PartnerList />
      </div>
      <Footer />
    </>
  );
}