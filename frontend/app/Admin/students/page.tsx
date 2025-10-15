"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import api from "@/api/api";
import { Pencil, Trash2, Loader2 } from "lucide-react";

interface Student {
  id?: number;
  nama: string;
  nisn: string;
  kelas: string;
  jurusan: string;
  no_absen: number;
  uid?: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState<Student>({
    nama: "",
    nisn: "",
    kelas: "",
    jurusan: "",
    no_absen: 1,
    uid: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/admin/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Gagal memuat siswa:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    if (editingId) formData.append("id", editingId.toString());

    try {
      const res = await api.post("/admin/students", formData);
      resetForm();
      fetchStudents();
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (s: Student) => {
    setEditingId(s.id!);
    setForm(s);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus siswa ini?")) return;
    try {
      await api.delete(`/admin/students/${id}`);

      fetchStudents();
    } catch {
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ nama: "", nisn: "", kelas: "", jurusan: "", no_absen: 1, uid: "" });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-2">Student Management</h1>
      <p className="text-gray-500 mb-8">Tambah dan kelola data siswa sekolah.</p>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-sm border space-y-5 max-w-3xl mb-10"
      >
        <h2 className="text-lg font-semibold">
          {editingId ? "Edit Siswa" : "Tambah Siswa"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="nama"
            value={form.nama}
            onChange={handleChange}
            required
            placeholder="Nama lengkap"
            className="border p-2 rounded-lg"
          />
          <input
            name="nisn"
            value={form.nisn}
            onChange={handleChange}
            required
            placeholder="NISN"
            className="border p-2 rounded-lg"
          />
          <input
            name="kelas"
            value={form.kelas}
            onChange={handleChange}
            required
            placeholder="Kelas (X / XI / XII)"
            className="border p-2 rounded-lg"
          />
          <input
            name="jurusan"
            value={form.jurusan}
            onChange={handleChange}
            required
            placeholder="Jurusan (RPL, AK, DKV...)"
            className="border p-2 rounded-lg"
          />
          <input
            type="number"
            name="no_absen"
            value={form.no_absen}
            onChange={handleChange}
            required
            placeholder="No Absen"
            className="border p-2 rounded-lg"
          />
          <input
            name="uid"
            value={form.uid || ""}
            onChange={handleChange}
            placeholder="UID RFID (opsional)"
            className="border p-2 rounded-lg"
          />
        </div>

        <div className="flex justify-end gap-3">
          {editingId && (
            <button type="button" onClick={resetForm} className="border px-4 py-2 rounded-lg">
              Batal
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            {editingId ? "Update" : "Tambah"}
          </button>
        </div>
      </form>

      {/* Tabel Siswa */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Daftar Siswa</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Nama</th>
              <th className="p-2">Kelas</th>
              <th className="p-2">Jurusan</th>
              <th className="p-2">NISN</th>
              <th className="p-2">No Absen</th>
              <th className="p-2">UID</th>
              <th className="p-2 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="p-2 font-medium">{s.nama}</td>
                <td className="p-2">{s.kelas}</td>
                <td className="p-2">{s.jurusan}</td>
                <td className="p-2">{s.nisn}</td>
                <td className="p-2">{s.no_absen}</td>
                <td className="p-2">{s.uid || "-"}</td>
                <td className="p-2 text-right space-x-3">
                  <button
                    onClick={() => handleEdit(s)}
                    className="text-blue-600 hover:underline"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id!)}
                    className="text-red-600 hover:underline"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
