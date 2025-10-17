'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import api from "@/api/api"
import { resolveLocalProxyImage } from "@/lib/resolveImageUrl"

interface News {
  id: number
  title: string
  description: string
  thumbnail: string
  content: string
  category?: string
}

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  const [news, setNews] = useState<News | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/news/${params.id}`)
      .then((res) => setNews(res.data))
      .catch(() => setNews(null))
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) {
    return <div className="text-center py-20 text-blue-500 animate-pulse">Memuat berita...</div>
  }

  if (!news) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">Berita tidak ditemukan</h1>
        <p className="text-gray-600 mt-4">Silakan kembali ke halaman berita.</p>
      </div>
    )
  }

  return (
    <article className="max-w-4xl mx-auto py-12 px-4">
      {/* Gambar utama */}
      <div className="relative w-full h-80 md:h-96 rounded-lg overflow-hidden shadow">
        <Image
          src={resolveLocalProxyImage(news.thumbnail)}
          alt={news.title}
          fill
          unoptimized
          className="object-cover"
        />
      </div>

      {/* Judul & kategori */}
      <div className="mt-6">
        {news.category && (
          <p className="text-sm text-red-500 font-semibold">{news.category}</p>
        )}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
          {news.title}
        </h1>
        <p className="text-gray-600 mt-4">{news.description}</p>
      </div>

      {/* Konten */}
      <div className="prose prose-lg mt-8 text-gray-800 leading-relaxed">
        {news.content?.split("\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </article>
  )
}
