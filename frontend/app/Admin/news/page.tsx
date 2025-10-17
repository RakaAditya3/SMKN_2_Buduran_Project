"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import useSWR from "swr";
import api from "@/api/api";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
}

interface News {
  id: number;
  title: string;
  description: string;
  slug: string;
  thumbnail?: string;
  content: string;
  published_at: string;
  category_id: number;
}

export default function NewsPage() {
  const router = useRouter();

  // ✅ SWR Hooks (auto refresh data)
  const fetcher = (url: string) => api.get(url).then((res) => res.data);
  const { data: news = [], mutate: refreshNews } = useSWR<News[]>("/admin/news", fetcher);
  const { data: categories = [] } = useSWR<Category[]>("/admin/categories", fetcher);

  // Form State
  const [form, setForm] = useState({
    title: "",
    description: "",
    slug: "",
    content: "",
    published_at: "",
    category_id: "",
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🧭 Handle Input Change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🖼️ Handle Image Upload
  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setThumbnail(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  // 📰 Tambah Berita
  const addNews = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formattedDate = new Date(form.published_at).toISOString().split("T")[0];
    const formData = new FormData();

    Object.entries({ ...form, published_at: formattedDate }).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (thumbnail) formData.append("thumbnail", thumbnail);

    try {
      await api.post("/admin/news", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Revalidate list langsung
      await refreshNews();

      // Reset form
      setForm({
        title: "",
        description: "",
        slug: "",
        content: "",
        published_at: "",
        category_id: "",
      });
      setThumbnail(null);
      setPreview(null);

      alert("✅ Berita berhasil ditambahkan!");
    } catch (err) {
      alert("❌ Gagal menambahkan berita.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Hapus Berita
  const deleteNews = async (id: number) => {
    if (!confirm("Yakin ingin menghapus berita ini?")) return;
    await api.delete(`/admin/news/${id}`);
    // ✅ Revalidate otomatis
    await refreshNews();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Create New Article</h1>
      <p className="text-gray-500 mb-8">Write and publish news article</p>

      {/* FORM TAMBAH BERITA */}
      <form onSubmit={addNews} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* LEFT - Article Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="font-semibold mb-4 text-lg text-gray-800">Article Content</h2>
            <div className="space-y-4">
              <input
                name="title"
                placeholder="Write Title Here..."
                value={form.title}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="slug"
                placeholder="Write Slug Here..."
                value={form.slug}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="description"
                placeholder="Write Excerpt / Short Description..."
                value={form.description}
                onChange={handleChange}
                rows={3}
                required
                className="w-full border rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="content"
                placeholder="Write Full Description Here..."
                value={form.content}
                onChange={handleChange}
                rows={6}
                required
                className="w-full border rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
            <h2 className="font-semibold mb-3 text-lg text-gray-800">Featured Image</h2>
            <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition">
              <span className="text-gray-500">📤 Click to Upload Image</span>
              <span className="text-sm text-gray-400">PNG, JPG, GIF up to 10MB</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
            </label>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 w-full max-h-56 object-cover rounded-lg border"
              />
            )}
          </div>
        </div>

        {/* RIGHT - Publication Details */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="font-semibold mb-4 text-lg text-gray-800">Publication</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Category</label>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Publish Date</label>
                <input
                  name="published_at"
                  type="date"
                  value={form.published_at}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-between gap-2 mt-6">
                <button
                  type="button"
                  className="flex-1 py-2 border rounded-lg hover:bg-gray-100 font-medium"
                >
                  Save Draft
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium"
                >
                  {loading ? "Publishing..." : "Publish"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* 🗂️ NEWS LIST */}
      <div className="bg-white shadow-sm rounded-xl border p-6">
        <h2 className="text-xl font-semibold mb-4">Existing News</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Thumbnail</th>
              <th className="p-2">Title</th>
              <th className="p-2">Category</th>
              <th className="p-2">Published</th>
              <th className="p-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {news.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-8">
                  Belum ada berita
                </td>
              </tr>
            ) : (
              news.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        className="w-16 h-12 rounded object-cover border"
                      />
                    ) : (
                      <span className="text-gray-400 italic">No Image</span>
                    )}
                  </td>
                  <td className="p-2">{item.title}</td>
                  <td className="p-2">
                    {categories.find((c) => c.id === item.category_id)?.name || "—"}
                  </td>
                  <td className="p-2">
                    {new Date(item.published_at).toLocaleDateString("id-ID")}
                  </td>
                  <td className="p-2 text-right space-x-3">
                    <button
                      onClick={() => router.push(`/Admin/news/${item.id}/edit`)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteNews(item.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
