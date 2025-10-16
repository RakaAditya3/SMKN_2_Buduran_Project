'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import dayjs from 'dayjs';
import { Calendar, CalendarCheck, Loader2, NotebookPen } from 'lucide-react';
import api from '@/api/api';
import { resolveLocalProxyImage } from "@/lib/resolveImageUrl";

interface Ebook {
  id: number;
  title: string;
  description: string;
  image_path?: string | null;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface BorrowPopupData {
  student_name: string;
  ebook_title: string;
  borrowed_at: string;
  returned_at: string;
}

const EbookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [fetching, setFetching] = useState(true);
  const [borrowedAt, setBorrowedAt] = useState(dayjs().format('YYYY-MM-DD'));
  const [returnedAt, setReturnedAt] = useState(dayjs().add(7, 'day').format('YYYY-MM-DD'));
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [popupData, setPopupData] = useState<BorrowPopupData | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      setFetching(true);
      try {
        const response = await api.get(`/ebooks/${id}`);
        if (response.data?.data) {
          console.debug('EBook detail data', {
            image_url: response.data.data.image_url,
            image_path: response.data.data.image_path,
          });
        }
        setEbook(response.data?.data ?? null);
      } catch (err) {
        setFeedback({ type: 'error', message: 'Gagal memuat detail buku. Silakan coba lagi.' });
      } finally {
        setFetching(false);
      }
    };

    fetchBook();
  }, [id]);

  const maxReturnDate = useMemo(() => dayjs(borrowedAt).add(7, 'day').format('YYYY-MM-DD'), [borrowedAt]);

  const handleBorrow = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ebook) return;

    setIsBorrowing(true);
    setFeedback(null);

    const diff = dayjs(returnedAt).diff(dayjs(borrowedAt), 'day');
    if (diff > 7) {
      setFeedback({ type: 'error', message: 'Maksimal peminjaman adalah 7 hari.' });
      setIsBorrowing(false);
      return;
    }

    try {
      const response = await api.post('/books/records', {
        ebook_id: ebook.id,
        borrowed_at: borrowedAt,
        returned_at: returnedAt,
      });

      const record = response.data?.record;

      setPopupData({
        student_name: record?.student?.nama ?? 'Tidak diketahui',
        ebook_title: record?.ebook?.title ?? ebook.title,
        borrowed_at: dayjs(record?.borrowed_at ?? borrowedAt).format('DD MMMM YYYY'),
        returned_at: dayjs(record?.returned_at ?? returnedAt).format('DD MMMM YYYY'),
      });

      setFeedback({ type: 'success', message: 'Berhasil meminjam buku. Tunjukkan bukti ini di perpustakaan.' });
    } catch (err) {
      setFeedback({ type: 'error', message: 'Gagal memproses peminjaman. Pastikan koneksi stabil dan coba lagi.' });
    } finally {
      setIsBorrowing(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-80 items-center justify-center rounded-3xl border border-slate-200 bg-white/80 text-slate-500">
        <Loader2 className="mr-3 h-5 w-5 animate-spin" /> Memuat detail buku...
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-600">
        Data buku tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-900/5">
        <div className="relative h-72 w-full overflow-hidden bg-slate-100">
          <img
           src={resolveLocalProxyImage(ebook.image_path ?? ebook.image_url ?? null)}
            alt={ebook.title}
            loading="lazy"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-slate-700 shadow-lg">
            <NotebookPen size={16} className="text-[#3B5C9B]" />
            <span>Detail Buku Digital</span>
          </div>
        </div>

        <div className="space-y-4 p-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-slate-900">{ebook.title}</h1>
            <p className="text-sm text-slate-500">
              {ebook.description || 'Deskripsi belum tersedia untuk buku ini.'}
            </p>
          </div>

          <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-700">Tanggal Terbit</span>
              <span>{dayjs(ebook.created_at ?? new Date()).format('DD MMMM YYYY')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-700">Terakhir Diperbarui</span>
              <span>{dayjs(ebook.updated_at ?? ebook.created_at ?? new Date()).format('DD MMMM YYYY')}</span>
            </div>
          </div>

          {feedback && (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${
                feedback.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-red-200 bg-red-50 text-red-600'
              }`}
            >
              {feedback.message}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <form
          onSubmit={handleBorrow}
          className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-xl shadow-slate-900/5"
        >
          <h2 className="text-lg font-semibold text-slate-800">Form Peminjaman</h2>
          <p className="text-sm text-slate-500">
            Isi tanggal peminjaman dan pengembalian. Durasi maksimal peminjaman adalah 7 hari.
          </p>

          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Tanggal Peminjaman
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                <Calendar size={18} className="text-[#3B5C9B]" />
                <input
                  type="date"
                  value={borrowedAt}
                  onChange={(event) => setBorrowedAt(event.target.value)}
                  className="w-full bg-transparent text-sm text-slate-700 outline-none"
                />
              </div>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Tanggal Pengembalian (maks. {maxReturnDate})
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                <CalendarCheck size={18} className="text-[#3B5C9B]" />
                <input
                  type="date"
                  value={returnedAt}
                  min={borrowedAt}
                  max={maxReturnDate}
                  onChange={(event) => setReturnedAt(event.target.value)}
                  className="w-full bg-transparent text-sm text-slate-700 outline-none"
                />
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={isBorrowing}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#1F2A44] to-[#3B5C9B] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1F2A44]/30 transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isBorrowing ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Memproses...
              </span>
            ) : (
              'Pinjam Buku Sekarang'
            )}
          </button>
        </form>

        {popupData && (
          <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-xl shadow-slate-900/5">
            <h3 className="text-lg font-semibold text-slate-800">Detail Peminjaman</h3>
            <p className="mt-1 text-sm text-slate-500">
              Simpan informasi ini dan tunjukkan kepada petugas perpustakaan saat mengambil buku.
            </p>
            <dl className="mt-5 space-y-3 text-sm text-slate-600">
              <div className="flex justify-between">
                <dt className="font-medium text-slate-700">Nama Siswa</dt>
                <dd>{popupData.student_name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-slate-700">Judul Buku</dt>
                <dd>{popupData.ebook_title}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-slate-700">Tanggal Pinjam</dt>
                <dd>{popupData.borrowed_at}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-slate-700">Tanggal Kembali</dt>
                <dd>{popupData.returned_at}</dd>
              </div>
            </dl>
            <button
              type="button"
              className="mt-5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              onClick={() => setPopupData(null)}
            >
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EbookDetail;
