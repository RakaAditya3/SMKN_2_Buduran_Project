'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen,
  Clock3,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface ELibraryLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  {
    label: 'Dashboard',
    href: '/Pages/eLibrary/Dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Riwayat Pinjam',
    href: '/Pages/eLibrary/Riwayat-Pinjam',
    icon: Clock3,
  },
];

interface SidebarContentProps {
  collapsed: boolean;
  activePath: string;
  onNavigate?: () => void;
  onExit: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  collapsed,
  activePath,
  onNavigate,
  onExit,
}) => {
  const baseLinkClasses =
    'group flex items-center gap-3 rounded-xl py-3 text-sm font-medium transition-colors';

  return (
    <div className="flex h-full flex-col justify-between gap-6 pb-6">
      <div>
        <div className="flex items-center gap-3 px-4 pt-6">
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-[#1F2A44]/10">
            <Image
              src="/images/LogoSMK.png"
              alt="eLibrary SMKN 2 Buduran"
              fill
              sizes="40px"
              className="object-contain"
            />
          </div>
          <div
            className={`flex flex-col overflow-hidden transition-[max-width,opacity] duration-200 ease-out ${
              collapsed ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ maxWidth: collapsed ? '0px' : '160px' }}
            aria-hidden={collapsed}
          >
            <span className="whitespace-nowrap text-sm font-semibold leading-tight text-slate-800">
              eLibrary SMENDA
            </span>
            <span className="whitespace-nowrap text-xs leading-tight text-slate-500">
              SMKN 2 Buduran
            </span>
          </div>
        </div>
        <nav
          className={`mt-4 flex flex-col gap-1 ${collapsed ? 'px-2' : 'px-4'}`}
        >
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activePath.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`${baseLinkClasses} ${collapsed ? 'justify-center px-2' : 'px-4'} ${
                  isActive
                    ? 'bg-[#1F2A44] text-slate-50 shadow-sm shadow-[#1F2A44]/40'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className={`${collapsed ? 'px-2' : 'px-4'}`}>
        <button
          type="button"
          onClick={onExit}
          className={`flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 transition hover:border-[#1F2A44] hover:bg-slate-50 ${
            collapsed ? 'justify-center px-2' : 'px-4'
          }`}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Keluar</span>}
        </button>
      </div>
    </div>
  );
};

const ELibraryLayout: React.FC<ELibraryLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const activePath = useMemo(() => pathname ?? '', [pathname]);

  const handleExit = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('student_token');
    }
    router.push('/');
  };

  const toggleCollapsed = () => setCollapsed((prev) => !prev);
  const toggleMobile = () => setMobileOpen((prev) => !prev);

  return (
    <div className="flex min-h-screen bg-[#E7ECF5] text-slate-900">
      <aside
        className={`relative hidden border-r border-slate-200 bg-white/95 shadow-xl shadow-slate-900/5 transition-all duration-300 ease-in-out md:flex md:sticky md:top-0 md:h-screen ${
          collapsed ? 'w-[80px]' : 'w-64'
        }`}
      >
        <div className="flex h-full w-full">
          <SidebarContent
            collapsed={collapsed}
            activePath={activePath}
            onExit={handleExit}
          />
        </div>
        <button
          type="button"
          onClick={toggleCollapsed}
          className="absolute -right-3 top-16 hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition-colors hover:bg-slate-100 md:flex"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={toggleMobile}
          />
          <aside className="relative z-50 h-full w-72 bg-white shadow-2xl">
            <button
              type="button"
              onClick={toggleMobile}
              className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
            <SidebarContent
              collapsed={false}
              activePath={activePath}
              onNavigate={toggleMobile}
              onExit={() => {
                toggleMobile();
                handleExit();
              }}
            />
          </aside>
        </div>
      )}

      <div className="flex w-full flex-1 flex-col">
        <header className="sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/70 md:static md:bg-white md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleMobile}
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition-colors hover:bg-slate-100 md:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu size={18} />
            </button>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-700">
                Halo, Siswa SMENDA!
              </span>
              <span className="text-xs text-slate-500">
                Temukan bacaan favorit dan kelola riwayat peminjaman Anda di sini.
              </span>
            </div>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500 shadow-sm">
              <BookOpen size={16} className="text-[#1F2A44]" />
              <span>eLibrary SMKN 2 Buduran</span>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-6xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default ELibraryLayout;
