'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/api/api';

interface LoginCredentials {
  nisn: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    nisn: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/login-elibrary', credentials);

      if (res.data.success) {
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }

        setSuccess('Login berhasil! Anda akan diarahkan...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        setError(res.data.message || 'Login gagal, periksa NIS/Password!');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Login gagal, periksa NIS dan Password Anda!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{
      background: 'linear-gradient(135deg, #E3F2FD 0%, #90CAF9 30%, #42A5F5 70%, #1976D2 100%)'
    }}>
      {/* kiri */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-center">
          <img 
            src="/images/image.png" 
            alt="Reading illustration" 
            className="w-full h-auto max-w-lg mx-auto"
            style={{ 
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))',
              maxHeight: '500px',
              objectFit: 'contain'
            }}
          />
        </div>
      </div>


      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center bg-white min-h-screen">
        <div className="w-full max-w-md px-6 py-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">eLibrary SMENDA</h1>
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">
              Ingin membaca sesuatu yang baru?
            </h2>
            <p className="text-gray-600 text-lg">Login ke Platform terlebih dahulu</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mx-4">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                  {success}
                </div>
              )}


              <div className="space-y-2">
                <label htmlFor="nisn" className="block text-lg font-semibold text-gray-800">
                  NISN
                </label>
                <input
                  type="text"
                  id="nisn"
                  name="nisn"
                  value={credentials.nisn}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-blue-500 outline-none transition-all duration-200 text-gray-800 text-base bg-gray-50 focus:bg-white"
                  required
                  disabled={isLoading}
                  placeholder="Masukkan NIS Anda"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-lg font-semibold text-gray-800">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-blue-500 outline-none transition-all duration-200 text-gray-800 text-base bg-gray-50 focus:bg-white"
                  required
                  disabled={isLoading}
                  placeholder="Masukkan Password Anda"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none mt-8"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 
                        3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            {/* Back to Home Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                Kembali ke{' '}
                <a href="/" className="text-blue-500 hover:text-blue-600 font-medium underline">
                  Beranda
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;