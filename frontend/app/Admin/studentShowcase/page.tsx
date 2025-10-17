"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import api from "@/api/api";
import { ImagePlus, X, Pencil, Trash2, Link2 } from "lucide-react";
import { resolveLocalProxyImage } from "@/lib/resolveImageUrl";

interface Showcase {
  id?: number;
  student_name: string;
  student_class: string;
  student_major: string;
  contact_number: string;
  title: string;
  description: string;
  project_link?: string;
  status: "draft" | "published";
  image_url?: string;
}

export default function ShowcasePage() {
  const [showcases, setShowcases] = useState<Showcase[]>([]);
  const [form, setForm] = useState<Showcase>({
    student_name: "",
    student_class: "",
    student_major: "",
    contact_number: "",
    title: "",
    description: "",
    project_link: "",
    status: "published",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch data showcase
  const fetchShowcases = async () => {
    try {
      const res = await api.get("/student-showcase");
      const data = Array.isArray(res.data) ? res.data : res.data.data;
      setShowcases(data || []);
    } catch (err) {
      console.error("❌ Gagal memuat data showcase:", err);
    }
  };

  useEffect(() => {
    fetchShowcases();
  }, []);

  // Handle input form
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file upload
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

  // Submit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, value.toString());
    });
    if (image) formData.append("image", image);

    try {
      let res;
      if (editingId) {
        formData.append("_method", "PUT");
       res = await api.post(`/admin/student-showcase/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await api.post("/admin/student-showcase-post", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      alert(res.data.message);
      resetForm();
      fetchShowcases();
    } catch (err: any) {
      console.error("❌ Error saat menyimpan showcase:", err);
      alert("❌ Gagal menyimpan showcase.");
    } finally {
      setLoading(false);
    }
  };

  // Edit data
  const handleEdit = (data: Showcase) => {
    setEditingId(data.id!);
    setForm({
      student_name: data.student_name,
      student_class: data.student_class,
      student_major: data.student_major,
      contact_number: data.contact_number,
      title: data.title,
      description: data.description,
      project_link: data.project_link || "",
      status: data.status || "published",
    });
  setPreview(resolveLocalProxyImage(data.image_url ?? null));
  };

  // Hapus data
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus showcase ini?")) return;
   await api.delete(`/admin/student-showcase/${id}`);
    fetchShowcases();
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      student_name: "",
      student_class: "",
      student_major: "",
      contact_number: "",
      title: "",
      description: "",
      project_link: "",
      status: "published",
    });
    setImage(null);
    setPreview(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-2">Student Showcase Management</h1>
      <p className="text-gray-500 mb-8">
        Kelola karya terbaik siswa SMKN 2 Buduran dengan mudah.
      </p>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-sm border space-y-5 max-w-4xl mb-10"
      >
        <h2 className="text-lg font-semibold">
          {editingId ? "Edit Showcase" : "Tambah Showcase"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="student_name"
            value={form.student_name}
            onChange={handleChange}
            placeholder="Nama Siswa"
            required
            className="border rounded-lg p-2 w-full"
          />
          <input
            name="student_class"
            value={form.student_class}
            onChange={handleChange}
            placeholder="Kelas"
            required
            className="border rounded-lg p-2 w-full"
          />
          <input
            name="student_major"
            value={form.student_major}
            onChange={handleChange}
            placeholder="Jurusan"
            required
            className="border rounded-lg p-2 w-full"
          />
          <input
            name="contact_number"
            value={form.contact_number}
            onChange={handleChange}
            placeholder="Nomor WA"
            required
            className="border rounded-lg p-2 w-full"
          />

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Judul Showcase"
            required
            className="border rounded-lg p-2 w-full md:col-span-2"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            required
            className="border rounded-lg p-2 w-full md:col-span-2"
            placeholder="Deskripsi singkat karya..."
          />

          <input
            name="project_link"
            value={form.project_link || ""}
            onChange={handleChange}
            placeholder="Link Project (opsional)"
            className="border rounded-lg p-2 w-full"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          {/* Upload Gambar */}
          <div className="md:col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Gambar Showcase
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
                  <span className="text-gray-400 text-sm mt-2">Upload Gambar</span>
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

        {/* Tombol Submit */}
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
            {loading ? "Saving..." : editingId ? "Update Showcase" : "Add Showcase"}
          </button>
        </div>
      </form>

      {/* TABLE */}
      <div className="bg-white shadow-sm rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-4">Daftar Showcase</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Gambar</th>
              <th className="p-2">Judul</th>
              <th className="p-2">Siswa</th>
              <th className="p-2">Status</th>
              <th className="p-2 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {showcases.map((s) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  {s.image_url ? (
                    <img
                      src={resolveLocalProxyImage(s.image_url)}
                      alt={s.title}
                      className="w-14 h-20 object-cover rounded border"
                    />
                  ) : (
                    <span className="text-gray-400 italic">No Image</span>
                  )}
                </td>
                <td className="p-2 font-medium">{s.title}</td>
                <td className="p-2 text-gray-600">
                  {s.student_name} <br />
                  <span className="text-xs text-gray-400">
                    {s.student_class} • {s.student_major}
                  </span>
                </td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      s.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="p-2 text-right space-x-3">
                  {s.project_link && (
                    <a
                      href={s.project_link}
                      target="_blank"
                      className="text-blue-500 hover:underline inline-flex items-center gap-1"
                    >
                      <Link2 size={14} /> Link
                    </a>
                  )}
                  <button
                    onClick={() => handleEdit(s)}
                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id!)}
                    className="text-red-600 hover:underline inline-flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showcases.length === 0 && (
          <p className="text-center text-gray-500 py-4">Belum ada showcase yang diunggah.</p>
        )}
      </div>
    </div>
  );
}
