'use client'

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import * as motion from "motion/react-client"
import { usePathname } from 'next/navigation'; // ⬅️ Tambah ini

interface NavigationItem {
  label: string;
  href: string;
  dropdown?: {
    layout: "profil" | "program" | "berita";
    image?: string;
    images?: string[];
    description?: string;
    items?: {
      image: string;
      description: string;
      href: string;
    }[],
    subMenu?: { label: string; href: string }[];
    subMenus?: { label: string; href: string }[];
  };
}

interface SearchItem {
  title: string;
  href: string;
  category: string;
  description: string;
  tags?: string[];
}

const SEARCH_ITEMS: SearchItem[] = [
  {
    title: 'Sambutan Kepala Sekolah',
    href: '/Pages/Profile/Kepsek',
    category: 'Profil',
    description: 'Pengantar resmi dari pimpinan SMKN 2 Buduran tentang arah kebijakan sekolah.',
    tags: ['profile', 'kepsek'],
  },
  {
    title: 'Sejarah & Perkembangan Sekolah',
    href: '/Pages/Profile/Sejarah',
    category: 'Profil',
    description: 'Kilas balik perjalanan SMKN 2 Buduran hingga menjadi sekolah rujukan.',
    tags: ['sejarah'],
  },
  {
    title: 'Visi dan Misi',
    href: '/Pages/Profile/Visi-Misi',
    category: 'Profil',
    description: 'Nilai dan tujuan utama yang menjadi pedoman kegiatan belajar.',
    tags: ['visi', 'misi'],
  },
  {
    title: 'Program Rekayasa Perangkat Lunak',
    href: '/Pages/Jurusan/RPL',
    category: 'Program Keahlian',
    description: 'Spesialisasi pengembangan aplikasi, sistem informasi, dan praktik industri TI.',
    tags: ['rpl', 'software'],
  },
  {
    title: 'Program Desain Komunikasi Visual',
    href: '/Pages/Jurusan/DKV',
    category: 'Program Keahlian',
    description: 'Fokus pada desain grafis, multimedia, dan komunikasi visual kreatif.',
    tags: ['dkv', 'desain'],
  },
  {
    title: 'Program Bisnis Digital',
    href: '/Pages/Jurusan/BD',
    category: 'Program Keahlian',
    description: 'Pelajari pemasaran digital, e-commerce, dan strategi bisnis modern.',
    tags: ['bisnis'],
  },
  {
    title: 'Ekstrakurikuler Basket',
    href: '/Pages/Extrakurikuler/basket',
    category: 'Ekstrakurikuler',
    description: 'Pembinaan olahraga basket dengan jadwal latihan dan kompetisi rutin.',
    tags: ['ekskul', 'olahraga'],
  },
  {
    title: 'Ekstrakurikuler Robotik',
    href: '/Pages/Extrakurikuler/robotik',
    category: 'Ekstrakurikuler',
    description: 'Komunitas inovasi robotika untuk siswa yang gemar teknologi.',
    tags: ['robotik'],
  },
  {
    title: 'Berita & Kegiatan',
    href: '/Pages/Berita-Kegiatan',
    category: 'Informasi',
    description: 'Update aktivitas terbaru, liputan acara, dan agenda sekolah.',
    tags: ['berita', 'kegiatan'],
  },
  {
    title: 'Portal Alumni & Karier',
    href: '/Pages/Alumni-Karier',
    category: 'Layanan',
    description: 'Fasilitasi jejaring alumni dan informasi peluang karier.',
    tags: ['alumni'],
  },
  {
    title: 'Layanan eComplaint',
    href: '/Pages/eComplaint',
    category: 'Layanan',
    description: 'Saluran resmi untuk menyampaikan keluhan atau masukan.',
    tags: ['complaint'],
  },
  {
    title: 'Presensi Online',
    href: '/Pages/Presensi',
    category: 'Layanan',
    description: 'Akses presensi online untuk siswa dan tenaga pendidik.',
    tags: ['presensi'],
  },
  {
    title: 'Login eLibrary',
    href: '/Login-eLibrary',
    category: 'Layanan',
    description: 'Masuk ke perpustakaan digital untuk membaca koleksi e-book.',
    tags: ['ebook', 'library'],
  },
];

