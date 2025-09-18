'use client'

import React, { useEffect, useState } from 'react';
import api from '@/api/api';
import { format } from 'date-fns';

interface Record {
  id: number;
  ebook: {
    title: string;
  };
  borrowed_at: string;
  returned_at: string | null;
  status: 'borrowed' | 'returned';
}

const RiwayatPeminjaman: React.FC = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await api.get('/books/records'); // endpoint yang mengembalikan riwayat siswa berdasarkan token
        setRecords(res.data);
      } catch (err) {
        setError('Gagal memuat data riwayat peminjaman');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4 text-black">Riwayat Peminjaman</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : records.length === 0 ? (
        <p className="text-gray-600">Belum ada riwayat peminjaman</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">No</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Judul Buku</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tanggal Pinjam</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tanggal Kembali</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, idx) => (
                <tr key={record.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 text-sm text-gray-700">{idx + 1}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{record.ebook.title}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {format(new Date(record.borrowed_at), 'dd MMM yyyy')}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {record.returned_at ? format(new Date(record.returned_at), 'dd MMM yyyy') : '-'}
                  </td>
                  <td className={`px-4 py-2 text-sm font-semibold ${
                    record.status === 'returned' ? 'text-green-600' : 'text-orange-500'
                  }`}>
                    {record.status === 'returned' ? 'Dikembalikan' : 'Dipinjam'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RiwayatPeminjaman;
