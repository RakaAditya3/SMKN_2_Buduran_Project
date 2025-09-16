import React from "react";
import Navbar from "../../../Components/Navbar"
import Footer from "../../../Components/Footer"

export default function SambutanKepalaSekolah() {
  const dataWaka = [
    {
      jabatan: "Waka Kurikulum",
      nama: "Dra. Hj. Mariya Ernawati, M.M.",
      img: "/images/dummyImage.jpg",
    },
    {
      jabatan: "Waka Kesiswaan",
      nama: "Dra. Hj. Mariya Ernawati, M.M.",
      img: "/images/dummyImage.jpg",
    },
    {
      jabatan: "Waka Sarpras",
      nama: "Dra. Hj. Mariya Ernawati, M.M.",
      img: "/images/dummyImage.jpg",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Sambutan Kepala Sekolah */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Dra. Hj. Mariya Ernawati, M.M.
            </h1>

            <div className="flex justify-center mb-8">
              <img
                src="/images/dummyImage.jpg"
                alt="Kepala Sekolah"
                className="w-48 h-48 rounded-full object-cover shadow-lg border-4 border-white"
              />
            </div>

            <div className="max-w-3xl mx-auto text-justify space-y-6 leading-relaxed text-gray-700">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
                accusantium, magni reprehenderit sequi quasi necessitatibus sapiente
                dignissimos delectus praesentium ullam cum maxime omnis aliquam,
                alias soluta? Commodi tempora officia nihil.
              </p>

              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
                accusantium, magni reprehenderit sequi quasi necessitatibus sapiente
                dignissimos delectus praesentium ullam cum maxime omnis aliquam,
                alias soluta? Commodi tempora officia nihil.
              </p>

              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
                accusantium, magni reprehenderit sequi quasi necessitatibus sapiente
                dignissimos delectus praesentium ullam cum maxime omnis aliquam,
                alias soluta? Commodi tempora officia nihil.
              </p>

              <p>
                Lorem ipsum dolor sit amet consectetur adipiscing elit. Expedita
                accusantium, magni reprehenderit sequi quasi necessitatibus sapiente
                dignissimos delectus praesentium ullam cum maxime omnis aliquam,
                alias soluta? Commodi tempora officia nihil.
              </p>
            </div>
          </div>

          {/* Waka Cards */}
          <div className="space-y-6">
            {dataWaka.map((waka, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}>
                  {/* Gambar */}
                  <div className="flex-shrink-0 p-6">
                    <img
                      src={waka.img}
                      alt={waka.jabatan}
                      className="w-48 h-48 rounded-full object-cover shadow-lg border-4 border-white"
                    />
                  </div>

                  {/* Konten */}
                  <div className="flex-1 p-8">
                    <h2 className="text-lg font-semibold text-purple-600 mb-2">
                      {waka.jabatan}
                    </h2>
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">
                      {waka.nama}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
                      accusantium, magni reprehenderit sequi quasi accusamus sapiente
                      dignissimos delectus praesentium ullam cum maxime omnis aliquam,
                      alias soluta? Commodi tempora officia nihil.
                    </p>
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