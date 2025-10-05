"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, XCircle, Loader2, User, AlertTriangle } from "lucide-react";
import api from "@/api/api";

interface ScanResult {
  uid: string;
  nama: string;
  status: "hadir" | "unknown" | "error";
  time: string;
}

export default function ScanPresensi() {
  const [scannedUIDs, setScannedUIDs] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [scannedUIDs]);

  const handleScan = async (uid: string) => {
    if (!uid) return;
    setLoading(true);

    try {
      await api.post("/admin/rfid-logs", { uid });

      const check = await api.get(`/admin/rfid/check-scan/${uid}`);

      setScannedUIDs((prev) => [
        {
          uid,
          nama: check.data?.student || "UID tidak dikenal",
          status: check.data?.status === "cached" ? "hadir" : "unknown",
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    } catch (err) {
      console.error(err);
      setScannedUIDs((prev) => [
        {
          uid,
          nama: "⚠️ Error kirim/cek server",
          status: "error",
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    } finally {
      setLoading(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const uid = (e.target as HTMLInputElement).value.trim().toUpperCase();
      handleScan(uid);
      (e.target as HTMLInputElement).value = "";
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Presensi Harian</h1>

      <input
        ref={inputRef}
        type="text"
        onKeyDown={handleKeyPress}
        className="opacity-0 absolute pointer-events-none"
        autoFocus
      />

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Hasil Scan Hari Ini</h2>

        {loading && (
          <div className="flex items-center gap-2 mb-4 text-blue-600">
            <Loader2 className="w-5 h-5 animate-spin" /> Mengirim UID...
          </div>
        )}

        <ul className="space-y-3">
          {scannedUIDs.map((item, idx) => (
            <li
              key={idx}
              className={`p-4 rounded-lg flex items-center justify-between border
                ${
                  item.status === "hadir"
                    ? "bg-green-50 border-green-200"
                    : item.status === "unknown"
                    ? "bg-red-50 border-red-200"
                    : "bg-yellow-50 border-yellow-200"
                }`}
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold">
                    {item.nama}{" "}
                    <span className="text-sm text-gray-500">({item.uid})</span>
                  </p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
              </div>
              <div>
                {item.status === "hadir" && (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                )}
                {item.status === "unknown" && (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                {item.status === "error" && (
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                )}
              </div>
            </li>
          ))}
        </ul>

        {scannedUIDs.length === 0 && (
          <p className="text-gray-500 text-center py-10">
            Belum ada kartu yang discan hari ini
          </p>
        )}
      </div>
    </div>
  );
}
