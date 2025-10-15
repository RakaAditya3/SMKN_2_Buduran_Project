'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { BookOpenCheck, Clock3, History, Loader2 } from 'lucide-react';
import api from '@/api/api';

interface BorrowRecord {
  id: number;
  ebook: {
    title: string;
  };
  borrowed_at: string;
  returned_at: string | null;
  status: 'borrowed' | 'returned' | string;
}

const RiwayatPeminjaman: React.FC = () => {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await api.get('/books/records');
        setRecords(response.data);
      } catch (err) {
        setError('Gagal memuat data riwayat peminjaman. Coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const stats = useMemo(() => {
    const active = records.filter((record) => record.status === 'borrowed').length;
    const completed = records.filter((record) => record.status === 'returned').length;
    return {
      total: records.length,
      active,
      completed,
    };
  }, [records]);

  const renderStatus = (status: BorrowRecord['status']) => {
    if (status === 'returned') {
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
          <BookOpenCheck size={14} /> Dikembalikan
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
        <Clock3 size={14} /> Dipinjam
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#233459] via-[#2E4874] to-[#3B5C9B] p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_55%)]" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/80">
              <History size={14} /> Riwayat Peminjaman
            </span>
            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
              Pantau semua aktivitas peminjaman buku digital kamu.
            </h1>
            <p className="text-sm text-white/70">
              Lihat status peminjaman, tanggal pengembalian, dan pastikan tidak melewati batas waktu yang telah ditetapkan.
            </p>
          </div>
          <div className="grid w-full max-w-sm grid-cols-3 gap-3 text-center text-sm font-medium md:max-w-md">
            <div className="rounded-2xl bg-white/10 p-4">
              <div className="text-xs uppercase tracking-wide text-white/60">Total</div>
              <div className="mt-2 text-2xl font-semibold">{stats.total}</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <div className="text-xs uppercase tracking-wide text-white/60">Dipinjam</div>
              <div className="mt-2 text-2xl font-semibold">{stats.active}</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <div className="text-xs uppercase tracking-wide text-white/60">Selesai</div>
              <div className="mt-2 text-2xl font-semibold">{stats.completed}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white/95 p-6 shadow-xl shadow-slate-900/5">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-slate-800">Ringkasan Peminjaman</h2>
          <p className="text-sm text-slate-500">
            Berikut daftar transaksi peminjaman buku digital yang pernah kamu lakukan.
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          {loading ? (
            <div className="flex items-center justify-center gap-3 p-10 text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" /> Memuat riwayat...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
              {error}
            </div>
          ) : records.length === 0 ? (
            <div className="flex flex-col items-center gap-3 p-12 text-center text-slate-500">
              <History className="h-10 w-10 text-slate-300" />
              <p>Belum ada riwayat peminjaman. Pinjam buku untuk melihat riwayat di sini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-3">No</th>
                    <th className="px-6 py-3">Judul Buku</th>
                    <th className="px-6 py-3">Tanggal Pinjam</th>
                    <th className="px-6 py-3">Tanggal Kembali</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {records.map((record, index) => (
                    <tr key={record.id} className="text-sm text-slate-600">
                      <td className="px-6 py-4 font-semibold text-slate-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">
                        {record.ebook.title}
                      </td>
                      <td className="px-6 py-4">
                        {format(new Date(record.borrowed_at), 'dd MMMM yyyy', {
                          locale: localeID,
                        })}
                      </td>
                      <td className="px-6 py-4">
                        {record.returned_at
                          ? format(new Date(record.returned_at), 'dd MMMM yyyy', {
                              locale: localeID,
                            })
                          : '-'}
                      </td>
                      <td className="px-6 py-4">{renderStatus(record.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default RiwayatPeminjaman;
