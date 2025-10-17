"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { Filter, Users, Calendar, CheckCircle, XCircle } from "lucide-react";
import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import api from "@/api/api";

type Presensi = {
  id: number;
  nama: string;
  nisn: string;
  kelas: string;
  jurusan: string;
  no_absen: string;
  status: string;
  date: string;
};

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

export default function PresensiPage() {
  const [kelas, setKelas] = useState("Semua Kelas");
  const [jurusan, setJurusan] = useState("Semua Jurusan");
  const [searchNama, setSearchNama] = useState("");

  // SWR key tergantung filter agar auto refetch saat filter berubah
  const query = new URLSearchParams();
  if (kelas !== "Semua Kelas") query.append("kelas", kelas);
  if (jurusan !== "Semua Jurusan") query.append("jurusan", jurusan);

  const { data, error, isLoading } = useSWR<Presensi[]>(
    `/presensis?${query.toString()}`,
    fetcher,
    { revalidateOnFocus: true }
  );

  const filteredData =
    data?.filter((d) =>
      d.nama.toLowerCase().includes(searchNama.toLowerCase())
    ) ?? [];

  const totalMasuk = filteredData.filter((d) => d.status === "Masuk").length;
  const totalTidakHadir = filteredData.filter(
    (d) => d.status === "Tidak Hadir"
  ).length;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-8 mt-28">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Presensi Siswa
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Lihat daftar kehadiran berdasarkan kelas dan jurusan
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <StatCard title="Total Siswa" value={filteredData.length} color="blue" />
            <StatCard title="Hadir" value={totalMasuk} color="green" />
            <StatCard title="Tidak Hadir" value={totalTidakHadir} color="red" />
          </div>

          {/* Filter */}
          <div className="bg-white shadow-lg rounded-xl p-5 mb-6 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Filter className="text-blue-600" size={20} />
                </div>
                <span className="font-semibold text-gray-700 text-lg">
                  Filter Presensi
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <select
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="border-2 border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 focus:border-blue-500 focus:outline-none"
                >
                  <option>Semua Kelas</option>
                  <option>X</option>
                  <option>XI</option>
                  <option>XII</option>
                </select>

                <select
                  value={jurusan}
                  onChange={(e) => setJurusan(e.target.value)}
                  className="border-2 border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 focus:border-blue-500 focus:outline-none"
                >
                  <option>Semua Jurusan</option>
                  <option>RPL</option>
                  <option>DKV</option>
                  <option>LPB</option>
                  <option>BD</option>
                  <option>AK</option>
                  <option>MP</option>
                </select>

                <input
                  type="text"
                  value={searchNama}
                  onChange={(e) => setSearchNama(e.target.value)}
                  placeholder="Cari nama siswa..."
                  className="border-2 border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center gap-3">
              <Calendar className="text-white" size={24} />
              <h2 className="font-semibold text-white text-lg">
                Daftar Kehadiran
              </h2>
            </div>

            {isLoading ? (
              <div className="text-center py-12 text-blue-500 animate-pulse">
                Memuat data...
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-600 font-medium">
                Gagal memuat data presensi.
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Tidak ada data yang sesuai dengan filter
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        No
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Nama
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        NISN
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Kelas
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Jurusan
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        No Absen
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Tanggal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.map((d, i) => (
                      <tr key={d.id} className="hover:bg-blue-50 transition-colors">
                        <td className="py-3 px-4 text-sm text-gray-700">{i + 1}</td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{d.nama}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{d.nisn}</td>
                        <td className="py-3 px-4">{d.kelas}</td>
                        <td className="py-3 px-4">{d.jurusan}</td>
                        <td className="py-3 px-4">{d.no_absen}</td>
                        <td className="py-3 px-4">{d.status}</td>
                        <td className="py-3 px-4">{d.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className={`bg-white rounded-xl shadow-md p-5 border-l-4 border-${color}-500`}
    >
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
      </div>
    </div>
  );
}
