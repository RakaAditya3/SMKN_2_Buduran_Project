'use client'

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import Link from 'next/link';
import Image from "next/image";

interface EBook {
  data: EBook[];
  id: number;
  title: string;
  description: string;
  image_url: string | null;
}

const EBookDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

 const { data: ebooksResponse, error, isLoading } = useSWR('/ebooks', fetcher, {
  revalidateOnFocus: false,
  revalidateIfStale: false,
  revalidateOnReconnect: false,
  dedupingInterval: 99999999,
});


const ebooks: EBook[] = ebooksResponse?.data || [];
console.log(ebooks)

const filteredBooks = ebooks.filter((book) =>
  book.title.toLowerCase().includes(searchQuery.toLowerCase())
);

function getImageUrl(path: string) {
  if (!path) return "/placeholder.png";
  return path.startsWith("http") ? path : `https://kmzmzmrdwbaaibcgqowh.supabase.co/storage/v1/object/public/${path}`;
}

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        {/* Header dengan search */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-black"
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {isLoading ? (
            <p className="text-gray-500">Loading eLibrary...</p>
          ) : error ? (
            <p className="text-red-500">Gagal memuat data eBook</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredBooks.map((book) => (
                <div key={book.id} className="group cursor-pointer">
                  <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden mb-3 shadow-sm group-hover:shadow-md transition-shadow">
                    {book.image_url ? (
                      <Link href={`/Pages/eLibrary/${book.id}`}>
                        <Image
                          src={getImageUrl(book.image_url)}
                          alt={book.title}
                          width={300}
                          height={400}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </Link>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        No Cover
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-800 text-sm mb-1 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 text-xs">
                    {book.description || "No description"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EBookDashboard;
