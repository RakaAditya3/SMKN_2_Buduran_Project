'use client'

import { Book, History, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiExit } from "react-icons/bi";
import { useRouter } from "next/navigation";

export default function ELibraryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
   const router = useRouter();

  const menu = [
    { href: "/Pages/eLibrary/Dashboard", label: "Daftar Buku", icon: <Book size={20} /> },
    { href: "/Pages/eLibrary/Riwayat-Pinjam", label: "Riwayat Pinjam", icon: <History size={20} /> },
  ];

  const handleExit = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("token");
    
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <img src="/favicon.ico" alt="" className="w-10 h-10" />
            <span className="text-xl font-semibold text-gray-800">eLibrary</span>
          </div>

          <nav className="space-y-2">
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}

            <Link
              href="/"
              onClick={handleExit}
              className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <BiExit size={20} />
              <span>Exit</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
