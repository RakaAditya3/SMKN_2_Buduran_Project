"use client";

import { useEffect, useState, FormEvent } from "react";
import api from "@/api/api";
import { Loader2, Edit3, CheckCircle2 } from "lucide-react";
import { resolveLocalProxyImage } from "@/lib/resolveImageUrl";

interface RecordType {
  id: number;
  ebook: {
    id: number;
    title: string;
    image_path?: string;
  };
  student?: {
    nama: string;
    nisn: string;
  };
  borrowed_at: string;
  returned_at?: string;
  status: string;
}

export default function RecordsPage() {
  const [records, setRecords] = useState<RecordType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<RecordType | null>(null);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  // 🔹 Fetch data records
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/records");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];
      setRecords(data);
    } catch (err) {
      console.error("❌ Gagal memuat records:", err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // 🔹 Handle update status
  const handleUpdateStatus = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;

    setSaving(true);
    try {
      // jika returned, isi tanggal hari ini
      const returnedAt =
        status.toLowerCase() === "returned"
          ? new Date().toISOString().split("T")[0] 
          : null;

      await api.patch(`/admin/books/records/${selected.id}/status`, {
        status,
        returned_at: returnedAt,
      });

      fetchRecords();
      setSelected(null);
    } catch (err) {
      console.error("❌ Gagal update:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-2">Record Management</h1>
      <p className="text-gray-500 mb-8">
        Lihat dan kelola status peminjaman eBook oleh siswa.
      </p>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Daftar Peminjaman</h2>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin text-gray-500" size={28} />
          </div>
        ) : records.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Belum ada data peminjaman buku.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="p-2">E-Book</th>
                <th className="p-2">Siswa</th>
                <th className="p-2">Tanggal Pinjam</th>
                <th className="p-2">Tanggal Kembali</th>
                <th className="p-2">Status</th>
                <th className="p-2 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec) => (
                <tr key={rec.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 flex items-center gap-3">
                    <img
                    src={resolveLocalProxyImage(rec.ebook?.image_path)}
                    alt={rec.ebook?.title}
                    className="w-10 h-12 object-cover rounded border"
                  />
                    <div>
                      <p className="font-medium">{rec.ebook?.title}</p>
                      <p className="text-xs text-gray-500">
                        ID #{rec.ebook?.id}
                      </p>
                    </div>
                  </td>

                  <td className="p-2">
                    <p className="font-medium">
                      {rec.student?.nama || "Tidak diketahui"}
                    </p>
                    <p className="text-xs text-gray-500">
                      NISN: {rec.student?.nisn || "-"}
                    </p>
                  </td>

                  <td className="p-2">
                    {new Date(rec.borrowed_at).toLocaleDateString("id-ID")}
                  </td>
                  <td className="p-2">
                    {rec.returned_at
                      ? new Date(rec.returned_at).toLocaleDateString("id-ID")
                      : "-"}
                  </td>

                  <td className="p-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        rec.status === "borrowed"
                          ? "bg-yellow-100 text-yellow-700"
                          : rec.status === "returned"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {rec.status === "borrowed"
                        ? "Dipinjam"
                        : rec.status === "returned"
                        ? "Dikembalikan"
                        : rec.status}
                    </span>
                  </td>

                  <td className="p-2 text-right">
                    <button
                      onClick={() => {
                        setSelected(rec);
                        setStatus(rec.status);
                      }}
                      className="text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <Edit3 size={16} /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 🔹 Modal Update */}
      {selected && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
            <h3 className="text-xl font-semibold mb-4">
              Ubah Status Peminjaman
            </h3>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  E-Book
                </label>
                <p className="font-medium text-gray-900">
                  {selected.ebook?.title}
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Nama Siswa
                </label>
                <p className="text-gray-800">{selected.student?.nama}</p>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border rounded-lg p-2 w-full"
                >
                  <option value="borrowed">Dipinjam</option>
                  <option value="returned">Dikembalikan</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 size={16} />
                  )}
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
