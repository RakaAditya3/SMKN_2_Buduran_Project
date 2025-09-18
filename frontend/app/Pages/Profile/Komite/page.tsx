import React from 'react'
import Navbar from '../../../Components/Navbar'
import Footer from '../../../Components/Footer'

export default function SambutanKomite() {
  return (
    <>
    <Navbar />
    <div className="font-sans text-gray-800 bg-white p-8">
      {/* Judul */}
      <h1 className="text-2xl font-bold text-center mb-8">
      Sambutan Ketua Komite Sekolah
      </h1>


      {/* Konten */}
      <div className="flex flex-col items-center">
      {/* Gambar */}
      <img
      src="/images/dummyImage.jpg"
      alt="Ketua Komite"
      className="rounded-md mb-6 w-170 h-75"
      />


      {/* Teks */}
      <div className="max-w-2xl text-justify space-y-4">
      <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Expedita
      accusantium, magni reprehenderit sequi quasi accusamus sapiente
      dignissimos delectus praesentium ullam cum maxime omnis aliquam,
      alias soluta? Commodi tempora officia nihil.
      </p>


      <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Expedita
      accusantium, magni reprehenderit sequi quasi accusamus sapiente
      dignissimos delectus praesentium ullam cum maxime omnis aliquam,
      alias soluta? Commodi tempora officia nihil.
      </p>


      <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Expedita
      accusantium, magni reprehenderit sequi quasi accusamus sapiente
      dignissimos delectus praesentium ullam cum maxime omnis aliquam,
      alias soluta? Commodi tempora officia nihil.
      </p>


      <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Expedita
      accusantium, magni reprehenderit sequi quasi accusamus sapiente
      dignissimos delectus praesentium ullam cum maxime omnis aliquam,
      alias soluta? Commodi tempora officia nihil.
      </p>
      </div>
      </div>
    </div>
    <Footer />
    </>
  );
}