'use client'

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import React from 'react';
import { Users, Clock, MapPin, Award, Target, Calendar, Phone, Mail } from 'lucide-react';
import Navbar from '../../../Components/Navbar';
import Footer from '../../../Components/Footer';
import * as motion from "motion/react-client"

export default function PaskibraDetail() {
  const benefits = [
    "Pembentukan disiplin dan tanggung jawab",
    "Pengembangan kemampuan baris-berbaris dan koordinasi",
    "Latihan kepemimpinan dan kerja sama tim",
    "Peningkatan fokus dan ketahanan mental",
    "Penanaman nilai nasionalisme dan kebanggaan berbangsa"
  ];



  const activities = [
    { name: "Latihan Baris-Berbaris", description: "Menguasai teknik PBB dan formasi" },
    { name: "Koordinasi Tim", description: "Melatih kerja sama dan sinkronisasi antaranggota" },
    { name: "Kepemimpinan", description: "Latihan memimpin regu atau kelompok" },
    { name: "Fokus dan Disiplin", description: "Pengembangan konsentrasi dan ketahanan mental" },
    { name: "Upacara Resmi", description: "Praktik upacara bendera dan protokol resmi" },
    { name: "Etika dan Nasionalisme", description: "Penanaman nilai kebangsaan dan sportifitas" }
  ];

   const images = [
    "/images/dummyImage.jpg",
    "/images/dummyImage.jpg",
    "/images/dummyImage.jpg"
  ];

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50">
     {/* Header */}
<div className="bg-white border-b border-gray-200">
  <div className="max-w-6xl mx-auto px-6 py-12">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Ekstrakurikuler Paskibra
      </h1>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        Program pengembangan karakter melalui kegiatan kepanduan yang terintegrasi 
        dengan kurikulum pendidikan nasional
      </p>

      {/* Image */}
<div className="mt-8">
      {/* Grid layar >= sm */}
      <div className="hidden sm:grid grid-cols-3 gap-10">
        {images.map((src, i) => (
          <motion.img
            key={i}
            src={src}
            alt={`Kegiatan Pramuka ${i + 1}`}
            className="mx-auto rounded-lg shadow-md max-h-80 object-cover"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}   
            transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
          />
        ))}
      </div>

      {/* Carousel layar < sm */}
      <div className="sm:hidden">
        <Swiper
          modules={[Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{ clickable: true }}
        >
          {images.map((src, i) => (
            <SwiperSlide key={i}>
              <img
                src={src}
                alt={`Kegiatan Pramuka ${i + 1}`}
                className="mx-auto rounded-lg shadow-md max-h-80 object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
    </div>
  </div>
</div>


      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Tentang Program
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Ekstrakurikuler Paskibra merupakan kegiatan pendidikan kepemimpinan dan disiplin yang bertujuan membentuk karakter, meningkatkan fokus, dan mengembangkan keterampilan siswa melalui metode pembelajaran yang menyenangkan dan menantang.
                </p>
                <p>
                 Program ini menerapkan sistem latihan Paskibra yang telah terbukti efektif dalam mengembangkan disiplin, kepemimpinan, kemandirian, dan rasa tanggung jawab pada generasi muda.
                </p>
              </div>
            </div>

            {/* Activities */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Kegiatan Utama
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {activities.map((activity, index) => (
                  <div key={index} className="border border-gray-100 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {activity.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {activity.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Manfaat Program
              </h2>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Informasi Program
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Users className="text-gray-500 mr-3" size={18} />
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">Kapasitas</div>
                    <div className="text-gray-600">30-40 siswa</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="text-gray-500 mr-3" size={18} />
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">Jadwal</div>
                    <div className="text-gray-600">Sabtu, 14:00 - 17:00</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="text-gray-500 mr-3" size={18} />
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">Lokasi</div>
                    <div className="text-gray-600">Lapangan sekolah</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="text-gray-500 mr-3" size={18} />
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">Pendaftaran</div>
                    <div className="text-gray-600">Awal tahun ajaran</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Kontak Pembina
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Phone className="text-gray-500 mr-3" size={16} />
                  <span className="text-gray-700">0812-3456-7890</span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="text-gray-500 mr-3" size={16} />
                  <span className="text-gray-700">pramuka@sekolah.ac.id</span>
                </div>
              </div>
              
              <button className="w-full mt-6 bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                Hubungi Pembina
              </button>
            </div>

            {/* Achievement */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Prestasi Terbaru
              </h3>
              
              <div className="text-center">
                <Award className="text-yellow-500 mx-auto mb-3" size={32} />
                <div className="text-sm text-gray-600 mb-2">
                  Juara 1 Paskibra Tingkat
                </div>
                <div className="text-xs text-gray-500">
                  Provinsi 2024
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}