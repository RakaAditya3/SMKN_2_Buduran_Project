import React from "react";
import Navbar from "../../../Components/Navbar"
import Footer from "../../../Components/Footer"

export default function VisiMisiSekolah() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">
              VISI dan MISI Sekolah
            </h1>
            
            {/* School Image */}
            <div className="mb-6">
              <img
                src="/images/dummyImage.jpg"
                alt="SMK Negeri 2 Buduran"
                className="w-190 h-75 max-w-4xl mx-auto rounded-lg shadow-lg"
              />
            </div>
            
            {/* Motto */}
            <p className="text-xl font-semibold text-gray-700">
              Unggul, Mumpuni, Berkarakter
            </p>
          </div>

          {/* Visi and Misi Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Visi Card */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Visi Sekolah</h2>
              </div>
              
              <div className="text-gray-700 leading-relaxed">
                <p>
                  Terwujudnya lembaga pendidikan dan pelatihan yang Unggul, Mumpuni dan 
                  Berkarakter berdasarkan IMTAQ dan IPTEK, serta peduli dan berbudaya 
                  lingkungan.
                </p>
              </div>
            </div>

            {/* Misi Card */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Misi Sekolah</h2>
              </div>
              
              <div className="text-gray-700 leading-relaxed">
                <ol className="space-y-3">
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full text-sm font-semibold flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">1</span>
                    <span>Menyelenggarakan pendidikan dan pelatihan yang berorientasi pada ilmu pengetahuan dan teknologi (iptek), berlandaskan keimanan dan ketaqwaan (imtaq) serta berwawasan lingkungan hidup.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full text-sm font-semibold flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">2</span>
                    <span>Menghasilkan tamatan yang berkualitas sesuai dengan tuntutan kebutuhan masyarakat dan mampu bersaing dalam pasar kerja serta dapat mengembangkan sikap profesional dalam bidang keahlian.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full text-sm font-semibold flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">3</span>
                    <span>Menyiapkan siswa agar menjadi manusia yang produktif, mampu bekerja mandiri dan mengisi lowongan pekerjaan yang ada sesuai dengan kompetensinya.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full text-sm font-semibold flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">4</span>
                    <span>Lingkungan dan budaya sekolah yang tertib aman dan nyaman.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full text-sm font-semibold flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">5</span>
                    <span>Mencapai keunggulan lingkungan.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full text-sm font-semibold flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">6</span>
                    <span>Santun dalam berkomunikasi.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full text-sm font-semibold flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">7</span>
                    <span>Melestarikan fungsi lingkungan.</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}