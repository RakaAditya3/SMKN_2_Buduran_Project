"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Eye, Edit, User, Calendar, Grid } from "lucide-react";
import api from "@/api/api";

export default function AdminDashboard() {
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({
    totalArticles: 0,
    totalCompanies: 0,
    totalEbooks: 0,
    totalAdmins: 0,
  });

  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

 useEffect(() => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!token) {
    router.replace("/Login");
    return;
  }

  const fetchData = async () => {
    try {
      const [newsRes, companiesRes, ebooksRes, usersRes, categoriesRes] = await Promise.all([
        api.get("/admin/news"),
        api.get("/admin/companies"),
        api.get("/admin/ebooks"),
        api.get("/admin/users"),
        api.get("/admin/categories"),
      ]);

      setSummary({
        totalArticles: newsRes.data.length || 0,
        totalCompanies: companiesRes.data.length || 0,
        totalEbooks: ebooksRes.data.length || 0,
        totalAdmins: usersRes.data.length || 0,
      });
    } catch (err: any) {
      console.error("❌ Fetch error:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("admin_token");
        router.replace("/Login");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [router]);


  // Loading UI
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          Admin Dashboard
        </h1>
        <button
          onClick={() => router.push("/Admin/news")}
          className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
        >
          <span className="text-xl">+</span>
          <span className="font-medium">Create Artikel</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Artikel"
          value={summary.totalArticles}
          description="Jumlah seluruh artikel"
          icon={<FileText className="w-5 h-5 text-gray-400" />}
        />
        <StatCard
          title="Companies"
          value={summary.totalCompanies}
          description="Jumlah perusahaan terdaftar"
          icon={<Eye className="w-5 h-5 text-gray-400" />}
        />
        <StatCard
          title="E-Books"
          value={summary.totalEbooks}
          description="Jumlah eBook di database"
          icon={<Edit className="w-5 h-5 text-gray-400" />}
        />
        <StatCard
          title="Admin"
          value={summary.totalAdmins}
          description="Jumlah admin terdaftar"
          icon={<User className="w-5 h-5 text-gray-400" />}
        />
      </div>

      {/* Artikel Terbaru & Kategori */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Artikel Terbaru */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-800">Artikel Terbaru</h2>
          </div>

          {recentArticles.length === 0 ? (
            <p className="text-gray-500 text-center py-6">Belum ada artikel.</p>
          ) : (
            recentArticles.map((article, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={article.thumbnail || "https://via.placeholder.com/60"}
                  alt={article.title}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {article.title || "Judul Artikel"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {article.description?.slice(0, 60) || "Tanpa deskripsi"}...
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(article.created_at).toLocaleDateString("id-ID")}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Kategori Artikel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Grid className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-800">Kategori Artikel</h2>
          </div>
          {categories.length === 0 ? (
            <p className="text-gray-500 text-center py-6">Tidak ada kategori.</p>
          ) : (
            categories.map((category, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <span className="text-gray-700 font-medium">{category.name}</span>
                <span className="text-2xl font-bold text-gray-900">
                  {category.news_count || "-"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionButton
            icon={<FileText className="w-8 h-8 text-gray-400 mb-3" />}
            label="Create New Artikel"
            onClick={() => router.push("/Admin/news")}
          />
          <ActionButton
            icon={<Edit className="w-8 h-8 text-gray-400 mb-3" />}
            label="View Presensi"
            onClick={() => router.push("/Admin/presensi")}
          />
          <ActionButton
            icon={<User className="w-8 h-8 text-gray-400 mb-3" />}
            label="View eComplaint"
            onClick={() => router.push("/Admin/complaints")}
          />
        </div>
      </div>
    </div>
  );
}

/* ====== COMPONENTS ====== */
function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 font-medium">{title}</h3>
        {icon}
      </div>
      <p className="text-4xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-2">{description}</p>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition"
    >
      {icon}
      <span className="font-medium text-gray-700">{label}</span>
    </button>
  );
}
