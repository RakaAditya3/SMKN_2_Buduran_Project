"use client";

import React, { useEffect, useState } from 'react'
import Link from "next/link"
import { FaArrowUp } from "react-icons/fa"

export default function JurusanRPL() {
  const [isVisible, setIsVisible] = useState(false)
  
    useEffect(() => {
      const toggleVisibility = () => {
        if (window.scrollY > 300) {
          setIsVisible(true)
        } else {
          setIsVisible(false)
        }
      }
  
      window.addEventListener("scroll", toggleVisibility)
      return () => window.removeEventListener("scroll", toggleVisibility)
    }, [])
  
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  return (
    <div className="font-sans text-gray-800 bg-gray-50 mt-30">
      {/* Hero Section */}
      <section className="bg-blue-500 text-white text-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow">Rekayasa Perangkat Lunak</h1>
        <p className="max-w-4xl mx-auto text-base md:text-lg opacity-90">
            Program Keahlian Pengembangan Perangkat Lunak dan Gim Mempersiapkan peserta didik yang kompeten dalam pengembangan perangkat lunak berbasis web maupun berbasis desktop, menjawab kebutuhan programmer di era digital yang terus berkembang
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
            {[
                { label: "Rekayasa Perangkat Lunak", href: null },
                { label: "Manajemen Perkantoran", href: "/Pages/Jurusan/MP" },
                { label: "Layanan Perbankan", href: "/Pages/Jurusan/LPB" },
                { label: "Desain Komunikasi Visual", href: "/Pages/Jurusan/DKV" },
                { label: "Akuntansi", href: "/Pages/Jurusan/AK" },
                { label: "Bisnis Digital", href: "/Pages/Jurusan/BD" },
            ].map((item, i) =>
                item.href ? (
                <Link
                    key={i}
                    href={item.href}
                    className="bg-white/20 border border-white/30 backdrop-blur px-5 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition"
                >
                    {item.label}
                </Link>
                ) : (
                <span
                    key={i}
                    className="bg-white text-blue-600 px-5 py-2 rounded-full text-sm font-medium shadow-md"
                >
                    {item.label}
                </span>
                )
            )}
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-16 space-y-20">
        {/* About */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold inline-block relative after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-indigo-500 after:mx-auto after:mt-2">
              Tentang Jurusan RPL
            </h2>
            <p className="text-gray-600 mt-3">Bidang ilmu yang mempelajari pengembangan, pemeliharaan, dan manajemen perangkat lunak</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow border-l-4 border-blue-500 space-y-4">
            <h3 className="text-blue-600 font-semibold text-xl">🎯 Definisi Rekayasa Perangkat Lunak</h3>
            <p>RPL merupakan bidang ilmu yang mempelajari pengembangan perangkat lunak mulai dari pembuatan, pemeliharaan, hingga manajemen kualitasnya.</p>
            <p>RPL mengubah perangkat lunak agar lebih efisien, efektif, dan bermanfaat dengan prinsip rekayasa perangkat lunak.</p>
          </div>
        </section>

        {/* Capabilities */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold inline-block relative after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-indigo-500 after:mx-auto after:mt-2">
              Kemampuan Pokok Siswa
            </h2>
            <p className="text-gray-600 mt-3">Kompetensi yang akan dikuasai setelah pembelajaran</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {icon:'🌐',title:'Pemrograman Web',desc:'Mampu membuat aplikasi web modern dan responsif'},
              {icon:'🖥️',title:'Aplikasi Desktop',desc:'Mengembangkan aplikasi desktop dengan UI ramah pengguna'},
              {icon:'📊',title:'Database Management',desc:'Pemodelan, perancangan, dan pengelolaan basis data'},
              {icon:'🎯',title:'Problem Solving',desc:'Menguasai algoritma dan pemrograman berorientasi objek'},
            ].map((f,i)=>(
              <div key={i} className="bg-white p-6 rounded-xl text-center shadow hover:-translate-y-2 transition border-t-4 border-blue-500">
                <span className="text-4xl mb-3 block">{f.icon}</span>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Curriculum */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold relative inline-block after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-indigo-500 after:mx-auto after:mt-2">
              Mata Pelajaran Kejuruan
            </h2>
            <p className="text-gray-600 mt-3">Kurikulum terintegrasi dari dasar hingga lanjutan</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow space-y-8">
            <div>
              <h3 className="text-blue-600 font-semibold mb-3">🌱 Kelas X - Tingkat Dasar</h3>
              <div className="flex flex-wrap gap-2">
                {['Dasar-dasar Pengembangan Perangkat Lunak dan Gim','Algoritma Pemrograman','Bahasa Pemrograman Dasar','Pemrograman Terstruktur'].map((s,i)=>(
                  <span key={i} className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm shadow">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-blue-600 font-semibold mb-3">🔥 Kelas XI & XII - Tingkat Lanjutan</h3>
              <div className="flex flex-wrap gap-2">
                {['Pemodelan Perangkat Lunak','Basis Data','Pemrograman Berorientasi Objek','Pemrograman Web','Perangkat Bergerak (Mobile)','Produk Kreatif dan Kewirausahaan'].map((s,i)=>(
                  <span key={i} className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm shadow">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Facilities */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold relative inline-block after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-600 after:mx-auto after:mt-2">
              Fasilitas & Sarana
            </h2>
            <p className="text-gray-600 mt-3">2 Laboratorium Praktik RPL dengan peralatan lengkap</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {icon:'🖥️',title:'Personal Computer Built-Up',desc:'PC dengan spesifikasi memadai untuk belajar RPL'},
              {icon:'💻',title:'Laptop Portable',desc:'Perangkat mobile untuk coding yang fleksibel'},
              {icon:'🖨️',title:'Printer & Scanner',desc:'Peralatan dokumentasi project'},
              {icon:'📽️',title:'LCD Proyektor',desc:'Media presentasi interaktif'},
              {icon:'📊',title:'Barcode Scanner',desc:'Untuk aplikasi inventory & POS'},
              {icon:'🌐',title:'Akses Internet Stabil',desc:'Koneksi cepat untuk research & dev'},
            ].map((f,i)=>(
              <div key={i} className="bg-white p-5 rounded-lg shadow flex gap-4 items-center border-l-4 border-blue-500 hover:-translate-y-1 transition">
                <div className="text-3xl text-green-600">{f.icon}</div>
                <div>
                  <h4 className="font-semibold mb-1">{f.title}</h4>
                  <p className="text-gray-600 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Career */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold relative inline-block after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-600 after:mx-auto after:mt-2">
              Profil Lulusan & Peluang Karir
            </h2>
            <p className="text-gray-600 mt-3">Profesi menjanjikan untuk lulusan RPL</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {icon:'🌐',title:'Web Programmer',desc:'Frontend & Backend Dev'},
              {icon:'🖥️',title:'Desktop Programmer',desc:'Desktop Application Dev'},
              {icon:'🗄️',title:'Database Engineer',desc:'DBA & Data Management'},
              {icon:'📱',title:'Mobile Programmer',desc:'Android App Dev'},
              {icon:'🎮',title:'Game Programmer',desc:'Game Development'},
              {icon:'🛠️',title:'IT Support & Staff',desc:'Technical Support'},
            ].map((c,i)=>(
              <div key={i} className="bg-gradient-to-r from-blue-600 to-blue-600 text-white p-6 rounded-xl text-center hover:scale-105 transition relative overflow-hidden">
                <span className="text-3xl mb-2 block">{c.icon}</span>
                <h3 className="font-semibold text-lg mb-1">{c.title}</h3>
                <p className="text-sm opacity-90">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>
        {isVisible && (
                  <div className='flex justify-center mt-6'>
                    <button
                      onClick={scrollToTop}
                      className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-800 transition cursor-pointer"
                      aria-label="Back to top"
                    >
                      <FaArrowUp />
                    </button>
                  </div>
                )}
      </main>
    </div>
  );
}