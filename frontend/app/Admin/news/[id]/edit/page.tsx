"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/api/api";
import { resolveLocalProxyImage } from "@/lib/resolveImageUrl";

interface Category {
  id: number;
  name: string;
}

export default function EditNewsPage() {
  const { id } = useParams();
  const router = useRouter();

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch existing news detail
  const fetchNews = async () => {
    try {
      const res = await api.get(`/admin/news/${id}`);
      const data = res.data;
      setForm({
        title: data.title,
        description: data.description,
        slug: data.slug,
        content: data.content,
        published_at: data.published_at.split("T")[0],
        category_id: data.category_id.toString(),
      });
       setPreview(resolveLocalProxyImage(data.thumbnail ?? null));
    } catch (err) {
      alert("❌ Gagal memuat data berita.");
    }
  };

  const getCategories = async () => {
    const res = await api.get("/admin/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    if (id) {
      fetchNews();
      getCategories();
    }
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setThumbnail(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formattedDate = new Date(form.published_at).toISOString().split("T")[0];
    const formData = new FormData();
    Object.entries({ ...form, published_at: formattedDate }).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      await api.post(`/admin/news/${id}?_method=PUT`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Berita berhasil diperbarui!");
      router.push("/Admin/news");
    } catch (err) {
      alert("❌ Gagal memperbarui berita. Pastikan input sudah benar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Edit Article</h1>
          <p className="text-gray-500">Modify and update your news article</p>
        </div>
        <button
          onClick={() => router.push("/admin/news")}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100 text-gray-700"
        >
          ← Back
        </button>
      </div>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                placeholder="Write Description..."
                value={form.description}
                onChange={handleChange}
                rows={3}
                required
                className="w-full border rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="content"
                placeholder="Full content here..."
                value={form.content}
                onChange={handleChange}
                rows={6}
                required
                className="w-full border rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Thumbnail */}
          <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
            <h2 className="font-semibold mb-3 text-lg text-gray-800">Featured Image</h2>
            <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition">
              <span className="text-gray-500">📤 Click to Upload New Image</span>
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

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium"
                >
                  {loading ? "Updating..." : "💾 Update Article"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
