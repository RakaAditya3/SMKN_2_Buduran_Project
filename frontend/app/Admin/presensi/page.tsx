"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { Loader2, Filter, FileDown } from "lucide-react";
import api from "@/api/api";

interface Presensi {
  id: number;
  nama: string;
  nisn: string;
  kelas: string;
  jurusan: string;
  no_absen: string;
  status: string;
  date: string;
}

const fetcher = (url: string) => api.get(url).then((res) => res.data.data || res.data);

export default function AdminPresensiPage() {
  const [kelas, setKelas] = useState("Semua Kelas");
  const [jurusan, setJurusan] = useState("Semua Jurusan");

  // 🔹 Query dinamis agar refetch otomatis
  const query = new URLSearchParams();
  if (kelas !== "Semua Kelas") query.append("kelas", kelas);
  if (jurusan !== "Semua Jurusan") query.append("jurusan", jurusan);

  const { data, error, isLoading } = useSWR<Presensi[]>(
    `/admin/presensis?${query.toString()}`,
    fetcher,
    { revalidateOnFocus: true }
  );

  const presensis = data ?? [];

  const exportToCSV = () => {
    const header = ["Nama", "NISN", "Kelas", "Jurusan", "No Absen", "Status", "Tanggal"];
    const rows = presensis.map((p) => [
      p.nama,
      p.nisn,
      p.kelas,
      p.jurusan,
      p.no_absen,
      p.status,
      p.date,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `presensi_${kelas}_${jurusan}.csv`;
    link.click();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold mb-2">Presensi Siswa</h1>
      <p className="text-gray-500 mb-4">
        Lihat daftar kehadiran berdasarkan kelas dan jurusan. Data dapat diunduh ke CSV.
      </p>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="text-gray-500" size={18} />
          <span className="font-semibold">Filter Presensi</span>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <select
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option>Semua Kelas</option>
            <option>X</option>
            <option>XI</option>
            <option>XII</option>
          </select>

          <select
            value={jurusan}
            onChange={(e) => setJurusan(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option>Semua Jurusan</option>
            <option>RPL</option>
            <option>DKV</option>
            <option>LPB</option>
            <option>BD</option>
            <option>AK</option>
            <option>MP</option>
          </select>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FileDown size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Daftar Kehadiran</h2>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-gray-500" size={28} />
          </div>
        ) : error ? (
          <p className="text-center text-red-500 py-8">
            ❌ Gagal memuat data presensi.
          </p>
        ) : presensis.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Tidak ada data presensi.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="p-2">No</th>
                <th className="p-2">Nama</th>
                <th className="p-2">NISN</th>
                <th className="p-2">Kelas</th>
                <th className="p-2">Jurusan</th>
                <th className="p-2">No Absen</th>
                <th className="p-2">Status</th>
                <th className="p-2">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {presensis.map((p, i) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 text-gray-500">{i + 1}</td>
                  <td className="p-2 font-medium">{p.nama}</td>
                  <td className="p-2">{p.nisn}</td>
                  <td className="p-2">{p.kelas}</td>
                  <td className="p-2">{p.jurusan}</td>
                  <td className="p-2">{p.no_absen}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-md font-medium ${
                        p.status === "hadir"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.status === "hadir" ? "Hadir" : "Tidak Hadir"}
                    </span>
                  </td>
                  <td className="p-2 text-gray-600">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
