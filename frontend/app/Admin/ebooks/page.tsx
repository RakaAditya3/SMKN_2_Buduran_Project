"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import api from "@/api/api";
import { ImagePlus, X, Pencil, Trash2 } from "lucide-react";

interface EBook {
  id?: number;
  title: string;
  description: string;
  image_url?: string;
}

export default function EbooksPage() {
  const [ebooks, setEbooks] = useState<EBook[]>([]);
  const [form, setForm] = useState<EBook>({ title: "", description: "" });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch all ebooks
  const fetchEbooks = async () => {
    try {
      const res = await api.get("/admin/ebooks");
      setEbooks(res.data.data || res.data);
    } catch (err) {
      console.error("❌ Gagal memuat daftar eBook:", err);
    }
  };

  useEffect(() => {
    fetchEbooks();
  }, []);

  // Handle text input
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  // Submit (Add / Update)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    if (image) formData.append("image", image);

    try {
      let res;

      if (editingId) {
        // ⚡ Gunakan _method override agar Laravel anggap PUT
        formData.append("_method", "PUT");

        res = await api.post(`/admin/ebooks/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Create baru
        res = await api.post("/admin/ebooks", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      alert(res.data.message);
      resetForm();
      fetchEbooks();
    } catch (err: any) {
      console.error("❌ Error saat simpan:", err);
      alert("❌ Gagal menyimpan eBook. Pastikan semua field terisi dengan benar.");
    } finally {
      setLoading(false);
    }
  };

  // Edit
    const handleEdit = (ebook: EBook) => {
    setEditingId(ebook.id!);
    setForm({
      title: ebook.title,
      description: ebook.description,
    });
    setPreview(ebook.image_url || null);
    setImage(null);
  };

  // Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus eBook ini?")) return;
    await api.delete(`/admin/ebooks/${id}`);
    fetchEbooks();
  };

  // Reset form
  const resetForm = () => {
    setEditingId(null);
    setForm({ title: "", description: "" });
    setImage(null);
    setPreview(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-2">E-Book Management</h1>
      <p className="text-gray-500 mb-8">
        Manage digital books and upload cover images directly to Supabase.
      </p>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-sm border space-y-5 max-w-3xl mb-10"
      >
        <h2 className="text-lg font-semibold">
          {editingId ? "Edit E-Book" : "Add New E-Book"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="border rounded-lg p-2 w-full"
              placeholder="Enter eBook title"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              required
              className="border rounded-lg p-2 w-full"
              placeholder="Short description..."
            />
          </div>

          {/* Upload Cover */}
          <div className="md:col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Cover Image
            </label>

            <div className="flex flex-col items-start gap-3">
              {preview ? (
                <div className="relative group">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-40 h-56 object-cover rounded-lg border shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setPreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="image"
                  className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl w-40 h-56 flex flex-col items-center justify-center hover:border-blue-400 transition"
                >
                  <ImagePlus className="text-gray-400" size={32} />
                  <span className="text-gray-400 text-sm mt-2">Upload Cover</span>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-lg text-white ${
              editingId ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : editingId ? "Update E-Book" : "Add E-Book"}
          </button>
        </div>
      </form>

      {/* EBOOK TABLE */}
      <div className="bg-white shadow-sm rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-4">Existing E-Books</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Cover</th>
              <th className="p-2">Title</th>
              <th className="p-2">Description</th>
              <th className="p-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {ebooks.map((ebook) => (
              <tr key={ebook.id} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  {ebook.image_url ? (
                    <img
                      src={ebook.image_url}
                      alt={ebook.title}
                      className="w-14 h-20 object-cover rounded border"
                    />
                  ) : (
                    <span className="text-gray-400 italic">No Cover</span>
                  )}
                </td>
                <td className="p-2 font-medium">{ebook.title}</td>
                <td className="p-2 text-gray-600">{ebook.description}</td>
                <td className="p-2 text-right space-x-3">
                  <button
                    onClick={() => handleEdit(ebook)}
                    className="text-blue-600 hover:underline items-center gap-1 inline-flex"
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ebook.id!)}
                    className="text-red-600 hover:underline items-center gap-1 inline-flex"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {ebooks.length === 0 && (
          <p className="text-center text-gray-500 py-4">No eBooks uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
