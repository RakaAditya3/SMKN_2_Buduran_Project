import React from 'react'
import Link from "next/link"

export default function JurusanLPB() {
  return (
    <div className="font-sans text-gray-800 bg-gray-50">
      {/* Hero Section */}
      <section className="bg-pink-500 text-white text-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow">Layanan Perbankan</h1>
        <p className="max-w-4xl mx-auto text-base md:text-lg opacity-90">
            Program Keahlian Layanan Perbankan dan Keuangan Lembaga. Mempersiapkan tenaga professional di bidang keuangan dan perbankan yang kompeten dalam menghadapi kebutuhan industri perbankan yang terus berkembang seiring kemajuan teknologi.        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
            {[
                { label: "Rekayasa Perangkat Lunak", href: "/Jurusan/RPL" },
                { label: "Manajemen Perkantoran", href: "/Jurusan/MP" },
                { label: "Layanan Perbankan", href: null },
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
                    className="bg-white text-pink-600 px-5 py-2 rounded-full text-sm font-medium shadow-md"
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
            <h2 className="text-3xl font-bold inline-block relative after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-pink-500 after:to-pink-500 after:mx-auto after:mt-2">
              Tentang Jurusan LPB
            </h2>
            <p className="text-gray-600 mt-3">Kompetensi keahlian yang fokus pada seluruh kegiatan perbankan dan keuangan</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow border-l-4 border-pink-500 space-y-4">
            <h3 className="text-pink-600 font-semibold text-xl">🎯 Definisi Layanan Perbankan</h3>
            <p>Program Keahlian Desain Komunikasi Visual (DKV) adalah cabang ilmu desain yang mempelajari konsep komunikasi dan ungkapan kreatif, teknik dan media dengan memanfaatkan elemen-elemen visual ataupun rupa untuk menyampaikan pesan untuk tujuan tertentu (tujuan informasi ataupun tujuan persuasi yaitu mempengaruhi perilaku).</p>
            <p>Mengembangkan bentuk bahasa visual (bermain gambar), mengolah pesan (bermain kata) keduanya untuk tujuan sosial maupun komersial, dari individu atau kelompok yang ditujukan kepada kelompok lainnya. Visual berwujud kreatif dan inovatif, sementara inti pesan harus komunikatif, efisien dan efektif saling mendukung agar tersampaikan dengan baik pada sasaran.</p>
          </div>
        </section>

        {/* Capabilities */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold inline-block relative after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-pink-500 after:to-pink-500 after:mx-auto after:mt-2">
              Kemampuan Pokok Siswa
            </h2>
            <p className="text-gray-600 mt-3">Keahlian yang dikuasai untuk menjadi profesional di bidang perbankan</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {icon:'📊',title:'AKutansi Perbankan',desc:'Menguasai sistem akutansi khusus perbankan dan laporan keuangan bank'},
              {icon:'💻',title:'Komputer Akuntansi',desc:'Mengoperasikan software akutansi dan aplikasi perbankan modern'},
              {icon:'🤝',title:'Customer Service',desc:'Melayani nasabah dengan profesional dan menguasai produk perbankan'},
              {icon:'💰',title:'Administrasi Keuangan',desc:'Mengelola administrasi kredit, kas, dan transaksi perbankan'},
            ].map((f,i)=>(
              <div key={i} className="bg-white p-6 rounded-xl text-center shadow hover:-translate-y-2 transition border-t-4 border-pink-500">
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
            <h2 className="text-3xl font-bold relative inline-block after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-pink-500 after:to-pink-500 after:mx-auto after:mt-2">
              Mata Pelajaran Kejuruan
            </h2>
            <p className="text-gray-600 mt-3">Progres pembelajaran dari dasar akuntansi hingga spesialisasi perbankan</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow space-y-8">
            <div>
              <h3 className="text-pink-600 font-semibold mb-3">🌱 Kelas X - Tingkat Dasar</h3>
              <div className="flex flex-wrap gap-2">
                {['Proses Bisnis Akuntansi dan Keuangan Lembaga','Perkembangan Teknologi Industri','Profil Entrepreneur & Peluang Usaha','Keselamatan dan Kesehatan Kerja (K3LH)','Etika Profesi Akuntansi dan Keuangan','Konsep Akuntansi dan Perbankan Dasar','Aplikasi Pengolah Angka/Spreadsheet'].map((s,i)=>(
                  <span key={i} className="bg-gradient-to-r from-pink-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm shadow">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-pink-600 font-semibold mb-3">🔥 Kelas XI & XII - Tingkat Lanjutan</h3>
              <div className="flex flex-wrap gap-2">
                {['Ekonomi Bisnis dan Administrasi Umum','Pengelolaan Kas','Layanan Lembaga Perbankan dan Keuangan Mikro','Akuntansi Perbankan dan Keuangan Mikro','Komputer Akuntansi','Perpajakan','Produk Kreatif dan Kewirausahaan'].map((s,i)=>(
                  <span key={i} className="bg-gradient-to-r from-pink-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm shadow">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Facilities */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold relative inline-block after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-pink-500 after:to-pink-500 after:mx-auto after:mt-2">
              Fasilitas & Sarana
            </h2>
            <p className="text-gray-600 mt-3">Laboratorium perbankan dengan peralatan bank sesungguhnya</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {icon:'🖥️',title:'PC/Laptop & Software Bank Mini',desc:'Komputer dengan aplikasi simulasi perbankan untuk praktik'},
              {icon:'🖨️',title:'Printer Passbook & Thermal',desc:'Printer khusus buku tabungan dan struk transaksi'},
              {icon:'💵',title:'Money Counter Machine',desc:'Mesin penghitung uang standing dan portable'},
              {icon:'📱',title:'HP Banking & Telephone',desc:'Perangkat komunikasi untuk layanan perbankan'},
              {icon:'🗃️',title:'Paper Shredder & Lemari Arsip',desc:'Penghancur dokumen dan penyimpanan arsip'},
              {icon:'🏦',title:'Meja Teller & Customer Service',desc:'Furniture simulasi lingkungan kerja perbankan'},
            ].map((f,i)=>(
              <div key={i} className="bg-white p-5 rounded-lg shadow flex gap-4 items-center border-l-4 border-pink-500 hover:-translate-y-1 transition">
                <div className="text-3xl text-green-600">{f.icon}</div>
                <div>
                  <h4 className="font-semibold mb-1">{f.title}</h4>
                  <p className="text-gray-600 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}

            <div className="col-span-full flex justify-center gap-6">
              <div className="bg-white p-5 rounded-lg shadow flex gap-4 items-center border-l-4 border-pink-500 flex-1 max-w-sm hover:-translate-y-1 transition">
                <div className="text-3xl text-green-600">💰</div>
                <div>
                  <h4 className="font-semibold mb-1">Cash Box & Kalkulator</h4>
                  <p className="text-gray-600 text-sm">Brankas mini dan kalkulator 12 digit profesional</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow flex gap-4 items-center border-l-4 border-pink-500 flex-1 max-w-sm hover:-translate-y-1 transition">
                <div className="text-3xl text-green-600">🪑</div>
                <div>
                  <h4 className="font-semibold mb-1">Kursi Tunggu Nasabah</h4>
                  <p className="text-gray-600 text-sm">Area tunggu yang nyaman untuk simulasi pelayanan</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Career */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold relative inline-block after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-pink-500 after:to-pink-600 after:mx-auto after:mt-2">
              Profil Lulusan & Peluang Karir
            </h2>
            <p className="text-gray-600 mt-3">Berbagai profesi menjanjikan di industri perbankan dan keuangan</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {icon:'💰',title:'Kasir',desc:'Menguasai kemampuan menghitung dengan baik, cocok bekerja sebagai kasir di berbagai institusi keuangan'},
              {icon:'🏧',title:'Teller Bank',desc:'Melayani penarikan, transfer dan penyetoran uang dari pelanggan hingga pemeriksaan kas'},
              {icon:'🤝',title:'Customer Service',desc:'Melayani nasabah dengan pemahaman mendalam tentang produk dan layanan perbankan'},
              {icon:'📈',title:'Account Officer',desc:'Melakukan pengenalan produk finansial berupa simpanan, kredit, dan asuransi'},
              {icon:'💼',title:'FUnding Officer',desc:'Bertugas sebagai pengumpul dana dari nasabah bank dan lembaga keuangan'},
              {icon:'🚀',title:'Wirausaha',desc:'Mengelola uang dan manajemen keuangan dengan baik untuk membangun bisnis sendiri'},
            ].map((c,i)=>(
              <div key={i} className="bg-gradient-to-r from-pink-600 to-pink-600 text-white p-6 rounded-xl text-center hover:scale-105 transition relative overflow-hidden">
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