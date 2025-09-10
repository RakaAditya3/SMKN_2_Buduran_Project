'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../images/LogoSMK.png';

interface NavigationItem {
  label: string;
  href: string;
  active?: boolean;
}

const Header: React.FC = () => {
  const [activeNav, setActiveNav] = useState<string>('Home');
  
  const navigationItems: NavigationItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Profil Sekolah', href: '/' },
    { label: 'Program', href: '/' },
    { label: 'Berita & Kegiatan', href: '/' },
    { label: 'Alumni & Karier', href: '/' },
    { label: 'eComplaint', href: '/' },
    { label: 'Absensi Online', href: '/' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-30">
          {/* Logo and School Info */}
          <div className="flex items-center space-x-3">
            <div className="relative w-60 h-12">
              <img 
                src={Logo.src} 
                alt="Logo SMKN 2 Buduran Sidoarjo" 
                className="w-60 h-12 object-contain"
              />
            </div>
           
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`px-3 py-2 text-sm font-bold transition-colors duration-200 ${
                  activeNav === item.label
                    ? 'text-[#0E74BC] border-b-2 border-[#0E74BC]'
                    : 'text-gray-700 hover:text-[#0E74BC]'
                }`}
                onClick={() => setActiveNav(item.label)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Search Icon */}
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 text-gray-600 hover:text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};




export default Header;