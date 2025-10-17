'use client'

import React, { useState, useEffect } from 'react';
import { GraduationCap, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '@/app/Components/Footer';
import Navbar from '@/app/Components/Navbar';
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { resolveLocalProxyImage } from "@/lib/resolveImageUrl"; // ✅ tambahkan ini
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

interface AlumniData {
  id: number;
  name: string;
  company: string;
  image: string;
}

interface Partner {
  id: number;
  name: string;
  address: string;
  logo: string;
}

interface AlumniCarouselProps {
  data?: AlumniData[];
  autoPlayInterval?: number;
  title?: string;
}

const defaultAlumniData: AlumniData[] = [
  { id: 1, name: "Kaoruko Waguri", company: "Universitas Indonesia (UI)", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" },
  { id: 2, name: "Bagus Kurniawan", company: "Institut Teknologi Sepuluh November (ITS)", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
  { id: 3, name: "Siti Nurhaliza", company: "PT. Bank Mandiri", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop" },
];

function AlumniCarousel({ data = defaultAlumniData, autoPlayInterval = 3000, title = "Alumni SMKN 2 Buduran" }: AlumniCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => nextSlide(), autoPlayInterval);
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
      <div className="w-full max-w-6xl text-center mb-6">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
          {title.split('SMKN 2')[0]}<span className="text-blue-600">SMKN 2</span>{title.split('SMKN 2')[1]}
        </h1>
      </div>

      <div className="relative flex flex-col items-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-16 w-full max-w-5xl relative group">
          <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full p-3 shadow-md z-10">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full p-3 shadow-md z-10">
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          <div className={`flex flex-col md:flex-row items-center gap-10 transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            <div className="w-40 h-40 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-lg">
              <img src={currentAlumni.image} alt={currentAlumni.name} className="w-full h-full object-cover" />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{currentAlumni.name}</h2>
              <p className="text-lg font-semibold text-gray-700">{currentAlumni.company}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ITEMS_PER_PAGE = 6;

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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-10">Hubungan Mitra</h2>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">Gagal memuat data mitra</p>
      ) : isMobile ? (
        <Swiper modules={[Pagination]} pagination={{ clickable: true }} spaceBetween={16} slidesPerView={1}>
          {partners.map((partner) => (
            <SwiperSlide key={partner.id}>
              <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                <img
                  src={resolveLocalProxyImage(partner.logo)} // ✅ FIX CORS disini
                  alt={partner.name}
                  className="h-20 object-contain mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-800">{partner.name}</h3>
                <p className="text-sm text-gray-600">{partner.address}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {currentItems.map((partner) => (
              <div key={partner.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 text-center">
                <img
                  src={resolveLocalProxyImage(partner.logo)} // ✅ FIX juga disini
                  alt={partner.name}
                  className="h-16 object-contain mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-800">{partner.name}</h3>
                <p className="text-sm text-gray-600">{partner.address}</p>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-3">
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i + 1)}
                    className={`w-3 h-3 rounded-full ${currentPage === i + 1 ? "bg-blue-600" : "bg-gray-300"}`}
                  />
                ))}
              </div>
              <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
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
      <div className="mt-28">
        <AlumniCarousel />
        <PartnerList />
      </div>
      <Footer />
    </>
  );
}
