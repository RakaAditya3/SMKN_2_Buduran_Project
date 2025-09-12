import React from 'react'
import Link from "next/link"

export default function JurusanMP() {
  return (
    <div className="font-sans text-gray-800 bg-gray-50">
      {/* Hero Section */}
      <section className="bg-orange-600 text-white text-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow">Manajemen Perkantoran & Layanan Bisnis</h1>
        <p className="max-w-4xl mx-auto text-base md:text-lg opacity-90">
            Program Keahlian Modern untuk Dunia Kerja Perkantoran. Program Keahlian MPLB membekali peserta didik dengan keterampilan manajemen perkantoran yang kompeten, mencetak tenaga kerja tingkat menengah yang terampil, kompetitif, berkepribadian, dan profesional</p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
            {[
                { label: "Rekayasa Perangkat Lunak", href: "/Jurusan/RPL" },
                { label: "Manajemen Perkantoran", href: null },
                { label: "Layanan Perbankan", href: "/Jurusan/LPB" },
                { label: "Desain Komunikasi Visual", href: "/Jurusan/DKV" },
                { label: "Akuntansi", href: "/Jurusan/AK" },
                { label: "Bisnis Digital", href: "/Jurusan/BD" },
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
                    className="bg-white text-orange-700 px-5 py-2 rounded-full text-sm font-medium shadow-md"
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
            <h2 className="text-3xl font-bold inline-block relative after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-orange-600 after:to-orange-600 after:mx-auto after:mt-2">
              Tentang Jurusan MPLB
            </h2>
            <p className="text-gray-600 mt-3">Perubahan dari OTKP menjadi MPLB sesuai Kurikulum Merdeka Belajar</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow border-l-4 border-orange-600 space-y-4">
            <h3 className="text-orange-700 font-semibold text-xl">🎯  Definisi Manajemen Perkantoran & Layanan Bisnis</h3>
            <p>Kurikulum Merdeka Belajar memberikan perubahan nama pada Kompetensi Keahlian Otomatisasi Tata Kelola Perkantoran (OTKP) menjadi Program Keahlian Manajemen Perkantoran dan Layanan Bisnis (MPLB). Pada kompetensi keahlian ini, peserta didik dibekali dengan keterampilan, pengetahuan dan sikap untuk menjadi tenaga kerja tingkat menengah yang memiliki kecakapan dalam bidang pengelolaan manajemen perkantoran yang kompeten.</p>
            <p>Program Keahlian Manajemen Perkantoran dan Layanan Bisnis (MPLB) adalah program keahlian yang dulunya merupakan program keahlian Administrasi Perkantoran. Program ini akan membekali peserta didik dengan berbagai keilmuan dan praktik pada ruang lingkup pengelolaan bisnis dan administrasi dengan fokus pada keilmuan di bidang manajemen perkantoran dan manajemen logistik, kewirausahaan, serta keterampilan mengelola administrasi bisnis.</p>
            <p>Dengan adanya program keahlian ini diharapkan dapat mencetak tenaga-tenaga yang terampil, kompetitif, berkepribadian, dan profesional demi mencukupi kebutuhan tenaga kerja manajemen dalam lingkungan pekerjaan kantor.</p>
          </div>
        </section>

        {/* Capabilities */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold inline-block relative after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-orange-600 after:to-orange-600 after:mx-auto after:mt-2">
              Kemampuan Pokok Siswa
            </h2>
            <p className="text-gray-600 mt-3">Soft skills dan hard skills untuk menghadapi tantangan dunia kerja</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {icon:'🧠',title:'Berpikir Kritis',desc:'Mengembangkan kemampuan berpikir kritis dalam memecahkan masalah perkantoran'},
              {icon:'💼',title:'Administrasi Bisnis',desc:'Menguasai pengelolaan administrasi bisnis dan manajemen perkantoran modern'},
              {icon:'💻',title:'Teknologi Perkantoran',desc:'Menguasai aplikasi dan teknologi terkini untuk mendukung aktivitas perkantoran'},
              {icon:'🤝',title:'Komunikasi Bisnis',desc:'Kemampuan komunikasi profesional dalam lingkungan kerja dan layanan bisnis'},
            ].map((f,i)=>(
              <div key={i} className="bg-white p-6 rounded-xl text-center shadow hover:-translate-y-2 transition border-t-4 border-orange-600">
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
            <h2 className="text-3xl font-bold relative inline-block after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-orange-600 after:to-orange-600 after:mx-auto after:mt-2">
              Mata Pelajaran Kejuruan
            </h2>
            <p className="text-gray-600 mt-3">Progres pembelajaran dari dasar perkantoran hingga manajemen bisnis profesional</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow space-y-8">
            <div>
              <h3 className="text-orange-700 font-semibold mb-3">🌱 Kelas X - Tingkat Dasar</h3>
              <div className="flex flex-wrap gap-2">
                {['Gambaran menyeluruh Program Keahlian MPLB','Proses bisnis dan perkembangan teknologi','Job profile dan teknik dasar aktivitas perkantoran','Dokumen berbasis digital','Peralatan dan aplikasi teknologi perkantoran','Sistem informasi dan komunikasi organisasi','Layanan bisnis dan logistik sesuai standar'].map((s,i)=>(
                  <span key={i} className="bg-gradient-to-r from-orange-700 to-orange-700 text-white px-4 py-2 rounded-full text-sm shadow">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-orange-700 font-semibold mb-3">🔥 Kelas XI & XII - Tingkat Lanjutan</h3>
              <div className="flex flex-wrap gap-2">
                {['Pengelolaan administrasi umum','Ekonomi dan bisnis','Komunikasi di tempat kerja','Pengelolaan kearsipan','Teknologi kantor','Pengelolaan rapat','Pengelolaan keuangan sederhana','SDM, Sarpras dan Humas/Keprotokolan'].map((s,i)=>(
                  <span key={i} className="bg-gradient-to-r from-orange-700 to-orange-700 text-white px-4 py-2 rounded-full text-sm shadow">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Facilities */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold relative inline-block after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-orange-600 after:to-orange-600 after:mx-auto after:mt-2">
              Fasilitas & Sarana
            </h2>
            <p className="text-gray-600 mt-3">2 Laboratorium Praktek MPLB dengan peralatan kantor modern</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {icon:'🖥️',title:'Personal Computer Built-Up',desc:'Komputer untuk kegiatan pembelajaran MPLB'},
              {icon:'🖨️',title:'Printer & Scanner',desc:'Perangkat cetak dan scan dokumen'},
              {icon:'📽️',title:'LCD Proyektor',desc:'Proyektor untuk presentasi dan multimedia'},
              {icon:'🔊',title:'Speaker Active',desc:'Sistem audio untuk pembelajaran'},
              {icon:'📄',title:'Mesin Penghancur Kertas',desc:'Paper shredder untuk keamanan dokumen'},
              {icon:'📚',title:'Mesin Penjilid & Pemotong',desc:'Peralatan finishing dokumen'},
              {icon:'🎤',title:'Mesin Dikte',desc:'Perangkat untuk latihan stenografi'},
              {icon:'🗃️',title:'Sistem Kearsipan Lengkap',desc:'Lemari arsip rotary, filling cabinet, kartu indeks'},
              {icon:'📞',title:'Sistem Komunikasi',desc:'Interkom untuk komunikasi internal'},
              {icon:'🌐',title:'Akses Internet',desc:'Koneksi internet untuk pembelajaran online', center:true},
            ].map((f,i)=>(
              <div 
                key={i} 
                className={`bg-white p-5 rounded-lg shadow flex gap-4 items-center border-l-4 border-orange-600 hover:-translate-y-1 transition
                  ${f.center ? 'lg:col-span-1 lg:col-start-2' : ''}`}
              >
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
            <h2 className="text-3xl font-bold relative inline-block after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-orange-600 after:to-orange-700 after:mx-auto after:mt-2">
              Profil Lulusan & Peluang Karir
            </h2>
            <p className="text-gray-600 mt-3">Berbagai peluang karir di bidang administrasi dan manajemen perkantoran</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {icon:'👩‍💼',title:'Asisten Sekertaris',desc:'Menjadi sekretaris junior yang handal dengan kemampuan administrasi dan komunikasi yang baik'},
              {icon:'📋',title:'Staf Administrasi',desc:'Siap menjadi staf administrasi sesuai tuntutan pekerjaan perkantoran modern'},
              {icon:'🏢',title:'Resepsionis',desc:'Siap menjadi staf administrasi sesuai tuntutan pekerjaan perkantoran modern'},
              {icon:'💻',title:'Operator Komputer',desc:'Mengoperasikan komputer dengan aplikasi pekerjaan perkantoran secara profesional'},
              {icon:'📞',title:'Operator Telepon',desc:'Kemampuan komunikasi Bahasa Indonesia dan Inggris dengan etika komunikasi yang baik'},
              {icon:'🤝',title:'Customer Service',desc:'Memberikan pelayanan terbaik bagi perusahaan dengan kemampuan komunikasi excellent'},
              {icon:'📁',title:'Wirausaha',desc:'Mampu bekerja dalam sistem kearsipan manual maupun digital dengan baik dan teratur', center:true},
            ].map((c,i)=>(
              <div 
                key={i} 
                className={`bg-gradient-to-r from-orange-700 to-orange-700 text-white p-6 rounded-xl text-center hover:scale-105 transition relative overflow-hidden
                  ${c.center ? 'md:col-span-1 md:col-start-2' : ''}`}
              >
                <span className="text-3xl mb-2 block">{c.icon}</span>
                <h3 className="font-semibold text-lg mb-1">{c.title}</h3>
                <p className="text-sm opacity-90">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}