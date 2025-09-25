'use client'

import Image from 'next/image'
import Link from 'next/link'

interface News {
  id: number
  title: string
  category: string
  thumbnail: string
  description: string
}

export default function BeritaUtama({ news }: { news: News }) {
  return (
    <Link
      href={`/Pages/Berita-Kegiatan/${news.id}`}
      className="md:col-span-2 block group"
    >
      <div className="relative h-80 w-full rounded-lg overflow-hidden shadow">
        <Image
          src={news.thumbnail}
          alt={news.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="mt-4">
        <p className="text-sm text-red-500 font-semibold">
          Kategori: {news.category}
        </p>
        <h2 className="text-2xl font-bold mt-2 group-hover:text-blue-600">
          {news.title}
        </h2>
        <p className="text-gray-600 mt-2 line-clamp-3">
          {news.description}
        </p>
      </div>
    </Link>
  )
}
