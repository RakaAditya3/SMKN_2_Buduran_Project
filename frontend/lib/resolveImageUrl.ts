export function resolveLocalProxyImage(path?: string | null): string {
  if (!path) return "/images/default-placeholder.jpg";

  const BASE_URL = "https://env-laravel.jh-beon.cloud";

  // ✅ Selalu arahkan ke proxy, bahkan jika path sudah berupa URL absolut
  const buildProxyUrl = (url: string) => `/api/proxy?url=${encodeURIComponent(url)}`;

  // --- Jika URL sudah lengkap (http/https)
  if (path.startsWith("http")) {
    return buildProxyUrl(path);
  }

  // --- eBook
  if (path.includes("ebooks") || path.includes("/ebook")) {
    const url = `${BASE_URL}/storage/ebooks/${path.replace(/^\/?storage\/ebooks\/?/, "")}`;
    return buildProxyUrl(url);
  }

  // --- News / Berita
  if (path.includes("news") || path.includes("/berita")) {
    const url = `${BASE_URL}/storage/news/${path.replace(/^\/?storage\/news\/?/, "")}`;
    return buildProxyUrl(url);
  }

  // --- Company / Perusahaan
  if (path.includes("company") || path.includes("/companies")) {
    const url = `${BASE_URL}/storage/company/${path.replace(/^\/?storage\/company\/?/, "")}`;
    return buildProxyUrl(url);
  }

  // --- Student Showcase
  if (path.includes("showcase") || path.includes("student-showcase")) {
    const url = `${BASE_URL}/storage/showcases/${path.replace(/^\/?storage\/showcases\/?/, "")}`;
    return buildProxyUrl(url);
  }

  // --- Default fallback (jaga-jaga)
  const fallback = `${BASE_URL}/storage/${path.replace(/^\/?storage\/?/, "")}`;
  return buildProxyUrl(fallback);
}
