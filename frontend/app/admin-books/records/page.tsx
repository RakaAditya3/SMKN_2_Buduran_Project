'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';

interface Record {
    id: number;
    user_name: string;
    nisn: string;
    ebook: {
        id: number;
        title: string;
        description: string;
    };
    borrowed_at: string;
    returned_at: string | null;
    status: string;
}

export default function RecordsPage() {
    const [records, setRecords] = useState<Record[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterDate, setFilterDate] = useState('');
    const [filterType, setFilterType] = useState<'specific' | 'before'>('specific');

    const fetchRecords = async () => {
        try {
            const params = new URLSearchParams();
            if (filterDate) {
                params.append('date', filterDate);
                params.append('filter_type', filterType);
            }

            const response = await fetch(`http://127.0.0.1:8000/api/admin-books/records?${params}`);
            if (response.ok) {
                const data = await response.json();
                setRecords(data);
            }
        } catch (error) {
            console.error('Error fetching records:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, [filterDate, filterType]);

    const handleFilter = () => {
        setLoading(true);
        fetchRecords();
    };

    const clearFilter = () => {
        setFilterDate('');
        setFilterType('specific');
        setLoading(true);
        fetchRecords();
    };

    const handleStatusUpdate = async (recordId: number, status: string) => {
        try {
            const updateData: any = { status };

            if (status === 'Dikembalikan') {
                updateData.returned_at = new Date().toISOString().split('T')[0];
            }

            const response = await fetch(`http://127.0.0.1:8000/api/admin-books/records/${recordId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                alert(`Status berhasil diubah menjadi ${status}`);
                fetchRecords(); // Refresh the records
            } else {
                const errorData = await response.json();
                alert(`Gagal mengubah status: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Terjadi kesalahan saat mengubah status');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Records Peminjaman Buku</h1>

                {/* Filter Section */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-semibold mb-4">Filter Records</h2>
                    <div className="flex flex-wrap gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tanggal Pinjam
                            </label>
                            <input
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipe Filter
                            </label>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as 'specific' | 'before')}
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="specific">Hari Tertentu</option>
                                <option value="before">Sebelum Tanggal</option>
                            </select>
                        </div>
                        <button
                            onClick={handleFilter}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Filter
                        </button>
                        <button
                            onClick={clearFilter}
                            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Clear Filter
                        </button>
                    </div>
                </div>

                {/* Records Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading records...</p>
                        </div>
                    ) : records.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-600">Tidak ada records ditemukan.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nama Pengguna
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            NISN
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Judul Buku
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tanggal Pinjam
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tanggal Kembali
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {records.map((record) => (
                                        <tr key={record.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {record.user_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {record.nisn}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {record.ebook.title}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(record.borrowed_at).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {record.returned_at
                                                    ? new Date(record.returned_at).toLocaleDateString('id-ID')
                                                    : '-'
                                                }
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${record.status === 'Dikembalikan' ? 'bg-green-100 text-green-800' :
                                                        record.status === 'Hilang' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {record.status}
                                                </span>
                                                {record.status === 'Dipinjam' && (
                                                    <div className="mt-2 flex gap-2">
                                                        <button
                                                            onClick={() => handleStatusUpdate(record.id, 'Dikembalikan')}
                                                            className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-xs"
                                                        >
                                                            Sudah Dikembalikan
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(record.id, 'Hilang')}
                                                            className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-xs"
                                                        >
                                                            Dihilangkan
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
