// /lib/resolveImageUrl.ts
export function resolveLocalProxyImage(path?: string | null): string {
  if (!path) return "/images/default-placeholder.jpg"; // fallback jika null

  // ✅ Base URL backend Laravel (ubah sesuai domain kamu di JagoanCloud)
  const BASE_URL = "https://env-laravel.jh-beon.cloud";

  // ✅ Jika URL sudah lengkap (misalnya http://... atau https://...), tetap pakai proxy
  if (path.startsWith("http")) {
    return `/api/proxy?url=${encodeURIComponent(path)}`;
  }

  // 🔹 Deteksi otomatis berdasarkan folder

  // eBook
  if (path.includes("ebooks") || path.includes("/ebook")) {
    const url = `${BASE_URL}/storage/ebooks/${path.replace(/^\/?storage\/ebooks\/?/, "")}`;
    return `/api/proxy?url=${encodeURIComponent(url)}`;
  }

  // News / Berita
  if (path.includes("news") || path.includes("/berita")) {
    const url = `${BASE_URL}/storage/news/${path.replace(/^\/?storage\/news\/?/, "")}`;
    return `/api/proxy?url=${encodeURIComponent(url)}`;
  }

  // Company / Perusahaan
  if (path.includes("company") || path.includes("/companies")) {
    const url = `${BASE_URL}/storage/company/${path.replace(/^\/?storage\/company\/?/, "")}`;
    return `/api/proxy?url=${encodeURIComponent(url)}`;
  }

  // Student Showcase
  if (path.includes("showcase") || path.includes("student-showcase")) {
    const url = `${BASE_URL}/storage/showcases/${path.replace(/^\/?storage\/showcases\/?/, "")}`;
    return `/api/proxy?url=${encodeURIComponent(url)}`;
  }

  // 🔹 Default fallback (jaga-jaga kalau folder tidak dikenali)
  const defaultUrl = `${BASE_URL}/storage/${path.replace(/^\/?storage\/?/, "")}`;
  return `/api/proxy?url=${encodeURIComponent(defaultUrl)}`;
}
