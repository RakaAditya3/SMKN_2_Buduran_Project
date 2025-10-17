export function resolveLocalProxyImage(path?: string | null): string {
  if (!path) return "/images/default-placeholder.jpg";

  const BASE_URL = "https://env-laravel.jh-beon.cloud";

  // ✅ Jika sudah absolute URL (http/https)
  if (path.startsWith("http")) {
    // ⬇️ Langsung pakai, tanpa proxy
    return path;
  }

  // eBook
  if (path.includes("ebooks") || path.includes("/ebook")) {
    return `${BASE_URL}/storage/ebooks/${path.replace(/^\/?storage\/ebooks\/?/, "")}`;
  }

  // News / Berita
  if (path.includes("news") || path.includes("/berita")) {
    return `${BASE_URL}/storage/news/${path.replace(/^\/?storage\/news\/?/, "")}`;
  }

  // Company / Perusahaan
  if (path.includes("company") || path.includes("/companies")) {
    return `${BASE_URL}/storage/company/${path.replace(/^\/?storage\/company\/?/, "")}`;
  }

  // Student Showcase
  if (path.includes("showcase") || path.includes("student-showcase")) {
    return `${BASE_URL}/storage/showcases/${path.replace(/^\/?storage\/showcases\/?/, "")}`;
  }

  // Default fallback
  return `${BASE_URL}/storage/${path.replace(/^\/?storage\/?/, "")}`;
}
