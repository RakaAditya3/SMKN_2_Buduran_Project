'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, BookOpen, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
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
          localStorage.setItem('student_token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }

        setSuccess('Login berhasil! Anda akan diarahkan...');
        setTimeout(() => {
          router.push('/Pages/eLibrary/Dashboard');
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
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#e9f0ff]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(63,99,173,0.18),_transparent_55%)]" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[#1F2A44]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-[#3B5C9B]/10 blur-3xl" />

      <div className="relative z-10 flex flex-1 flex-col lg:flex-row">
        <section className="flex w-full flex-1 flex-col justify-between bg-gradient-to-br from-[#1F2A44] via-[#233459] to-[#3B5C9B] px-8 pb-10 pt-14 text-white shadow-2xl lg:max-w-[52%] lg:rounded-r-[3rem] lg:px-14">
          <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.35em] text-white/70">
            <Sparkles size={18} className="text-[#94C5FF]" />
            <span>Selamat Datang di eLibrary</span>
          </div>

          <div className="mt-10 space-y-6">
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Kumpulan inspirasi digital untuk generasi SMENDA yang siap berkarya.
            </h1>
            <p className="max-w-xl text-base text-white/80 md:text-lg">
              Akses ratusan buku digital, pelajari hal baru, dan kembangkan kreativitasmu kapan pun dari perangkat apa pun. Mulai perjalanan membaca yang lebih seru hanya dengan sekali login.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-white/10 p-5 shadow-lg shadow-black/10 backdrop-blur">
              <div className="flex items-center gap-3 text-sm font-semibold text-white/90">
                <BookOpen className="h-9 w-9 rounded-2xl bg-white/15 p-2" />
                Koleksi Kurasi Guru
              </div>
              <p className="mt-3 text-sm text-white/75">
                Buku pilihan dengan kurasi guru dan alumni, siap menemani proses belajar mandiri.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5 shadow-lg shadow-black/10 backdrop-blur">
              <div className="flex items-center gap-3 text-sm font-semibold text-white/90">
                <ShieldCheck className="h-9 w-9 rounded-2xl bg-white/15 p-2" />
                Akses Aman & Mudah
              </div>
              <p className="mt-3 text-sm text-white/75">
                Terintegrasi dengan akun siswa SMENDA. Masuk dengan NISN dan jelajahi kapan saja.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4 text-sm text-white/80">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
              <span className="text-lg font-semibold text-white">350+</span>
              <span>Koleksi Digital</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
              <span className="text-lg font-semibold text-white">24/7</span>
              <span>Akses Tanpa Batas</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
              <span className="text-lg font-semibold text-white">100%</span>
              <span>Gratis untuk Siswa</span>
            </div>
          </div>
        </section>

        <section className="flex w-full flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-md rounded-[32px] border border-white/60 bg-white/90 p-8 shadow-2xl shadow-[#1F2A44]/15 backdrop-blur">
            <div className="flex flex-col items-start gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#E7ECF5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#1F2A44]">
                <Sparkles size={14} /> SMKN 2 Buduran
              </span>
              <h2 className="text-3xl font-semibold text-[#1F2A44]">
                Masuk ke eLibrary Siswa
              </h2>
              <p className="text-sm text-slate-500">
                Gunakan NISN dan password yang terdaftar untuk melanjutkan eksplorasi bacaan digital.
              </p>
            </div>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  {success}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="nisn" className="text-sm font-semibold text-[#1F2A44]">
                  NISN
                </label>
                <input
                  type="text"
                  id="nisn"
                  name="nisn"
                  value={credentials.nisn}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#3B5C9B] focus:bg-white focus:ring-2 focus:ring-[#3B5C9B]/20"
                  required
                  disabled={isLoading}
                  placeholder="Masukkan NISN kamu"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-[#1F2A44]">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#3B5C9B] focus:bg-white focus:ring-2 focus:ring-[#3B5C9B]/20"
                  required
                  disabled={isLoading}
                  placeholder="Masukkan password akun"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1F2A44] to-[#3B5C9B] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1F2A44]/35 transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sedang memproses...
                  </>
                ) : (
                  <>
                    Masuk Sekarang
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 flex flex-col gap-3 text-sm text-slate-500">
              <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600">
                <ShieldCheck size={16} className="text-[#3B5C9B]" />
                Kerahasiaan akunmu dijaga dengan protokol keamanan sekolah.
              </div>

              <p className="text-xs text-slate-500">
                Butuh bantuan? Hubungi petugas perpustakaan untuk reset akun.
              </p>

              <p className="text-xs text-slate-500">
                Kembali ke{' '}
                <Link href="/" className="font-semibold text-[#1F2A44] underline underline-offset-4">
                  halaman utama sekolah
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;