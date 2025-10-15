"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export interface Showcase {
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
}

export default function ShowcaseCard({ showcase }: { showcase: Showcase }) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/Pages/Student-Showcase/${showcase.slug}`);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      className="cursor-pointer bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 h-full flex flex-col group"
      whileHover={{ scale: 1.02 }}
    >
      {/* Gambar */}
      {showcase.image_url ? (
        <div className="relative w-full h-48">
          <Image
            src={showcase.image_url}
            alt={showcase.title}
            fill
            className="object-cover group-hover:brightness-90 transition-all duration-300"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
          Tidak ada gambar
        </div>
      )}

      {/* Konten */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-all">
            {showcase.title}
          </h3>
          <p className="text-sm text-gray-500">
            {showcase.student_name} — {showcase.student_class}{" "}
            {showcase.student_major}
          </p>

          <p className="mt-2 text-gray-600 text-sm line-clamp-3">
            {showcase.description}
          </p>
        </div>

        {/* Tombol bawah */}
        <div className="mt-4 flex justify-between items-center text-sm">
          {showcase.project_link ? (
            <span className="text-blue-600 hover:underline">
              🔗 Lihat Project
            </span>
          ) : (
            <span className="text-gray-400">Tanpa link</span>
          )}

          {/* Tombol WhatsApp */}
          <a
            href={`https://wa.me/62${showcase.contact_number}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-green-600 hover:underline"
          >
            <MessageCircle size={16} />
            Hubungi
          </a>
        </div>
      </div>
    </motion.div>
  );
}
