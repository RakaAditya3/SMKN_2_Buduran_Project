'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/api/api";
import dayjs from "dayjs";

const EbookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState<any>(null);
  const [borrowedAt, setBorrowedAt] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [returnedAt, setReturnedAt] = useState<string>(dayjs().add(7, 'day').format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [popupData, setPopupData] = useState<any>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/ebooks/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error("Gagal ambil data");
      }
    };
    if (id) fetchBook();
  }, [id]);

  if (!book) return <p>Loading...</p>;

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const diff = dayjs(returnedAt).diff(dayjs(borrowedAt), "day");
    if (diff > 7) {
      setMessage("Maksimal peminjaman adalah 7 hari");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/books/records", {
        ebook_id: book.id,
        borrowed_at: borrowedAt,
        returned_at: returnedAt,
      });

      setPopupData({
  student_name: res.data.record.student.nama,
  ebook_title: res.data.record.ebook.title,
  borrowed_at: dayjs(res.data.record.borrowed_at).format('YYYY-MM-DD'),
  returned_at: dayjs(res.data.record.returned_at).format('YYYY-MM-DD'),
});
      setMessage("Berhasil meminjam buku!");
    } catch (err: any) {
      setMessage("Gagal meminjam buku");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <img src={book.image_url} alt={book.title} className="w-full rounded-lg shadow-md" />
      </div>

      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2 text-black">{book.title}</h1>
        <p className="text-gray-600 mb-4">{book.description}</p>

        <form onSubmit={handleBorrow} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-black">Tanggal Peminjaman</label>
            <input
              type="date"
              value={borrowedAt}
              onChange={(e) => setBorrowedAt(e.target.value)}
              className="w-full border rounded px-3 py-2 text-black"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-black">Tanggal Pengembalian</label>
            <input
              type="date"
              value={returnedAt}
              onChange={(e) => setReturnedAt(e.target.value)}
              className="w-full border rounded px-3 py-2 text-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Menyimpan..." : "Pinjam Buku"}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
      </div>

      {/* Pop-up */}
      {popupData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-black">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Detail Peminjaman</h2>
            <p><strong>Nama Siswa:</strong> {popupData.student_name}</p>
            <p><strong>Nama Buku:</strong> {popupData.ebook_title}</p>
            <p><strong>Tanggal Peminjaman:</strong> {popupData.borrowed_at}</p>
            <p><strong>Tanggal Pengembalian:</strong> {popupData.returned_at}</p>
            <p className="mt-4 text-red-600 font-semibold">
              Harap tunjukkan pop-up ini ke pihak perpustakaan saat mengambil buku.
            </p>
            <button
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => setPopupData(null)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EbookDetail;