const POPULAR_SEARCHES = ['Visi Misi', 'Program RPL', 'Ekstrakurikuler', 'Alumni', 'Presensi'];

const Header: React.FC = () => {
  const [activeNav, setActiveNav] = useState<string>('Home');
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileItems, setExpandedMobileItems] = useState<string[]>([]);
  const [scrolled, setScrolled] = useState(false);

  const desktopSearchRef = useRef<HTMLDivElement | null>(null);
  const desktopSearchButtonRef = useRef<HTMLButtonElement | null>(null);
  const desktopInputRef = useRef<HTMLInputElement | null>(null);
  const mobileInputRef = useRef<HTMLInputElement | null>(null);

  const pathname = usePathname(); // ⬅️ Deteksi halaman aktif
  const isHome = pathname === "/";

  const filteredResults = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) {
      return SEARCH_ITEMS.slice(0, 6);
    }

    const keywords = normalized.split(/\s+/).filter(Boolean);

    const scored = SEARCH_ITEMS
      .map((item) => {
        const haystack = [
          item.title,
          item.description,
          item.category,
          ...(item.tags ?? []),
        ]
          .join(' ')
          .toLowerCase();

        if (!keywords.every((keyword) => haystack.includes(keyword))) {
          return null;
        }

        const score = keywords.reduce((acc, keyword) => {
          let value = 0;
          if (item.title.toLowerCase().includes(keyword)) value += 2;
          if (item.category.toLowerCase().includes(keyword)) value += 1;
          if ((item.tags ?? []).some((tag) => tag.toLowerCase().includes(keyword))) value += 1;
          if (item.description.toLowerCase().includes(keyword)) value += 0.5;
          return acc + value;
        }, 0);

        return { item, score: score || 0.5 };
      })
      .filter((entry): entry is { item: SearchItem; score: number } => Boolean(entry));

    return scored
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item)
      .slice(0, 8);
  }, [searchQuery]);

  const hasResults = filteredResults.length > 0;
  const resultsTitle = searchQuery.trim() ? 'Hasil pencarian' : 'Rekomendasi untukmu';

  const closeSearchPanels = useCallback(() => {
    setShowSearch(false);
    setShowMobileSearch(false);
    setSearchQuery('');
  }, []);

  const handleResultSelect = () => {
    closeSearchPanels();
    setMobileMenuOpen(false);
  };

  const handlePopularClick = (term: string) => {
    setSearchQuery(term);
    if (showSearch) {
      window.setTimeout(() => desktopInputRef.current?.focus(), 10);
    }
    if (showMobileSearch) {
      window.setTimeout(() => mobileInputRef.current?.focus(), 10);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (showSearch) {
      window.setTimeout(() => desktopInputRef.current?.focus(), 10);
    }
    if (showMobileSearch) {
      window.setTimeout(() => mobileInputRef.current?.focus(), 10);
    }
  };

  const handleDesktopSearchToggle = () => {
    setShowSearch((prev) => {
      const next = !prev;
      setSearchQuery('');
      if (next) {
        setShowMobileSearch(false);
      }
      return next;
    });
  };

  const handleMobileSearchOpen = () => {
    setShowSearch(false);
    setMobileMenuOpen(false);
    setSearchQuery('');
    setShowMobileSearch((prev) => !prev);
  };
  useEffect(() => {
    closeSearchPanels();
  }, [pathname, closeSearchPanels]);

  useEffect(() => {
    if (!showSearch) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        desktopSearchRef.current?.contains(target) ||
        desktopSearchButtonRef.current?.contains(target)
      ) {
        return;
      }
      closeSearchPanels();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSearch, closeSearchPanels]);

  useEffect(() => {
    if (!showSearch) return;
    const timeout = window.setTimeout(() => desktopInputRef.current?.focus(), 50);
    return () => window.clearTimeout(timeout);
  }, [showSearch]);

  useEffect(() => {
    if (!showMobileSearch) return;
    const timeout = window.setTimeout(() => mobileInputRef.current?.focus(), 50);
    return () => window.clearTimeout(timeout);
  }, [showMobileSearch]);

  useEffect(() => {
    const original = typeof document !== 'undefined' ? document.body.style.overflow : '';
    if (showMobileSearch && typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = original;
      }
    };
  }, [showMobileSearch]);

  useEffect(() => {
    if (!showSearch && !showMobileSearch) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSearchPanels();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearch, showMobileSearch, closeSearchPanels]);

  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      const heroHeight = 800; 
      if (window.scrollY > heroHeight - 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const navigationItems: NavigationItem[] = [
    { label: 'Home', href: '/' },
    { 
      label: 'Profil Sekolah', 
      href: '/',
      dropdown: {
        layout: "profil",
        image: "/images/dummyImage.jpg",
        description: "SMK 2 Buduran telah menjadi rujukan pendidikan menengah atas terkemuka di Jawa Timur. Kami menggabungkan kurikulum nasional dengan standar internasional untuk menghasilkan lulusan yang kompeten dan berkarakter.",
        subMenu: [
          { label: 'Sambutan Kepala Sekolah', href: '/Pages/Profile/Kepsek' },
          { label: 'Sambutan Ketua Komite', href: '/Pages/Profile/Komite' },
          { label: 'Sejarah dan Perkembangan', href: '/Pages/Profile/Sejarah' },
          { label: 'Visi Misi', href: '/Pages/Profile/Visi-Misi' },
        ],
      }
    },
    { 
      label: 'Program', 
      href: '/Pages/Extrakurikuler',
      dropdown: {
        layout: "program",
        image: "/images/dummyImage.jpg",
        description: "Pusat inovasi dan teknologi yang mengintegrasikan pembelajaran praktis dengan industri.",
        subMenu: [
          { label: 'Rekasaya Perangkat Lunak', href: '/Pages/Jurusan/RPL' },
          { label: 'Desain Komunikasi Visual', href: '/Pages/Jurusan/DKV' },
          { label: 'Layanan PerBankan', href: '/Pages/Jurusan/LPB' },
          { label: 'Akutansi', href: '/Pages/Jurusan/AK' },
          { label: 'Manajemen Perkantoran Layanan Bisnis', href: '/Pages/Jurusan/MP' },
          { label: 'Bisnis Digital', href: '/Pages/Jurusan/BD' },
        ],
        subMenus: [
          { label: 'Pencak Organisasi', href: '/Pages/Extrakurikuler/pencak' },
          { label: 'Basket', href: '/Pages/Extrakurikuler/basket' },
          { label: 'Pramuka', href: '/Pages/Extrakurikuler/pramuka' },
          { label: 'Paskibra', href: '/Pages/Extrakurikuler/paskibra' },
          { label: 'Futsal', href: '/Pages/Extrakurikuler/futsal' },
          { label: 'Cheer Leader', href: '/Pages/Extrakurikuler/cheerleader' },
          { label: 'Badminton', href: '/Pages/Extrakurikuler/badminton' },
          { label: 'Dance Club', href: '/Pages/Extrakurikuler/dance' },
          { label: 'Banjari', href: '/Pages/Extrakurikuler/banjari' },
          { label: 'Paduan Suara', href: '/Pages/Extrakurikuler/paduan' },
          { label: 'English Club', href: '/Pages/Extrakurikuler/english' },
          { label: 'Robotik', href: '/Pages/Extrakurikuler/robotik' },
        ],
      }
    },
    {
      label: "Berita & Kegiatan",
      href: "/Pages/Berita-Kegiatan",
    },
    { label: 'Alumni & Karier', href: '/Pages/Alumni-Karier' },
    { label: 'eComplaint', href: '/Pages/eComplaint' },
    { label: 'Presensi Online', href: '/Pages/Presensi' },
  ];

  const currentItem = navigationItems.find((item) => item.label === hoveredMenu);

  const toggleMobileSubmenu = (label: string) => {
    setExpandedMobileItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };


  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isHome
          ? scrolled
            ? "bg-white shadow-sm"
            : "bg-transparent"
          : "bg-white shadow-sm"
      }`}>
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-30">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src='/images/LogoSMK.png'
              alt="Logo SMKN 2 Buduran" 
              className="w-40 object-contain"
            />
          </div>

          {/* Mobile actions */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={handleMobileSearchOpen}
              aria-label="Buka pencarian"
              className="p-2 transition-colors hover:text-[#0E74BC]"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke={
                  showMobileSearch
                    ? '#0E74BC'
                    : !scrolled && isHome
                      ? 'white'
                      : '#0F172A'
                }
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Tutup menu utama' : 'Buka menu utama'}
              className="p-2 hover:text-blue-600 transition-colors"
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={!scrolled && isHome ? "white" : "black"}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Wrapper nav + dropdown - Desktop */}
          <div 
            className="hidden md:flex items-center relative"
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <nav className="flex items-center space-x-8">
              {navigationItems.map((item) => (
                <div 
                  key={item.label} 
                  className="relative"
                  onMouseEnter={() => setHoveredMenu(item.label)}
                >
                  <Link
                    href={item.href}
                    className={`relative px-3 py-2 text-sm font-bold transition-colors duration-300 
                      ${isHome && !scrolled ? "text-white hover:text-[#0E74BC]" : "text-gray-700 hover:text-[#0E74BC]"}
                      before:absolute before:bottom-0 before:left-1/2 before:h-[3px] before:w-0 
                      before:bg-[#0E74BC] before:transition-all before:duration-300 before:transform before:-translate-x-1/2 
                      hover:before:w-full`}
                    onClick={() => setActiveNav(item.label)}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </nav>

            {/* Dropdown */}
            {hoveredMenu && currentItem?.dropdown && (
              
<div className="absolute left-[-170px] top-full w-[1200px] z-50">
  {/* Bridge untuk hilangkan gap hover */}
  <div className="absolute -top-2 left-0 w-full h-3 bg-transparent"></div>

  <div className="mt-3 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
    <div className="max-w-7xl mx-auto p-6">
      {/* LAYOUT PROFIL */}
      {currentItem.dropdown.layout === "profil" && (
        <div className="grid grid-cols-3 gap-6">
          {/* Kolom kiri: Gambar */}
          <div className="flex justify-center">
            <img
              src={currentItem.dropdown.image!}
              alt={currentItem.label}
              className="w-80 rounded-md shadow-md object-cover"
            />
          </div>

          {/* Kolom tengah: Deskripsi */}
          <div className="flex flex-col justify-center border-l border-r border-gray-300 px-6">
            <p className="text-gray-700 mb-4 leading-relaxed text-sm">
              {currentItem.dropdown.description}
            </p>
            <Link
              href={currentItem.href}
              className="inline-block bg-[#0E74BC] text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
            >
              Lihat Selengkapnya
            </Link>
          </div>

          {/* Kolom kanan: Submenu */}
          <div className="flex flex-col justify-center space-y-3 px-2">
            {currentItem.dropdown.subMenu?.map((sub) => (
              <Link
                key={sub.label}
                href={sub.href}
                className="relative px-3 py-2 text-sm font-bold text-gray-700 transition-colors duration-300
             hover:text-[#0E74BC]
             before:absolute before:bottom-0 before:left-1/2 before:h-[3px] before:w-0 
             before:bg-[#0E74BC] before:transition-all before:duration-300 before:transform before:-translate-x-1/2 
             hover:before:w-full"
              >
                <span className="mr-2 text-gray-500">›</span>
                {sub.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* LAYOUT PROGRAM */}
      {currentItem.dropdown.layout === "program" && (
<div className="grid grid-cols-3 gap-6">
  {/* Kolom kiri: subMenu */}
  <div className="flex flex-col justify-center space-y-3 px-2">
    {currentItem.dropdown.subMenu?.map((sub) => (
      <Link
        key={sub.label}
        href={sub.href}
        className="relative px-3 py-2 text-sm font-bold text-gray-700 transition-colors duration-300
             hover:text-[#0E74BC]
             before:absolute before:bottom-0 before:left-1/2 before:h-[3px] before:w-0 
             before:bg-[#0E74BC] before:transition-all before:duration-300 before:transform before:-translate-x-1/2 
             hover:before:w-full"
      >
        <span className="mr-2 text-gray-500">›</span>
        {sub.label}
      </Link>
    ))}
  </div>

  {/* Kolom tengah: subMenus */}
  <div className="columns-2 space-y-2 px-2 border-l border-r border-gray-300">
  {currentItem.dropdown.subMenus?.map((sub) => (
    <Link
      key={sub.label}
      href={sub.href}
      className="block break-inside-avoid relative px-3 py-2 text-sm font-bold text-gray-700 transition-colors duration-300
             hover:text-[#0E74BC]
             before:absolute before:bottom-0 before:left-1/2 before:h-[3px] before:w-0 
             before:bg-[#0E74BC] before:transition-all before:duration-300 before:transform before:-translate-x-1/2 
             hover:before:w-full"
    >
      <span className="mr-2 text-gray-500">›</span>
      {sub.label}
    </Link>
  ))}
</div>

  {/* Kolom kanan: gambar */}
<div className="flex flex-col justify-center items-center">
  <img
    src={currentItem.dropdown.image!}
    alt={currentItem.label}
    className="w-full h-40 rounded-md shadow-md object-cover"
  />
  <p className="text-gray-700 text-sm mt-3">{currentItem.dropdown.description}</p>
</div>
</div>


      )}

      {/* LAYOUT BERITA */}
      {currentItem.dropdown.layout === "berita" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentItem.dropdown.items?.map((news, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center space-y-3"
            >
              <img
                src={news.image}
                alt={`Berita ${idx + 1}`}
                className="w-full h-40 object-cover rounded-md shadow-md"
              />
              <p className="text-gray-700 text-sm">{news.description}</p>
              <Link
                href={news.href}
                className="inline-block bg-[#0E74BC] text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Lihat Selengkapnya
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</div>

            )}
          </div>
            {/* Search Icon - Desktop only */}
            <div className="hidden md:block relative">
              <button
                ref={desktopSearchButtonRef}
                onClick={handleDesktopSearchToggle}
                aria-label={showSearch ? 'Tutup pencarian' : 'Buka pencarian'}
                className="p-2 transition-colors hover:text-[#0E74BC]"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke={
                    showSearch
                      ? '#0E74BC'
                      : !scrolled && isHome
                        ? 'white'
                        : '#0F172A'
                  }
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {showSearch && (
                <div
                  ref={desktopSearchRef}
                  className="absolute right-0 mt-5 w-[24rem] rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_18px_48px_-28px_rgba(14,116,188,0.35)] z-50"
                >
                  <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 transition-colors focus-within:border-[#0E74BC]">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="#0F172A" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      ref={desktopInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Cari informasi di SMKN 2 Buduran"
                      className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-gray-400 focus:outline-none"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        aria-label="Bersihkan pencarian"
                        className="rounded-full p-1 text-gray-400 transition-colors hover:text-slate-600"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="mt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">Pencarian populer</p>
                    <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                      {POPULAR_SEARCHES.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => handlePopularClick(term)}
                          className="whitespace-nowrap rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-[#0E74BC] hover:text-[#0E74BC]"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">{resultsTitle}</p>
                    <div className="mt-2 max-h-60 overflow-y-auto pr-1 search-scroll">
                      {hasResults ? (
                        <ul className="space-y-1.5">
                          {filteredResults.map((item) => (
                            <li key={item.title}>
                              <Link
                                href={item.href}
                                onClick={handleResultSelect}
                                className="block rounded-xl px-3 py-2 transition-colors hover:bg-[#0E74BC]/10"
                              >
                                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                                <p className="mt-1 text-xs text-slate-600 line-clamp-2">{item.description}</p>
                                <span className="mt-1 block text-xs font-medium text-[#0E74BC]">{item.category}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-3 py-6 text-center text-sm text-gray-500">
                          Tidak ditemukan hasil untuk <span className="font-semibold text-slate-700">"{searchQuery}"</span>.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
        </div>
      </div>
      
      {showMobileSearch && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-white">
          <div className="flex items-center justify-between px-4 pt-6 pb-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Pencarian</p>
            <button
              type="button"
              onClick={closeSearchPanels}
              aria-label="Tutup pencarian"
              className="rounded-full p-2 text-gray-400 transition-colors hover:text-slate-700"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-4 pb-4">
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 transition-colors focus-within:border-[#0E74BC]">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="#0F172A" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={mobileInputRef}
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari informasi di SMKN 2 Buduran"
                className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-gray-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Bersihkan pencarian"
                  className="rounded-full p-1 text-gray-400 transition-colors hover:text-slate-600"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-8 search-scroll">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">Pencarian populer</p>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handlePopularClick(term)}
                    className="whitespace-nowrap rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-[#0E74BC] hover:text-[#0E74BC]"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">{resultsTitle}</p>
              <div className="mt-3 space-y-1.5">
                {hasResults ? (
                  filteredResults.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      onClick={handleResultSelect}
                      className="block rounded-xl bg-white px-4 py-3 transition-colors hover:bg-[#0E74BC]/10"
                    >
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-1 text-xs text-slate-600 line-clamp-2">{item.description}</p>
                      <span className="mt-1 block text-xs font-medium text-[#0E74BC]">{item.category}</span>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                    Tidak ditemukan hasil untuk <span className="font-semibold text-slate-700">"{searchQuery}"</span>.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/30 bg-opacity-50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Side menu */}
          <div className="fixed top-0 right-0 h-full w-3/4 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex justify-between items-center pl-2 pt-4 pr-4 border-b border-gray-200">
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-2 pb-3 space-y-1 sm:px-3">
              {/* Home */}
              <Link
                href="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#0E74BC] hover:bg-gray-50 rounded-md"
                onClick={() => {
                  setActiveNav('Home');
                  setMobileMenuOpen(false);
                }}
              >
                Home
              </Link>
              
              {/* Profil Sekolah dengan submenu */}
              <div>
                <div 
                  className="flex justify-between items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-[#0E74BC] hover:bg-gray-50 rounded-md cursor-pointer"
                  onClick={() => toggleMobileSubmenu('Profil Sekolah')}
                >
                  <span>Profil Sekolah</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${expandedMobileItems.includes('Profil Sekolah') ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {expandedMobileItems.includes('Profil Sekolah') && (
                  <div className="pl-6 space-y-1 mt-1">
                    {navigationItems.find(item => item.label === 'Profil Sekolah')?.dropdown?.subMenu?.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#0E74BC] hover:bg-gray-50 rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="mr-2 text-gray-500">›</span>
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Program */}
              <Link
                href="/Pages/Extrakurikuler"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#0E74BC] hover:bg-gray-50 rounded-md"
                onClick={() => {
                  setActiveNav('Program');
                  setMobileMenuOpen(false);
                }}
              >
                Program
              </Link>
              
              {/* Berita & Kegiatan */}
              <Link
                href="/Pages/Berita-Kegiatan"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#0E74BC] hover:bg-gray-50 rounded-md"
                onClick={() => {
                  setActiveNav('Berita & Kegiatan');
                  setMobileMenuOpen(false);
                }}
              >
                Berita & Kegiatan
              </Link>
              
              {/* Alumni & Karier */}
              <Link
                href="/Pages/Alumni-Karier"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#0E74BC] hover:bg-gray-50 rounded-md"
                onClick={() => {
                  setActiveNav('Alumni & Karier');
                  setMobileMenuOpen(false);
                }}
              >
                Alumni & Karier
              </Link>
              
              {/* eComplaint */}
              <Link
                href="/Pages/eComplaint"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#0E74BC] hover:bg-gray-50 rounded-md"
                onClick={() => {
                  setActiveNav('eComplaint');
                  setMobileMenuOpen(false);
                }}
              >
                eComplaint
              </Link>
              
              {/* Presensi Online */}
              <Link
                href="/Pages/Presensi"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#0E74BC] hover:bg-gray-50 rounded-md"
                onClick={() => {
                  setActiveNav('Presensi Online');
                  setMobileMenuOpen(false);
                }}
              >
                Presensi Online
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;