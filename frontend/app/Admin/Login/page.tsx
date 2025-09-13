'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import api from '@/api/api';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      setSuccess("Login berhasil! Anda akan diarahkan...");

      setTimeout(() => {
        window.location.href = "/Admin/Dashboard";
      }, 1000);

    } catch (err: any) {
      setError("Login gagal, periksa Email dan Password Anda !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="max-w-sm w-full space-y-8">
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-gray-900">Admin Dashboard</span>
          </div>

          {/* Notifikasi */}
          {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}
          {success && <div className="p-3 bg-green-100 text-green-700 rounded">{success}</div>}

          {/* Sign In Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600 mb-8">Enter your email and password to sign in!</p>

            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-black"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-black"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="keep-logged-in"
                    name="keep-logged-in"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={keepLoggedIn}
                    onChange={(e) => setKeepLoggedIn(e.target.checked)}
                  />
                  <label htmlFor="keep-logged-in" className="ml-2 block text-sm text-gray-700">
                    Keep me signed in
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Sign In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Sisi Kanan */}
      <div className="hidden lg:block lg:flex-1 bg-gradient-to-br from-blue-600 to-blue-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-800"></div>
        <div className="relative z-10 flex flex-col justify-center items-center h-full p-12">
          <img src="/images/LogoSMK.png" alt="" className='w-100'/>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
