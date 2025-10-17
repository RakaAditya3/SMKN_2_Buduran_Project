"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Building2,
  Folder,
  BookOpen,
  MessageSquare,
  ScanLine,
  CalendarCheck,
  ChevronDown,
  LogOut,
  University,
  History
} from "lucide-react";
import api from "@/api/api";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const navItems = [
    { href: "/Admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/Admin/students", label: "Student", icon: University },
    { href: "/Admin/news", label: "News", icon: Newspaper },
    { href: "/Admin/companies", label: "Companies", icon: Building2 },
    { href: "/Admin/categories", label: "Categories", icon: Folder },
    { href: "/Admin/ebooks", label: "E-Books", icon: BookOpen },
    { href: "/Admin/record", label: "Records E-Books", icon: History  },
    { href: "/Admin/studentShowcase", label: "Records E-Books", icon: History  },
    { href: "/Admin/complaints", label: "Complaints", icon: MessageSquare },
    { href: "/Admin/rfid", label: "RFID Scanner", icon: ScanLine },
    { href: "/Admin/presensi", label: "Presensi", icon: CalendarCheck },
  ];

 
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/Login");
        return;
      }

      try {
        const res = await api.get("/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const adminData = Array.isArray(res.data.data) ? res.data.data[0] : null;
        setUser(adminData);
      } catch (err) {
        console.error("❌ Gagal memuat data user:", err);
        localStorage.removeItem("token");
        router.replace("/Login");
      }
    };

    fetchUser();
  }, [router]);


  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/Login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-20"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-6">
          <img src="/images/LogoSMK.png" alt="Logo SMKN 2 Buduran" className="h-10" />
        </div>

        {/* Main Menu Label */}
        {isOpen && (
          <div className="px-6 pb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Main Menu
            </p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  <Icon
                    size={20}
                    className={`flex-shrink-0 ${
                      isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  {isOpen && <span className="flex-1">{item.label}</span>}
                  {isOpen && item.label === "Dashboard" && (
                    <ChevronDown size={16} className="text-gray-400" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer User Info */}
        <div className="border-t border-gray-200 p-4">
          {isOpen ? (
            <div className="flex items-center gap-3">
              <img
                src={`https://ui-avatars.com/api/?name=${
                  user?.name || "Unknown"
                }&background=3b82f6&color=fff`}
                alt={user?.name || "User"}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user?.name || "Loading..."}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || "Fetching email..."}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex justify-center text-gray-400 hover:text-red-600 transition-colors"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 overflow-auto">{children}</main>
    </div>
  );
}
