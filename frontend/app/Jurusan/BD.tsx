import React from 'react'
import Link from "next/link"

export default function JurusanMP() {
  return (
    <div className="font-sans text-gray-800 bg-gray-50">
      {/* Hero Section */}
      <section className="bg-green-800 text-white text-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow">Bisnis Digital</h1>
        <p className="max-w-4xl mx-auto text-base md:text-lg opacity-90">
            Program Keahlian Bisnis dan Manajemen Modern. Bisnis Digital adalah rumpun ilmu terapan yang mengajarkan perancangan dan pengelolaan bisnis berbasis digital. Perpaduan manajemen, bisnis, teknik informatika, dan sistem informasi untuk menjawab tantangan bisnis masa depan</p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
            {[
                { label: "Rekayasa Perangkat Lunak", href: "/Jurusan/RPL" },
                { label: "Manajemen Perkantoran", href: "/Jurusan/MP" },
                { label: "Layanan Perbankan", href: "/Jurusan/LPB" },
                { label: "Desain Komunikasi Visual", href: "/Jurusan/DKV" },
                { label: "Akuntansi", href: "/Jurusan/AK" },
                { label: "Bisnis Digital", href: null },
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
                    className="bg-white text-green-900 px-5 py-2 rounded-full text-sm font-medium shadow-md"
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
            <h2 className="text-3xl font-bold inline-block relative after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-green-800 after:to-green-800 after:mx-auto after:mt-2">
              Tentang Jurusan BD
            </h2>
            <p className="text-gray-600 mt-3">Mempersiapkan ahli digital business yang mampu menghadirkan solusi bisnis inovatif</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow border-l-4 border-green-800 space-y-4">
            <h3 className="text-green-900 font-semibold text-xl">🎯 Definisi Bisnis Digital</h3>
            <p>Bisnis Digital termasuk dalam rumpun ilmu terapan yang mengajarkan untuk merancang dan menjalankan bisnis berbasis digital. Ilmu yang akan diperoleh adalah perpaduan dari manajemen, bisnis, teknik informatika dan sistem informasi.</p>
            <p>Jurusan ini berdiri untuk menjawab tantangan bisnis masa depan yang akan didominasi oleh sistem digital sehingga memerlukan kajian terstruktur, mendalam dan berkelanjutan untuk merumuskan strategi bisnis yang tepat.</p>
            <p>Lulusan jurusan ini diharapkan memiliki keterampilan mumpuni untuk menjadi seorang ahli Digital Business yang mampu menghadirkan solusi dan rekomendasi dalam berbagai permasalahan bisnis.</p>
          </div>
        </section>

        {/* Capabilities */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold inline-block relative after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-green-800 after:to-green-800 after:mx-auto after:mt-2">
              Kemampuan Pokok Siswa & Keuntungan
            </h2>
            <p className="text-gray-600 mt-3">Mengapa memilih Jurusan Bisnis Digital?</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {icon:'1',title:'Strategi Bisnis Online',desc:'Mempelajari teori dan strategi sukses menjalankan bisnis online, bukan hanya aesthetic produk tetapi implementasi promosi dan pemasaran yang tepat sasaran dengan program magang dan kerja praktik.'},
              {icon:'2',title:'Karir Yang Luas',desc:'Lulusan dicari berbagai perusahaan untuk posisi konsultan bisnis, keuangan perbankan, analis sistem, analis data hingga bekerja di e-commerce terbesar Indonesia.'},
              {icon:'3',title:'Entrepreneur Mindset',desc:'Dapat menciptakan lapangan kerja sendiri dengan membangun startup. Basic ilmu strategi bisnis digital membuat lebih teliti dan percaya diri memulai bisnis berbasis digital.'},
              {icon:'4',title:'Character Building',desc:'Mengembangkan karakter menjadi lebih detail, kritis, teliti, observant, berpengalaman memecahkan masalah dan rasional dalam berbisnis dibanding yang masih awam.'},
            ].map((f,i)=>(
              <div key={i} className="bg-white p-6 rounded-xl text-center shadow hover:-translate-y-2 transition border-t-4 border-green-800">
                <span className="w-12 h-12 flex items-center justify-center mx-auto mb-3 text-white text-xl font-bold bg-green-900 rounded-full">{f.icon}</span>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Curriculum */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold relative inline-block after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-green-800 after:to-green-800 after:mx-auto after:mt-2">
              Mata Pelajaran Kejuruan
            </h2>
            <p className="text-gray-600 mt-3">Kurikulum terintegrasi dari tingkat dasar hingga lanjutan</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow space-y-8">
            <div>
              <h3 className="text-green-900 font-semibold mb-3">🌱 Kelas X - Tingkat Dasar</h3>
              <div className="flex flex-wrap gap-2">
                {['Pengoperasian perangkat, internet, dan etika digital.','Menemukan peluang usaha dan mengembangkan ide bisnis','Perencanaan dan pembuatan produk sederhana.','Konsep pasar, konsumen, harga, dan keuntungan.'].map((s,i)=>(
                  <span key={i} className="bg-gradient-to-r from-green-900 to-green-900 text-white px-4 py-2 rounded-full text-sm shadow">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-green-900 font-semibold mb-3">🔥 Kelas XI & XII - Tingkat Lanjutan</h3>
              <div className="flex flex-wrap gap-2">
                {['Perencanaan bisnis, manajemen data, dan administrasi.','Membangun citra merek di media online.','Membangun citra merek di media online.','Membuat dan mengelola toko di marketplace.'].map((s,i)=>(
                  <span key={i} className="bg-gradient-to-r from-green-900 to-green-900 text-white px-4 py-2 rounded-full text-sm shadow">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Facilities */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold relative inline-block after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-green-800 after:to-green-800 after:mx-auto after:mt-2">
              Fasilitas & Sarana
            </h2>
            <p className="text-gray-600 mt-3">Fasilitas industri untuk pembelajaran bisnis digital yang komprehensif</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {[
              {icon:'💻',title:'Lab Bisnis Online',desc:'Laboratorium pertama di Indonesia dengan fasilitas komputer, internet berkecepatan tinggi, proyektor, dan AC'},
              {icon:'🏪',title:'Lab Retail Alfa Class',desc:'Kerjasama langsung dengan Alfamart untuk praktik retail dengan peralatan modern dan ruangan ber-AC'},
              {icon:'💳',title:'Mesin Transaksi Modern',desc:'Cash register, EDC, barcode, timbangan digital, internet banking dan perangkat transaksi lainnya'},
              {icon:'🖥️',title:'Lab Simulasi Digital',desc:'Tempat pembelajaran dilengkapi komputer, internet berkecepatan tinggi, proyektor dan ruangan ber-AC'},
            ].map((f,i)=>(
              <div key={i} className="bg-white p-5 rounded-lg shadow flex gap-4 items-center border-l-4 border-green-800 hover:-translate-y-1 transition">
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
            <h2 className="text-3xl font-bold relative inline-block after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-green-800 after:to-green-800 after:mx-auto after:mt-2">
              Profil Lulusan & Peluang Karir
            </h2>
            <p className="text-gray-600 mt-3">Peluang karir luas di era digital dan industri 4.0</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {icon:'💰',title:'Karir Bisnis Ritel',desc:'Mengelola transaksi di berbagai bisnis retail modern'},
              {icon:'📦',title:'Admin Gudang',desc:'Mengelola administrasi dan logistik pergudangan'},
              {icon:'📈',title:'Marketing',desc:'Tenaga pemasaran di segala bidang usaha nasional dan internasional'},
              {icon:'🚀',title:'Entrepreneur',desc:'Wirausaha dalam bisnis retail dan online'},
              {icon:'📱',title:'Digital Marketing',desc:'Spesialis pemasaran digital dan media sosial'},
              {icon:'🤝',title:'Public Relations',desc:'Mengelola hubungan masyarakat dan komunikasi perusahaan'},
              {icon:'🔍',title:'Marketing Research',desc:'Riset pasar dan analisis data marketing'},
              {icon:'💾',title:'Database Marketing',desc:'Mengelola data pelanggan dan strategi pemasaran'},
              {icon:'👨‍💼',title:'Marketing Management',desc:'Manajer pemasaran dan strategi bisnis'},
            ].map((c,i)=>(
              <div key={i} className="bg-gradient-to-r from-green-900 to-green-900 text-white p-6 rounded-xl text-center hover:scale-105 transition relative overflow-hidden">
                <span className="text-3xl mb-2 block">{c.icon}</span>
                <h3 className="font-semibold text-lg mb-1">{c.title}</h3>
                <p className="text-sm opacity-90">{c.desc}</p>
              </div>
            ))}

            <div className="md:col-start-2 bg-gradient-to-r from-green-900 to-green-900 text-white p-6 rounded-xl text-center">
              <span className="text-3xl mb-2 block">✍️</span>
              <h3 className="font-semibold text-lg mb-1">Content Marketing</h3>
              <p className="text-sm opacity-90">Spesialis pembuatan konten pemasaran digital</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}