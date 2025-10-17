"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import api from "@/api/api";
import { ImagePlus, X } from "lucide-react";
import { resolveLocalProxyImage } from "@/lib/resolveImageUrl";

interface Company {
  id?: number;
  name: string;
  address: string;
  website?: string;
  logo?: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [form, setForm] = useState<Company>({
    name: "",
    address: "",
    website: "",
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // 🔹 Fetch all companies
  const fetchCompanies = async () => {
    const res = await api.get("/admin/companies");
    setCompanies(res.data);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // 🔹 Handle text input
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Handle logo input
  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogo(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  // 🔹 Submit (Add)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value.toString());
    });
    if (logo) formData.append("logo", logo);

    try {
      const res = await api.post("/admin/companies", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(res.data.message);
      fetchCompanies();
      setForm({ name: "", address: "", website: "" });
      setLogo(null);
      setPreview(null);
    } catch (err) {
      alert("❌ Gagal menyimpan data perusahaan.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus perusahaan ini?")) return;
    await api.delete(`/admin/companies/${id}`);
    fetchCompanies();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-2">Company Management</h1>
      <p className="text-gray-500 mb-8">
        Manage partner companies and upload their logos directly to Supabase.
      </p>

      {/* FORM ADD */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-sm border space-y-5 max-w-3xl mb-10"
      >
        <h2 className="text-lg font-semibold">Add New Company</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Company Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="border rounded-lg p-2 w-full"
              placeholder="Enter company name"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Website</label>
            <input
              name="website"
              value={form.website || ""}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
              placeholder="https://example.com"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              required
              className="border rounded-lg p-2 w-full"
              placeholder="Company address..."
            />
          </div>

          {/* Upload Logo */}
          <div className="md:col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Company Logo
            </label>

            <div className="flex flex-col items-start gap-3">
              {preview ? (
                <div className="relative group">
                  <img
                    src={preview}
                    alt="Logo Preview"
                    className="w-40 h-40 object-cover rounded-xl border shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setLogo(null);
                      setPreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="logo"
                  className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl w-40 h-40 flex flex-col items-center justify-center hover:border-blue-400 transition"
                >
                  <ImagePlus className="text-gray-400" size={32} />
                  <span className="text-gray-400 text-sm mt-2">Upload Logo</span>
                  <input
                    id="logo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Add Company"}
          </button>
        </div>
      </form>

      {/* COMPANY LIST */}
      <div className="bg-white shadow-sm rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-4">Existing Companies</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Logo</th>
              <th className="p-2">Name</th>
              <th className="p-2">Website</th>
              <th className="p-2">Address</th>
              <th className="p-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  {company.logo ? (
                    <img
                      src={resolveLocalProxyImage(company.logo)} // ✅ Gunakan proxy resolver di sini
                      alt={company.name}
                      className="w-12 h-12 object-cover rounded border"
                    />
                  ) : (
                    <span className="text-gray-400 italic">No Logo</span>
                  )}
                </td>
                <td className="p-2">{company.name}</td>
                <td className="p-2">
                  {company.website ? (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {company.website}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-2">{company.address}</td>
                <td className="p-2 text-right space-x-3">
                  <button
                    onClick={() => router.push(`/Admin/companies/${company.id}/edit`)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(company.id!)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {companies.length === 0 && (
          <p className="text-center text-gray-500 py-4">No companies added yet.</p>
        )}
      </div>
    </div>
  );
}
