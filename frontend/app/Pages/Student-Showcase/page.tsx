"use client";

import { useEffect, useState } from "react";
import ShowcaseCard, { Showcase } from "@/app/Components/ShowcaseCard";
import api from "@/api/api";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import Navbar from '@/app/Components/Navbar'
import Footer from '@/app/Components/Footer'

export default function ShowcasePage() {
  const [showcases, setShowcases] = useState<Showcase[]>([]);
  const [filtered, setFiltered] = useState<Showcase[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedMajor, setSelectedMajor] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const classes = ["X", "XI", "XII"];
  const majors = ["RPL", "BD", "AK", "LPB", "MP", "DKV"];

  useEffect(() => {
    const fetchShowcases = async () => {
      try {
        setLoading(true);
        const res = await api.get("/student-showcase");
        const data = res.data.data || res.data;
        setShowcases(data);
        setFiltered(data);
      } catch (err: any) {
        console.error("❌ Gagal memuat showcase:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShowcases();
  }, []);

  useEffect(() => {
    let data = [...showcases];

    if (selectedClass) {
      data = data.filter(
        (item) =>
          item.student_class?.toUpperCase() === selectedClass.toUpperCase()
      );
    }

    if (selectedMajor) {
      data = data.filter(
        (item) =>
          item.student_major?.toUpperCase() === selectedMajor.toUpperCase()
      );
    }

    setFiltered(data);
  }, [selectedClass, selectedMajor, showcases]);

  const handleReset = () => {
    setSelectedClass("");
    setSelectedMajor("");
  };

  return (
    <>
    <Navbar />
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-6 md:px-12 pt-40">
      <motion.h1
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center text-gray-800 mb-10"
      >
         Student Showcase
      </motion.h1>

      {/* Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/70 backdrop-blur-md border border-gray-200 shadow-sm rounded-xl p-5 md:p-6 mb-10 max-w-3xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        {/* Select Fields */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
          <div className="flex flex-col w-full md:w-1/2">
            <label className="text-sm text-gray-600 mb-1 font-medium">
              Pilih Kelas
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="">Semua Kelas</option>
              {classes.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-full md:w-1/2">
            <label className="text-sm text-gray-600 mb-1 font-medium">
              Pilih Jurusan
            </label>
            <select
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            >
              <option value="">Semua Jurusan</option>
              {majors.map((mj) => (
                <option key={mj} value={mj}>
                  {mj}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg transition-all"
        >
          Reset
        </button>
      </motion.div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center mt-24 text-gray-500">
          <Loader2 size={32} className="animate-spin mb-3 text-gray-600" />
          <p>Memuat data karya siswa...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filtered.map((showcase) => (
                <motion.div
                  key={showcase.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <ShowcaseCard showcase={showcase} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 mt-20"
            >
              Tidak ada karya yang cocok dengan filter.
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </main>
    <Footer />
    </>
  );
}
