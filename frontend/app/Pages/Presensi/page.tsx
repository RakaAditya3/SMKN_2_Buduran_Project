'use client'

import React, { useState } from 'react'
import { Filter, Users, Calendar, CheckCircle, XCircle } from 'lucide-react'
import Navbar from '@/app/Components/Navbar'
import Footer from '@/app/Components/Footer'

const Page = () => {
  const [kelas, setKelas] = useState('Semua Kelas')
  const [jurusan, setJurusan] = useState('Semua Jurusan')
  const [searchNama, setSearchNama] = useState('')

  const data = [
    { no: 1, nama: 'Siswa 1', nisn: '20256001', kelas: 'X', jurusan: 'RPL', absen: 1, status: 'Masuk', tanggal: '2025-10-15' },
    { no: 2, nama: 'Siswa 2', nisn: '20256002', kelas: 'XI', jurusan: 'DKV', absen: 4, status: 'Tidak Hadir', tanggal: '2025-10-15' },
    { no: 3, nama: 'Siswa 3', nisn: '20256003', kelas: 'XII', jurusan: 'AK', absen: 8, status: 'Masuk', tanggal: '2025-10-15' },
    { no: 4, nama: 'Siswa 4', nisn: '20256004', kelas: 'X', jurusan: 'RPL', absen: 2, status: 'Masuk', tanggal: '2025-10-15' },
    { no: 5, nama: 'Siswa 5', nisn: '20256005', kelas: 'XI', jurusan: 'LPB', absen: 3, status: 'Tidak Hadir', tanggal: '2025-10-15' },
  ]

  const filteredData = data.filter(d => {
    const kelasMatch = kelas === 'Semua Kelas' || d.kelas === kelas
    const jurusanMatch = jurusan === 'Semua Jurusan' || d.jurusan === jurusan
    const namaMatch = d.nama.toLowerCase().includes(searchNama.toLowerCase())
    return kelasMatch && jurusanMatch && namaMatch
  })

  const totalMasuk = filteredData.filter(d => d.status === 'Masuk').length
  const totalTidakHadir = filteredData.filter(d => d.status === 'Tidak Hadir').length

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-8 mt-28">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Presensi Siswa
            </h1>
            <p className="text-gray-600">
              Lihat daftar kehadiran berdasarkan kelas dan jurusan
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Siswa</p>
                  <p className="text-3xl font-bold text-gray-800">{filteredData.length}</p>
                </div>
                <Users className="text-blue-500" size={40} />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Hadir</p>
                  <p className="text-3xl font-bold text-green-600">{totalMasuk}</p>
                </div>
                <CheckCircle className="text-green-500" size={40} />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tidak Hadir</p>
                  <p className="text-3xl font-bold text-red-600">{totalTidakHadir}</p>
                </div>
                <XCircle className="text-red-500" size={40} />
              </div>
            </div>
          </div>

          {/* Filter Card */}
          <div className="bg-white shadow-lg rounded-xl p-5 mb-6 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Filter className="text-blue-600" size={20} />
                </div>
                <span className="font-semibold text-gray-700 text-lg">Filter Presensi</span>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <select
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="flex-1 md:flex-none border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option>Semua Kelas</option>
                  <option>X</option>
                  <option>XI</option>
                  <option>XII</option>
                </select>

                <select
                  value={jurusan}
                  onChange={(e) => setJurusan(e.target.value)}
                  className="flex-1 md:flex-none border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
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
                  onChange={(e) => {
                    setSearchNama(e.target.value)
                    if (e.target.value !== '') {
                      setKelas('Semua Kelas')
                      setJurusan('Semua Jurusan')
                    }
                  }}
                  placeholder="Cari nama siswa..."
                  className="flex-1 md:w-64 border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
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
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No</th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama</th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">NISN</th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Kelas</th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Jurusan</th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No Absen</th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((d, index) => (
                    <tr key={index} className="hover:bg-blue-50 transition-colors">
                      <td className="py-4 px-6 text-sm text-gray-700">{d.no}</td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">{d.nama}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{d.nisn}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          {d.kelas}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                          {d.jurusan}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700">{d.absen}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
                            d.status === 'Masuk'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {d.status === 'Masuk' ? (
                            <CheckCircle size={14} className="mr-1" />
                          ) : (
                            <XCircle size={14} className="mr-1" />
                          )}
                          {d.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{d.tanggal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Tidak ada data yang sesuai dengan filter</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Page