"use client";

import React, { useEffect, useState } from 'react'
import Link from "next/link"
import { FaArrowUp } from "react-icons/fa"

export default function JurusanAK() {
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
    <div className="font-sans text-gray-800 bg-gray-50">
      {/* Hero Section */}
      <section className="bg-purple-800 text-white text-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow">Akutansi</h1>
        <p className="max-w-4xl mx-auto text-base md:text-lg opacity-90">
            Program Keahlian Bisnis dan Manajemen. Dasar-Dasar Akuntansi dan Keuangan Lembaga adalah kompetensi mendasari penguasaan akuntansi dan keuangan untuk profesi Teknisi Akuntansi Junior dalam proses dokumentasi, pencatatan, dan penyajian data keuangan</p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
            {[
                { label: "Rekayasa Perangkat Lunak", href: "/Pages/Jurusan/RPL" },
                { label: "Manajemen Perkantoran", href: "/Pages/Jurusan/MP" },
                { label: "Layanan Perbankan", href: "/Pages/Jurusan/LPB" },
                { label: "Desain Komunikasi Visual", href: "/Pages/Jurusan/DKV" },
                { label: "Akuntansi", href: null },
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
                    className="bg-white text-purple-900 px-5 py-2 rounded-full text-sm font-medium shadow-md"
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
            <h2 className="text-3xl font-bold inline-block relative after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-purple-800 after:to-purple-800 after:mx-auto after:mt-2">
              Tentang Jurusan AK
            </h2>
            <p className="text-gray-600 mt-3">Membekali siswa dengan kompetensi akuntansi dan keuangan lembaga yang komprehensif</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow border-l-4 border-purple-800 space-y-4">
            <h3 className="text-purple-900 font-semibold text-xl">🎯 Definisi Akutansi</h3>
            <p>Dasar-Dasar Akuntansi dan Keuangan Lembaga adalah salah satu mata pelajaran yang berisi kompetensi yang mendasari penguasaan akuntansi dan keuangan lembaga untuk profesi Teknisi Akuntansi Junior.</p>
            <p>Mata Pelajaran Dasar-Dasar Akuntansi dan Keuangan Lembaga berfungsi untuk menumbuh kembangkan minat dan renjana (passion) peserta didik dalam memahami proses bisnis di dunia kerja, memahami perkembangan teknologi dan isu-isu terkini di industri, mengenali berbagai macam profesi, okupasi kerja, dan peluang usaha.</p>
          </div>
        </section>

        {/* Capabilities */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold inline-block relative after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-purple-800 after:to-purple-800 after:mx-auto after:mt-2">
              Kemampuan Pokok Siswa
            </h2>
            <p className="text-gray-600 mt-3">Keahlian yang dikuasai untuk menjadi profesional di bidang akuntansi dan keuangan</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {icon:'📊',title:'Hard Skills',desc:'Menguasai aspek teknis akuntansi dan mampu menerapkan elemen kompetensi bidang akuntansi'},
              {icon:'🤝',title:'Soft Skills',desc:'Integritas tinggi, gigih, berpikir kritis, komunikasi baik, dan manajemen waktu'},
              {icon:'💼',title:'Profesionalisme',desc:'Berpenampilan menarik, konsisten, dan mampu mengelola pekerjaan dengan baik'},
              {icon:'💻',title:'Teknologi',desc:'Menggunakan aplikasi akuntansi modern dan sistem komputerisasi'},
            ].map((f,i)=>(
              <div key={i} className="bg-white p-6 rounded-xl text-center shadow hover:-translate-y-2 transition border-t-4 border-purple-800">
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
            <h2 className="text-3xl font-bold relative inline-block after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-purple-800 after:to-purple-800 after:mx-auto after:mt-2">
              Mata Pelajaran Kejuruan
            </h2>
            <p className="text-gray-600 mt-3">Progres pembelajaran dari dasar akuntansi hingga manajemen keuangan lanjutan</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow space-y-8">
            <div>
              <h3 className="text-purple-900 font-semibold mb-3">🌱 Kelas X - Tingkat Dasar</h3>
              <div className="flex flex-wrap gap-2">
                {['Proses bisnis di dunia kerja akuntansi dan keuangan','Perkembangan teknologi dan isu terkini industri','Profil entrepreneur dan peluang usaha','Keselamatan dan Kesehatan Kerja (K3LH)','Prinsip-prinsip akuntansi dasar','Konsep Akuntansi dan Perbankan Dasar','Aplikasi Pengolah Angka/Spreadsheet'].map((s,i)=>(
                  <span key={i} className="bg-gradient-to-r from-purple-900 to-purple-900 text-white px-4 py-2 rounded-full text-sm shadow">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-purple-900 font-semibold mb-3">🔥 Kelas XI & XII - Tingkat Lanjutan</h3>
              <div className="flex flex-wrap gap-2">
                {['Administrasi keuangan tingkat lanjut','Perpajakan dan aplikasinya','Staf perbankan profesional','Komputer akuntansi (MYOB & Accurate)','Analisis laporan keuangan','Manajemen persediaan dan pergudangan','Asisten manajer akuntansi'].map((s,i)=>(
                  <span key={i} className="bg-gradient-to-r from-purple-900 to-purple-900 text-white px-4 py-2 rounded-full text-sm shadow">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Facilities */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold relative inline-block after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-purple-800 after:to-purple-800 after:mx-auto after:mt-2">
              Fasilitas & Sarana
            </h2>
            <p className="text-gray-600 mt-3">Fasilitas modern untuk mendukung pembelajaran praktik akuntansi</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {icon:'🖥️',title:'36 PC Built-in Ber AC',desc:'Komputer mumpuni dengan software MYOB Ver. 18 ED dan Accurate Ver. 5.0'},
              {icon:'💻',title:'2 Laptop dengan Software',desc:'Laptop dengan aplikasi komputer akuntansi MYOB dan Accurate'},
              {icon:'📽️',title:'2 LCD Projector',desc:'Proyektor untuk presentasi dan pembelajaran multimedia'},
              {icon:'🎵',title:'Sound System Lengkap',desc:'Mikrofon, amplifier, dan salon untuk kebutuhan audio'},
              {icon:'🖨️',title:'3 Printer Inkjet & 1 Laser',desc:'Perangkat cetak untuk kebutuhan praktik dan administrasi'},
              {icon:'🪑',title:'40 Meja Kursi Praktek Manual',desc:'Desain khusus untuk praktik akuntansi manual yang ergonomis'},
            ].map((f,i)=>(
              <div key={i} className="bg-white p-5 rounded-lg shadow flex gap-4 items-center border-l-4 border-purple-800 hover:-translate-y-1 transition">
                <div className="text-3xl text-green-600">{f.icon}</div>
                <div>
                  <h4 className="font-semibold mb-1">{f.title}</h4>
                  <p className="text-gray-600 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}

            <div className="col-span-full flex justify-center gap-6">
              <div className="bg-white p-5 rounded-lg shadow flex gap-4 items-center border-l-4 border-purple-800 flex-1 max-w-sm hover:-translate-y-1 transition">
                <div className="text-3xl text-green-600">✏️</div>
                <div>
                  <h4 className="font-semibold mb-1">Alat Tulis Praktek Lengkap</h4>
                  <p className="text-gray-600 text-sm">Penggaris, perforator, staples, dan lembar kerja praktek</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow flex gap-4 items-center border-l-4 border-purple-800 flex-1 max-w-sm hover:-translate-y-1 transition">
                <div className="text-3xl text-green-600">🌐</div>
                <div>
                  <h4 className="font-semibold mb-1">Akses Internet</h4>
                  <p className="text-gray-600 text-sm">Koneksi internet untuk pembelajaran dan riset online</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Career */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold relative inline-block after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-purple-800 after:to-purple-800 after:mx-auto after:mt-2">
              Profil Lulusan & Peluang Karir
            </h2>
            <p className="text-gray-600 mt-3">Berbagai peluang karir di bidang akuntansi, keuangan, dan bisnis</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {icon:'💼',title:'Administrasi Keuangan',desc:'Sebagai staf administrasi keuangan yang professional dalam mengelola administrasi keuangan lembaga'},
              {icon:'📊',title:'Staf Perpajakan',desc:'Menguasai sistem perpajakan dan mampu membantu perusahaan dalam urusan pajak'},
              {icon:'🏦',title:'Staf Perbankan',desc:'Bekerja di institusi perbankan dengan pemahaman keuangan dan akuntansi yang kuat'},
              {icon:'👨‍💼',title:'Asisten Manajer Akuntansi',desc:'Mengelola tim akuntansi dengan kemampuan leadership dan technical skills yang mumpuni'},
              {icon:'📈',title:'Wirausaha',desc:'Mengembangkan bisnis sendiri dengan wawasan entrepreneur dan kemampuan keuangan'},
              {icon:'🎓',title:'Melanjutkan Kuliah',desc:'Memiliki bekal yang kuat untuk melanjutkan pendidikan tinggi di bidang akuntansi'},
            ].map((c,i)=>(
              <div key={i} className="bg-gradient-to-r from-purple-900 to-purple-900 text-white p-6 rounded-xl text-center hover:scale-105 transition relative overflow-hidden">
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
                      className="bg-purple-900 text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-800 transition cursor-pointer"
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