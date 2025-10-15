"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import api from "@/api/api";
import { Pencil, Trash2 } from "lucide-react";

interface Category {
  id?: number;
  name: string;
  slug: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Category>({ name: "", slug: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await api.get("/admin/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("❌ Gagal memuat kategori:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 🔹 Handle input
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "name" && !editingId
        ? { slug: value.toLowerCase().replace(/\s+/g, "-") }
        : {}),
    }));
  };

  // 🔹 Add or Update
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    payload.append("name", form.name);
    payload.append("slug", form.slug);
    if (editingId) payload.append("id", editingId.toString());

    try {
      const res = await api.post("/admin/categories", payload);
      alert(res.data.message);
      resetForm();
      fetchCategories();
    } catch (err) {
      alert("❌ Gagal menyimpan kategori. Pastikan nama dan slug unik.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Edit inline
  const handleEdit = (category: Category) => {
    setEditingId(category.id!);
    setForm({ name: category.name, slug: category.slug });
  };

  // 🔹 Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus kategori ini?")) return;
    await api.delete(`/admin/categories/${id}`);
    fetchCategories();
  };

  // 🔹 Reset form
  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", slug: "" });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-2">Category Management</h1>
      <p className="text-gray-500 mb-8">
        Manage categories for news, products, and other content.
      </p>

      {/* FORM SECTION */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-sm border space-y-5 max-w-3xl mb-10"
      >
        <h2 className="text-lg font-semibold">
          {editingId ? "Edit Category" : "Add New Category"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="border rounded-lg p-2 w-full"
              placeholder="Enter category name"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Slug</label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
              className="border rounded-lg p-2 w-full"
              placeholder="auto-generated-from-name"
            />
          </div>
        </div>

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
            {loading ? "Saving..." : editingId ? "Update Category" : "Add Category"}
          </button>
        </div>
      </form>

      {/* TABLE SECTION */}
      <div className="bg-white shadow-sm rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-4">Existing Categories</h2>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 font-medium text-gray-700">Name</th>
              <th className="p-2 font-medium text-gray-700">Slug</th>
              <th className="p-2 text-right font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{cat.name}</td>
                <td className="p-2 text-gray-600">{cat.slug}</td>
                <td className="p-2 text-right space-x-3">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="text-blue-600 hover:underline items-center gap-1 inline-flex"
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id!)}
                    className="text-red-600 hover:underline items-center gap-1 inline-flex"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categories.length === 0 && (
          <p className="text-center text-gray-500 py-4">No categories added yet.</p>
        )}
      </div>
    </div>
  );
}
