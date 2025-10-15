"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/api/api";
import Image from "next/image";
import { ArrowLeft, MessageCircle, Link2 } from "lucide-react";

interface ShowcaseDetail {
  id: number;
  student_name: string;
  student_class: string;
  student_major: string;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  contact_number: string;
  project_link?: string;
  created_at: string;
}

export default function ShowcaseDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [data, setData] = useState<ShowcaseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      try {
        const res = await api.get(`/showcases/${slug}`);
        setData(res.data.data || res.data);
      } catch (err) {
        console.error("❌ Gagal memuat detail showcase:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        ⏳ Memuat detail karya...
      </div>
    );

  if (!data)
    return (
      <div className="flex flex-col justify-center items-center h-screen text-gray-500">
        <p>😢 Data showcase tidak ditemukan.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Kembali
        </button>
      </div>
    );

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6 md:px-16">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-black mb-6"
      >
        <ArrowLeft size={18} className="mr-2" />
        Kembali
      </button>

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
        {data.image_url && (
          <div className="relative w-full h-80">
            <Image
              src={data.image_url}
              alt={data.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            {data.title}
          </h1>

          <div className="text-gray-500 text-sm mb-6">
            {data.student_name} — {data.student_class} {data.student_major}
          </div>

          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {data.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={`https://wa.me/62${data.contact_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all"
            >
              <MessageCircle size={18} />
              Hubungi via WhatsApp
            </a>

            {data.project_link && (
              <a
                href={data.project_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all"
              >
                <Link2 size={18} />
                Lihat Project
              </a>
            )}
          </div>

          <p className="text-sm text-gray-400 mt-6">
            Dipublikasikan pada:{" "}
            {new Date(data.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </main>
  );
}
