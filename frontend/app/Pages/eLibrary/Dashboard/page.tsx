'use client';

import React, { useMemo, useState } from 'react';
import useSWR from 'swr';
import { Search, Sparkles, BookOpenCheck, Clock3 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { fetcher } from '@/lib/fetcher';
import { resolveLocalProxyImage } from "@/lib/resolveImageUrl";

interface EBook {
  id: number;
  title: string;
  description: string;
  image_path?: string | null;
  image_url?: string | null;
}

const EBookDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: ebooksResponse, error, isLoading } = useSWR('/ebooks', fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
    dedupingInterval: 900000,
  });

 const ebooks: EBook[] = Array.isArray(ebooksResponse) ? ebooksResponse : ebooksResponse?.data ?? [];


  const filteredBooks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return ebooks;
    return ebooks.filter((book) => book.title.toLowerCase().includes(query));
  }, [ebooks, searchQuery]);


  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1F2A44] via-[#233459] to-[#3B5C9B] p-8 text-white shadow-xl">
        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-6 right-10 hidden h-24 w-24 rounded-full border border-white/10 md:block" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/80">
              <Sparkles size={14} /> eLibrary SMKN 2 Buduran
            </span>
            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
              Selamat datang kembali, mari jelajahi koleksi terbaik SMENDA.
            </h1>
            <p className="text-sm text-white/70">
              Temukan bacaan terbaru, lanjutkan buku yang belum selesai, atau kelola peminjaman Anda secara cepat lewat dashboard yang serba modern ini.
            </p>
          </div>

          <div className="grid w-full max-w-sm grid-cols-2 gap-3 md:max-w-xs">
            <div className="rounded-2xl bg-white/10 p-4 text-left">
              <div className="text-xs uppercase tracking-wide text-white/60">Total Buku</div>
              <div className="mt-2 flex items-center gap-2 text-2xl font-semibold">
                <BookOpenCheck size={22} />
                <span>{ebooks.length}</span>
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 text-left">
              <div className="text-xs uppercase tracking-wide text-white/60">Terakhir diperbarui</div>
              <div className="mt-2 flex items-center gap-2 text-2xl font-semibold">
                <Clock3 size={22} />
                <span>{new Date().toLocaleDateString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white/90 p-6 shadow-xl shadow-slate-900/5 backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Koleksi Buku</h2>
            <p className="text-sm text-slate-500">Jelajahi dan pinjam buku digital favoritmu.</p>
          </div>
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Cari judul, penulis, atau kategori"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-700 shadow-inner outline-none transition focus:border-[#1F2A44] focus:bg-white focus:shadow-md"
            />
          </div>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-64 rounded-3xl bg-slate-100/80 animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
              Gagal memuat data eBook. Silakan coba beberapa saat lagi.
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center text-slate-500">
              Tidak ada buku yang sesuai dengan pencarian.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredBooks.map((book) => (
                <Link
                  key={book.id}
                  href={`/Pages/eLibrary/${book.id}`}
                  className="group relative flex h-72 flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-white to-slate-50 shadow-lg shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={resolveLocalProxyImage(book.image_path ?? book.image_url ?? null)} // ✅ Pakai proxy
                      alt={book.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-slate-900/0 to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <h3 className="line-clamp-2 text-base font-semibold text-slate-800">
                      {book.title}
                    </h3>
                    <p className="line-clamp-3 text-xs text-slate-500">
                      {book.description || 'Belum ada deskripsi.'}
                    </p>
                    <div className="mt-auto inline-flex items-center gap-2 text-xs font-semibold text-[#1F2A44]">
                      <span>Pinjam sekarang</span>
                      <span className="text-[#3B5C9B]">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EBookDashboard;
