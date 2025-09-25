import { Metadata } from "next"
import Image from "next/image"
import api from "@/api/api" // pakai axios instance kamu

// ---- API helper
async function getNewsById(id: string) {
  try {
    const res = await api.get(`/news/${id}`)
    return res.data
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null
    }
    console.error("Gagal fetch berita:", error.message)
    return null
  }
}

// ---- SEO Metadata dinamis
export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const news = await getNewsById(params.id)

  if (!news) {
    return {
      title: "Berita Tidak Ditemukan",
      description: "Halaman berita tidak tersedia.",
    }
  }

  return {
    title: `${news.title} | SMKN 2 Buduran`,
    description: news.description,
    openGraph: {
      title: news.title,
      description: news.description,
      images: [
        {
          url: news.thumbnail, // pakai thumbnail dari DB
          width: 1200,
          height: 630,
          alt: news.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: news.title,
      description: news.description,
      images: [news.thumbnail],
    },
  }
}

// ---- Halaman detail berita
export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  const news = await getNewsById(params.id)

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
          src={news.thumbnail}
          alt={news.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Judul & kategori */}
      <div className="mt-6">
        <p className="text-sm text-red-500 font-semibold">{news.category}</p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
          {news.title}
        </h1>
        <p className="text-gray-600 mt-4">{news.description}</p>
      </div>

      {/* Konten */}
      <div className="prose prose-lg mt-8 text-gray-800 leading-relaxed">
        {news.content?.split("\n").map((p: string, i: number) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </article>
  )
}
