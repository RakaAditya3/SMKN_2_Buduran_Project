import React from 'react'
import Link from "next/link"

export default function JurusanDKV() {
  return (
    <div className="font-sans text-gray-800 bg-gray-50">
      {/* Hero Section */}
      <section className="bg-indigo-800 text-white text-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow">Desain Komunikasi Visual</h1>
        <p className="max-w-4xl mx-auto text-base md:text-lg opacity-90">
            Program Keahlian yang Menggabungkan Seni dan Komunikasi. Mempelajari konsep komunikasi dan ungkapan kreatif dengan memanfaatkan elemen visual untuk menyampaikan pesan yang informatif dan persuasif dengan nilai estetika tinggi.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
            {[
                { label: "Rekayasa Perangkat Lunak", href: "/Jurusan/RPL" },
                { label: "Manajemen Perkantoran", href: "/Jurusan/MP" },
                { label: "Layanan Perbankan", href: "/Jurusan/LPB" },
                { label: "Desain Komunikasi Visual", href: null },
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
                    className="bg-white text-blue-900 px-5 py-2 rounded-full text-sm font-medium shadow-md"
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
            <h2 className="text-3xl font-bold inline-block relative after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-blue-800 after:to-indigo-800 after:mx-auto after:mt-2">
              Tentang Jurusan DKV
            </h2>
            <p className="text-gray-600 mt-3">Cabang ilmu desain yang menggabungkan kreativitas visual dengan komunikasi efektif</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow border-l-4 border-blue-800 space-y-4">
            <h3 className="text-blue-900 font-semibold text-xl">🎯 Definisi Desain Komunikasi Visual</h3>
            <p>Program Keahlian Desain Komunikasi Visual (DKV) adalah cabang ilmu desain yang mempelajari konsep komunikasi dan ungkapan kreatif, teknik dan media dengan memanfaatkan elemen-elemen visual ataupun rupa untuk menyampaikan pesan untuk tujuan tertentu (tujuan informasi ataupun tujuan persuasi yaitu mempengaruhi perilaku).</p>
            <p>Mengembangkan bentuk bahasa visual (bermain gambar), mengolah pesan (bermain kata) keduanya untuk tujuan sosial maupun komersial, dari individu atau kelompok yang ditujukan kepada kelompok lainnya. Visual berwujud kreatif dan inovatif, sementara inti pesan harus komunikatif, efisien dan efektif saling mendukung agar tersampaikan dengan baik pada sasaran.</p>
          </div>
        </section>

        {/* Capabilities */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold inline-block relative after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-blue-800 after:to-indigo-800 after:mx-auto after:mt-2">
              Kemampuan Pokok Siswa
            </h2>
            <p className="text-gray-600 mt-3">Kompetensi utama yang dikembangkan untuk menghadapi dunia kerja kreatif</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {icon:'🎨',title:'Kreativitas Visual',desc:'Mengembangkan ide kreatif dan menuangkannya dalam bentuk visual yang menarik'},
              {icon:'💭',title:'Konsep Komunikasi',desc:'Memahami cara menyampaikan pesan secara efektif melalui media visual'},
              {icon:'🖥️',title:'Digital Desain',desc:'Menguasai software desain profesional untuk berbagai kebutuhan industri'},
              {icon:'📐',title:'Teknik Desain',desc:'Memahami prinsip-prinsip desain, komposisi, dan estetika visual'},
            ].map((f,i)=>(
              <div key={i} className="bg-white p-6 rounded-xl text-center shadow hover:-translate-y-2 transition border-t-4 border-blue-800">
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
            <h2 className="text-3xl font-bold relative inline-block after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-blue-800 after:to-indigo-800 after:mx-auto after:mt-2">
              Mata Pelajaran Kejuruan
            </h2>
            <p className="text-gray-600 mt-3">Kurikulum terintegrasi dari tingkat dasar hingga lanjutan</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow space-y-8">
            <div>
              <h3 className="text-blue-900 font-semibold mb-3">🌟 Kelas X - Fondasi Kreativitas</h3>
              <div className="flex flex-wrap gap-2">
                {['Pemahaman Kreativitas Dasar','Kemampuan Menggambar Sketsa','Teknik Ilustrasi Manual','Pengetahuan Tipografi','Dasar-dasar Fotografi','Pengusaan Kemampuan Grafis'].map((s,i)=>(
                  <span key={i} className="bg-gradient-to-r from-blue-900 to-blue-900 text-white px-4 py-2 rounded-full text-sm shadow">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-blue-900 font-semibold mb-3">🔥 Kelas XI & XII - Spesialisasi Lanjut</h3>
              <div className="flex flex-wrap gap-2">
                {['Ilustrasi Digital Advanced','Videografi & Cinematography','Motion Graphics','Fotografi Komersial','Design Grafika','Brand Identity Design','Packaging Design','UI/UX Design'].map((s,i)=>(
                  <span key={i} className="bg-gradient-to-r from-blue-900 to-blue-900 text-white px-4 py-2 rounded-full text-sm shadow">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Facilities */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold relative inline-block after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-blue-800 after:to-blue-800 after:mx-auto after:mt-2">
              Fasilitas & Sarana
            </h2>
            <p className="text-gray-600 mt-3">4 Laboratorium Praktik DKV dengan peralatan lengkap</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {icon:'🖥️',title:'Personal Computer Built-Up',desc:'Komputer dengan spesifikasi tinggi untuk design grafis dan rendering'},
              {icon:'📸',title:'Kamera DSLR & Mirroriess',desc:'Peralatan fotografi profesional dengan berbagai lensa'},
              {icon:'🎥',title:'Camcorder & Drone',desc:'Peralatan videografi untuk kontent multimedia'},
              {icon:'💡',title:'Lightning Film Set',desc:'Sistem pencahayaan profesional untuk fotografi dan videografi'},
              {icon:'🎭',title:'Multimedia Home Theatre',desc:'System audio visual untuk presentasi dan preview karya'},
              {icon:'🖨️',title:'Printer & Plotter',desc:'Peralatan cetak berkualitas tinggi untuk output final'},
            ].map((f,i)=>(
              <div key={i} className="bg-white p-5 rounded-lg shadow flex gap-4 items-center border-l-4 border-blue-800 hover:-translate-y-1 transition">
                <div className="text-3xl text-green-600">{f.icon}</div>
                <div>
                  <h4 className="font-semibold mb-1">{f.title}</h4>
                  <p className="text-gray-600 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}

            <div className="col-span-full flex justify-center gap-6">
              <div className="bg-white p-5 rounded-lg shadow flex gap-4 items-center border-l-4 border-blue-800 flex-1 max-w-sm hover:-translate-y-1 transition">
                <div className="text-3xl text-green-600">✏️</div>
                <div>
                  <h4 className="font-semibold mb-1">Pen Tablet & Drawing Tools</h4>
                  <p className="text-gray-600 text-sm">Peralatan digital drawing dan sketching untuk ilustrasi</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow flex gap-4 items-center border-l-4 border-blue-800 flex-1 max-w-sm hover:-translate-y-1 transition">
                <div className="text-3xl text-green-600">📽️</div>
                <div>
                  <h4 className="font-semibold mb-1">LCD Projector</h4>
                  <p className="text-gray-600 text-sm">Media presentasi untuk pembelajaran dan showcase karya</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Career */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold relative inline-block after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-blue-800 after:to-blue-800 after:mx-auto after:mt-2">
              Profil Lulusan & Peluang Karir
            </h2>
            <p className="text-gray-600 mt-3">Kompetensi lulusan yang siap menghadapi tantangan industri kreatif</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {icon:'🎨',title:'Concept Art & Ilustrasi',desc:'Menguasai pembuatan concept art dan ilustrasi manual atau digital, dengan teknik profesional'},
              {icon:'🏢',title:'SIap Kerja Profesional',desc:'Lulusan yang siap kerja dan mampu mengikuti perubahan zaman dengan adaptasi teknologi terbaru'},
              {icon:'🎯',title:'Brand & UI/UX Specialist',desc:'Memahami proses Brand Identity, UI/UX Design, Packaging and Promotion Design secara menyeluruh'},
              {icon:'⚙️',title:'Produksi Desain Grafis',desc:'Mampu memahami proses produksi desain grafis secara menyeluruh dari konsep hingga implementasi'},
              {icon:'💼',title:'Media Desain Komersial',desc:'Mampu merancang produk media desain komunikasi visual untuk kebutuhan komersial maupun sosial'},
              {icon:'✅',title:'Quality Control Expert',desc:'Mampu melaksanakan quality control di setiap tahap proses produk media desain komunikasi visual'},
            ].map((c,i)=>(
              <div key={i} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl text-center hover:scale-105 transition relative overflow-hidden">
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