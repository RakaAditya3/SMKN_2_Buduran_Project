import { Metadata } from "next";
import Image from "next/image";
import { resolveLocalProxyImage } from "@/lib/resolveImageUrl";

/**
 * 🔹 Ambil data berita berdasarkan ID
 * Gunakan fetch() bawaan Next.js agar aman di SSR dan tidak tergantung axios/localStorage
 */
async function getNewsById(id: string) {
  try {
    const res = await fetch(`https://env-laravel.jh-beon.cloud/api/news/${id}`, {
      // ✅ Cache otomatis 5 menit di edge (revalidate)
      next: { revalidate: 300 },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error: any) {
    console.error("❌ Gagal fetch berita:", error.message || error);
    return null;
  }
}

/**
 * 🔹 SEO Metadata Dinamis (Title, Description, OG tags)
 */
export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const news = await getNewsById(params.id);

  if (!news) {
    return {
      title: "Berita Tidak Ditemukan",
      description: "Halaman berita tidak tersedia.",
    };
  }

  return {
    title: `${news.title} | SMKN 2 Buduran`,
    description: news.description,
    openGraph: {
      title: news.title,
      description: news.description,
      images: [
        {
          url: news.thumbnail,
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
  };
}

/**
 * 🔹 Halaman Detail Berita
 */
export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  const news = await getNewsById(params.id);

  if (!news) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">Berita tidak ditemukan</h1>
        <p className="text-gray-600 mt-4">Silakan kembali ke halaman berita.</p>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto py-12 px-4">
      {/* 🖼️ Thumbnail utama */}
      <div className="relative w-full h-80 md:h-96 rounded-lg overflow-hidden shadow">
        <Image
          src={resolveLocalProxyImage(news.thumbnail)}
          alt={news.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* 📰 Judul, kategori, deskripsi */}
      <div className="mt-6">
        {news.category && (
          <p className="text-sm text-red-500 font-semibold">
            {typeof news.category === "string"
              ? news.category
              : news.category?.name || "Tanpa Kategori"}
          </p>
        )}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
          {news.title}
        </h1>
        <p className="text-gray-600 mt-4">{news.description}</p>
      </div>

      {/* 📜 Konten berita */}
      <div className="prose prose-lg mt-8 text-gray-800 leading-relaxed">
        {news.content
          ?.split("\n")
          .filter((p: string) => p.trim() !== "")
          .map((p: string, i: number) => (
            <p key={i}>{p}</p>
          ))}
      </div>
    </article>
  );
}
