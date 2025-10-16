// /lib/resolveImageUrl.ts
export function resolveLocalProxyImage(path?: string | null): string {
  if (!path) return "/images/default-placeholder.jpg"; // fallback jika null

  // ✅ Jika URL sudah lengkap (misalnya http://... atau https://...), tetap pakai proxy
  if (path.startsWith("http")) {
    return `/api/proxy?url=${encodeURIComponent(path)}`;
  }

  // 🔹 Deteksi otomatis berdasarkan folder

  // eBook
  if (path.includes("ebooks") || path.includes("/ebook")) {
    const url = `http://localhost:8000/storage/ebooks/${path.replace(/^\/?storage\/ebooks\/?/, "")}`;
    return `/api/proxy?url=${encodeURIComponent(url)}`;
  }

  // News / Berita
  if (path.includes("news") || path.includes("/berita")) {
    const url = `http://localhost:8000/storage/news/${path.replace(/^\/?storage\/news\/?/, "")}`;
    return `/api/proxy?url=${encodeURIComponent(url)}`;
  }

  // Company / Perusahaan
  if (path.includes("company") || path.includes("/companies")) {
    const url = `http://localhost:8000/storage/company/${path.replace(/^\/?storage\/company\/?/, "")}`;
    return `/api/proxy?url=${encodeURIComponent(url)}`;
  }

  // Student Showcase
  if (path.includes("showcase") || path.includes("student-showcase")) {
    const url = `http://localhost:8000/storage/showcases/${path.replace(/^\/?storage\/showcases\/?/, "")}`;
    return `/api/proxy?url=${encodeURIComponent(url)}`;
  }

  // 🔹 Default fallback (jaga-jaga kalau folder tidak dikenali)
  const defaultUrl = `http://localhost:8000/storage/${path.replace(/^\/?storage\/?/, "")}`;
  return `/api/proxy?url=${encodeURIComponent(defaultUrl)}`;
}
