'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import * as motion from "motion/react-client"
import { usePathname } from "next/navigation";

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

const Header: React.FC = () => {
  const [activeNav, setActiveNav] = useState<string>('Home');
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const isHome = pathname === "/";

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
      dropdown: {
        layout: "berita",
        items: [
          { image: "/images/dummyImage.jpg", description: "Kegiatan upacara bendera rutin setiap Senin.", href: "/Pages/Berita-Kegiatan" },
          { image: "/images/dummyImage.jpg", description: "Prestasi siswa dalam lomba tingkat nasional.", href: "/Pages/Berita-Kegiatan" },
          { image: "/images/dummyImage.jpg", description: "Kegiatan ekstrakurikuler pramuka di sekolah.", href: "/Pages/Berita-Kegiatan" },
          { image: "/images/dummyImage.jpg", description: "Program magang industri siswa kelas XII selama 6 Bulan.", href: "/Pages/Berita-Kegiatan" }
        ]
      }
    },
    { label: 'Alumni & Karier', href: '/Pages/Alumni-Karier' },
    { label: 'eComplaint', href: '/Pages/eComplaint' },
    { label: 'Presensi Online', href: '/Pages/Presensi' },
  ];

  const currentItem = navigationItems.find((item) => item.label === hoveredMenu);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isHome
          ? scrolled
            ? "bg-white shadow-sm border-b border-gray-200"
            : "bg-transparent"
          : "bg-white shadow-sm border-b border-gray-200"
      }`}
    >
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

          {/* Wrapper nav + dropdown */}
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

            {/* Dropdown (tetap utuh) */}
            {hoveredMenu && currentItem?.dropdown && (
              <div className="absolute left-[-170px] top-full w-[1200px] z-50">
                <div className="absolute -top-2 left-0 w-full h-3 bg-transparent"></div>
                <div className="mt-3 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                  <div className="max-w-7xl mx-auto p-6">
                    {/* Layout Profil */}
                    {currentItem.dropdown.layout === "profil" && (
                      <div className="grid grid-cols-3 gap-6">
                        <div className="flex justify-center">
                          <img src={currentItem.dropdown.image!} alt={currentItem.label} className="w-80 rounded-md shadow-md object-cover"/>
                        </div>
                        <div className="flex flex-col justify-center border-l border-r border-gray-300 px-6">
                          <p className="text-gray-700 mb-4 leading-relaxed text-sm">{currentItem.dropdown.description}</p>
                          <Link href="#selengkapnya" className="inline-block bg-[#0E74BC] text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors">Lihat Selengkapnya</Link>
                        </div>
                        <div className="flex flex-col justify-center space-y-3 px-2">
                          {currentItem.dropdown.subMenu?.map((sub) => (
                            <Link key={sub.label} href={sub.href} className="relative px-3 py-2 text-sm font-bold text-gray-700 hover:text-[#0E74BC]">
                              <span className="mr-2 text-gray-500">›</span>{sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Layout Program */}
                    {currentItem.dropdown.layout === "program" && (
                      <div className="grid grid-cols-3 gap-6">
                        <div className="flex flex-col justify-center space-y-3 px-2">
                          {currentItem.dropdown.subMenu?.map((sub) => (
                            <Link key={sub.label} href={sub.href} className="relative px-3 py-2 text-sm font-bold text-gray-700 hover:text-[#0E74BC]">
                              <span className="mr-2 text-gray-500">›</span>{sub.label}
                            </Link>
                          ))}
                        </div>
                        <div className="columns-2 space-y-2 px-2 border-l border-r border-gray-300">
                          {currentItem.dropdown.subMenus?.map((sub) => (
                            <Link key={sub.label} href={sub.href} className="block break-inside-avoid px-3 py-2 text-sm font-bold text-gray-700 hover:text-[#0E74BC]">
                              <span className="mr-2 text-gray-500">›</span>{sub.label}
                            </Link>
                          ))}
                        </div>
                        <div className="flex flex-col justify-center items-center">
                          <img src={currentItem.dropdown.image!} alt={currentItem.label} className="w-full h-40 rounded-md shadow-md object-cover"/>
                          <p className="text-gray-700 text-sm mt-3">{currentItem.dropdown.description}</p>
                        </div>
                      </div>
                    )}

                    {/* Layout Berita */}
                    {currentItem.dropdown.layout === "berita" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {currentItem.dropdown.items?.map((news, idx) => (
                          <div key={idx} className="flex flex-col items-center text-center space-y-3">
                            <img src={news.image} alt={`Berita ${idx + 1}`} className="w-full h-40 object-cover rounded-md shadow-md"/>
                            <p className="text-gray-700 text-sm">{news.description}</p>
                            <Link href={news.href} className="inline-block bg-[#0E74BC] text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors">Lihat Selengkapnya</Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <button onClick={() => setShowSearch((prev) => !prev)} className={`${isHome && !scrolled ? "text-white hover:text-[#0E74BC]" : "text-gray-600 hover:text-blue-600"} p-2 transition-colors`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            {showSearch && (
              <div className="absolute right-0 mt-12 w-150 h-15 bg-white border border-gray-200 rounded-full p-2 z-50 shadow-md">
                <div className="flex items-center space-x-2 mt-2">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input type="text" placeholder="Search" autoFocus className="w-full bg-transparent focus:outline-none text-gray-700 text-xl ml-5"/>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
