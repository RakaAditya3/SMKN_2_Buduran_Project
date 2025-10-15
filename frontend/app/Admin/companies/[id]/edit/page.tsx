"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import api from "@/api/api";
import { useParams, useRouter } from "next/navigation";
import { ImagePlus, X } from "lucide-react";

interface Company {
  id?: number;
  name: string;
  address: string;
  website?: string;
  logo?: string;
}

export default function EditCompanyPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<Company>({
    name: "",
    address: "",
    website: "",
    logo: "",
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch existing company
  useEffect(() => {
    const fetchCompany = async () => {
      const res = await api.get(`/admin/companies/${id}`);
      setForm(res.data);
      setPreview(res.data.logo || null);
    };
    fetchCompany();
  }, [id]);

  //  Handle input
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  //  Handle logo upload
  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogo(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const formData = new FormData();
  formData.append("_method", "PUT");

  Object.entries(form).forEach(([key, value]) => {
    if (value) formData.append(key, value.toString());
  });
  if (logo) formData.append("logo", logo);

  try {
    const res = await api.post(`/admin/companies/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert(res.data.message);
    router.push("/Admin/companies");
  } catch (err) {
    alert("❌ Gagal memperbarui perusahaan.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Edit Company</h1>
        <button
          onClick={() => router.push("/Admin/companies")}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          Back
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-sm border space-y-5 max-w-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Company Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="border rounded-lg p-2 w-full"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Website</label>
            <input
              name="website"
              value={form.website || ""}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
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
            type="button"
            onClick={() => router.push("/admin/companies")}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700"
          >
            {loading ? "Updating..." : "Update Company"}
          </button>
        </div>
      </form>
    </div>
  );
}
