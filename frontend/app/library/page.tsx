'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface EBook {
    id: number;
    title: string;
    description: string;
    image_path: string | null;
    created_at: string;
    updated_at: string;
}

const LibraryPage: React.FC = () => {
    const [ebooks, setEbooks] = useState<EBook[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            router.push('/login');
            return;
        }

        fetch('http://127.0.0.1:8000/api/ebooks')
            .then((res) => res.json())
            .then((data) => {
                setEbooks(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [router]);

    const handleBorrow = async (ebookId: number, ebookTitle: string) => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            alert('User not logged in');
            return;
        }

        const user = JSON.parse(userData);
        const borrowData = {
            user_name: user.name,
            nisn: user.nisn,
            ebook_id: ebookId,
            borrowed_at: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/admin-books/records', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(borrowData),
            });

            if (response.ok) {
                alert(`Buku "${ebookTitle}" berhasil dipinjam!`);
            } else {
                const errorData = await response.json();
                alert(`Gagal meminjam buku: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error borrowing book:', error);
            alert('Terjadi kesalahan saat meminjam buku');
        }
    };

    if (loading) {
        return <div className="p-4 text-center">Loading eLibrary...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">eLibrary</h1>
            {ebooks.length === 0 ? (
                <p>No ebooks found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {ebooks.map((ebook) => (
                        <div key={ebook.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow">
                            {ebook.image_path ? (
                                <img
                                    src={`http://127.0.0.1:8000/storage/${ebook.image_path}`}
                                    alt={ebook.title}
                                    className="w-full h-48 object-cover rounded-md mb-4"
                                />
                            ) : (
                                <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center text-gray-500">
                                    No Image
                                </div>
                            )}
                            <h2 className="text-xl font-semibold mb-2">{ebook.title}</h2>
                            <p className="text-gray-700">{ebook.description}</p>
                            <button
                                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                                onClick={() => handleBorrow(ebook.id, ebook.title)}
                            >
                                Pinjam Buku
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LibraryPage;
