import React from 'react';
import { GraduationCap, Building } from 'lucide-react';

const AlumniWebsite: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-800 overflow-hidden">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('images/Sekolah.png')`
          }}
        />
        
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
            ALUMNI & KARIER
          </h1>
          
          {/* Statistics Cards */}
          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-12 text-gray-800">
            <div className="flex flex-col items-center">
              <GraduationCap size={48} className="text-gray-700 mb-2" />
              <div className="text-3xl font-bold">12.960</div>
              <div className="text-sm text-gray-600">Alumni</div>
            </div>
            
            <div className="w-px h-16 bg-gray-300"></div>
            
            <div className="flex flex-col items-center">
              <Building size={48} className="text-gray-700 mb-2" />
              <div className="text-3xl font-bold">119</div>
              <div className="text-sm text-gray-600">Hubungan Mitra</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              Selamat Datang Kembali, Alumni SMKN 2 Buduran
            </h2>
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Text Content */}
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  Sekolah kami bangga telah melahirkan alumni-alumni luar biasa yang tidak hanya 
                  unggul dalam bidang akademik, tetapi juga berprestasi di dunia kerja. Melalui 
                  pendidikan berkualitas, pembentukan karakter, dan pengalaman nyata di lapangan, 
                  para lulusan kami mampu beradaptasi, berinovasi, serta memberikan kontribusi 
                  nyata bagi masyarakat.
                </p>
                
                <p className="text-gray-700 leading-relaxed">
                  Didukung oleh jaringan hubungan industri yang luas, sekolah kami terus menjajin 
                  kerja sama strategis dengan berbagai perusahaan, lembaga, dan instansi, sehingga 
                  membuka peluang magang, pelatihan, dan penempatan kerja yang maksimal bagi 
                  siswa dan alumni. Kami percaya, kolaborasi kuat antara dunia pendidikan dan industri 
                  adalah kunci untuk mencetak generasi yang siap bersaing di era global.
                </p>
              </div>

              {/* Profile Images */}
              <div className="flex justify-center space-x-4">
                <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden shadow-lg">
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <GraduationCap size={32} className="text-white" />
                  </div>
                </div>
                <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden shadow-lg">
                  <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <Building size={32} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Features */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <GraduationCap size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Jaringan Alumni</h3>
              <p className="text-gray-600 text-sm">
                Terhubung dengan ribuan alumni yang tersebar di berbagai industri dan profesi.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building size={24} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Kemitraan Industri</h3>
              <p className="text-gray-600 text-sm">
                Kolaborasi dengan 119+ perusahaan untuk membuka peluang karir terbaik.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Pengembangan Karir</h3>
              <p className="text-gray-600 text-sm">
                Program pelatihan dan pengembangan untuk mendukung kemajuan karir alumni.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniWebsite;