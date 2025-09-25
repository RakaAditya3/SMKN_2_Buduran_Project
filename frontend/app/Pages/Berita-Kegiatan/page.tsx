'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import api from '@/api/api'
import Navbar from '@/app/Components/Navbar'
import Footer from '@/app/Components/Footer'

interface NewsItem {
  id: number
  title: string
  description: string
  thumbnail: string
  category: string
}

function BeritaSection({
  categoryId,
  title,
  highlightFirst = true,
}: {
  categoryId: number
  title: string
  highlightFirst?: boolean
}) {
  const [news, setNews] = useState<NewsItem[]>([])

  useEffect(() => {
    api
      .get(`/news?category_id=${categoryId}`)
      .then((res) => setNews(res.data.data ?? res.data))
      .catch((err) => console.error('Gagal fetch berita:', err))
  }, [categoryId])

  if (!news || news.length === 0) return null


  const utama = highlightFirst ? news.slice(0, 2) : []
  const lainnya = highlightFirst ? news.slice(2, 6) : news
  const tambahan = highlightFirst ? news.slice(6, 9) : []

  return (
    <section className="w-full bg-white py-12 border-t">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-8">
          {title}
        </h2>

        {!highlightFirst ? (

          <div className="grid md:grid-cols-2 gap-6">
            {lainnya.map((item) => (
              <Link
                key={item.id}
                href={`/Pages/Berita-Kegiatan/${item.id}`}
                className="flex gap-4 group bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition"
              >
                <div className="relative w-28 h-20 flex-shrink-0 rounded-md overflow-hidden">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-blue-600 font-semibold">
                    {item.category}
                  </span>
                  <h4 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-700 transition">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (

         <div className="grid lg:grid-cols-3 gap-8">
            {/* Kiri */}
            <div className="flex flex-col gap-10 lg:col-span-2">
              {utama.map((item) => (
                <Link key={item.id} href={`/Pages/Berita-Kegiatan/${item.id}`} className="block group">
                  <div className="relative h-[400px] w-full rounded-xl overflow-hidden shadow-md">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <span className="inline-block text-xs font-semibold bg-blue-600 px-2 py-1 rounded">
                        {item.category}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-bold leading-snug mt-3 group-hover:text-blue-200 transition">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-3 text-gray-700 text-base leading-relaxed">{item.description}</p>
                </Link>
              ))}
            </div>

              {/* Kanan */}
            <div className="flex flex-col gap-6">
              {lainnya.map((item) => (
                <Link
                  key={item.id}
                  href={`/Pages/Berita-Kegiatan/${item.id}`}
                  className="block group rounded-md hover:bg-gray-50 transition"
                >
                  <div className="relative h-[180px] w-full rounded-md overflow-hidden">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute inset-0 flex items-end p-3 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                      <h4 className="text-white text-sm font-semibold line-clamp-2 group-hover:text-blue-200 transition">
                        {item.title}
                      </h4>
                    </div>
                  </div>
 
                  <p className="mt-2 text-gray-700 text-sm line-clamp-2">{item.description}</p>
                </Link>
              ))}
            </div>

            {/* Bawah */}
            {tambahan.length > 0 && (
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {tambahan.map((item) => (
                  <Link
                    key={item.id}
                    href={`/Pages/Berita-Kegiatan/${item.id}`}
                    className="block group rounded-md hover:bg-gray-50 transition"
                  >
                    <div className="relative h-[300px] w-full rounded-md overflow-hidden">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      <div className="absolute inset-0 flex items-end p-3 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                        <h4 className="text-white text-base font-semibold line-clamp-2 group-hover:text-blue-200 transition">
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    <p className="mt-2 text-gray-700 text-sm line-clamp-2">{item.description}</p>
                  </Link>
                ))}
              </div>
            )}
         </div>
        )}
      </div>
    </section>
  )
}

export default function BeritaPage() {
  return (
    <>
    <Navbar />
    <main className="bg-white mt-30">
      <section className="relative text-center py-16 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
        <div className="absolute top-0 left-1/4 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/3 w-60 h-60 bg-blue-300 rounded-full mix-blend-multiply opacity-15 animate-pulse"></div>

        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-blue-700 drop-shadow-md">
            SELAMAT DATANG DI BERITA
          </h1>
          <p className="mt-6 text-gray-700 text-lg md:text-xl leading-relaxed">
            Berita dan cerita yang membangun <span className="font-semibold text-blue-600">semangat belajar 📚</span>,  
            memperluas <span className="font-semibold text-blue-600">wawasan 🌍</span>,  
            dan menginspirasi <span className="font-semibold text-blue-600">prestasi 🏆</span>.
          </p>
        </div>
      </section>


      {/* Section 1 → kategori 1 */}
      <BeritaSection categoryId={1} title="Berita Terbaru" highlightFirst />

      {/* Section 2 → kategori 3 */}
      <BeritaSection categoryId={3} title="Prestasi Terbaru" highlightFirst />

      {/* Section 3 → kategori 2 */}
      <BeritaSection categoryId={2} title="Kegiatan Sekolah" highlightFirst={false} />
    </main>
    <Footer />
    </>
  )
}
