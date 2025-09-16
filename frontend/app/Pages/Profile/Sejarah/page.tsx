import React from "react";
import Navbar from "../../../Components/Navbar"
import Footer from "../../../Components/Footer"

export default function SejarahPerkembangan() {
  const timelineData = [
    {
      year: "1970",
      title: "Pendirian Sekolah",
      description: "Berdiri berdasarkan Surat Keputusan Pendidikan Sekolah nomor 0170/1979 pada tanggal 29 Januari 1979."
    },
    {
      year: "1975",
      title: "Pendirian Sekolah",
      description: "Berdiri berdasarkan Surat Keputusan Pendidikan Sekolah nomor 0170/1979 pada tanggal 29 Januari 1979."
    },
    {
      year: "1980",
      title: "Pendirian Sekolah",
      description: "Berdiri berdasarkan Surat Keputusan Pendidikan Sekolah nomor 0170/1979 pada tanggal 29 Januari 1979."
    },
    {
      year: "1985",
      title: "Pendirian Sekolah",
      description: "Berdiri berdasarkan Surat Keputusan Pendidikan Sekolah nomor 0170/1979 pada tanggal 29 Januari 1979."
    },
    {
      year: "1990",
      title: "Pendirian Sekolah",
      description: "Berdiri berdasarkan Surat Keputusan Pendidikan Sekolah nomor 0170/1979 pada tanggal 29 Januari 1979."
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Sejarah & Perkembangan
            </h1>
            <p className="text-blue-500 font-medium">Perjalanan Kami</p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-blue-300"></div>

            {/* Timeline Items */}
            {timelineData.map((item, index) => (
              <div key={index} className="relative mb-12 last:mb-0">
                {/* Timeline Node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-blue-300 rounded-full z-10"></div>

                {/* Content Card */}
                <div className={`flex ${index % 2 === 0 ? 'justify-start pr-8' : 'justify-end pl-8'}`}>
                  <div className={`w-full max-w-md ${index % 2 === 0 ? 'mr-8' : 'ml-8'}`}>
                    <div className="bg-white rounded-lg shadow-md p-6 relative">
                      {/* Year Badge */}
                      <div className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-3">
                        {item.year}
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-800 mb-2">
                        {item.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}