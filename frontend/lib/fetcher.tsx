// 📁 lib/fetcher.ts
import api from "@/api/api";

/**
 * Fetcher standar untuk SWR.
 * Otomatis menambahkan prefix "/api/" jika belum ada.
 */
export const fetcher = async (url: string) => {
  // Kalau url belum diawali dengan '/api', tambahkan otomatis
  const fullUrl = url.startsWith("/api") ? url : `/api/${url}`;
  const response = await api.get(fullUrl);
  return response.data;
};
