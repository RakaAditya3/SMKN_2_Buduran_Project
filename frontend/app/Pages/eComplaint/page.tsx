"use client";

import { useState } from "react";
import { Send, Search, CheckCircle2, Clock, Mail, MessageSquare, Ticket } from "lucide-react";
import api from "@/api/api";
import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";

export default function EComplaintPage() {
  const [activeTab, setActiveTab] = useState<"submit" | "status">("submit");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [ticket, setTicket] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ticketSearch, setTicketSearch] = useState("");
  const [statusData, setStatusData] = useState<any>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTicket(null);

    try {
      const res = await api.post("/complaints", { email, message });
      setTicket(res.data.ticket_number);
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
      alert("❌ Gagal mengirim pengaduan, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingStatus(true);
    setStatusData(null);

    try {
      const res = await api.get(`/complaints/${ticketSearch}`);
      setStatusData(res.data);
    } catch (err) {
      console.error(err);
      alert("❌ Tiket tidak ditemukan!");
    } finally {
      setLoadingStatus(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 mt-25">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">E-Complaint System</h1>
          <p className="text-gray-600">Laporkan keluhan Anda dengan mudah dan cepat</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-2 border-b border-gray-100">
            <div className="flex gap-2 max-w-md mx-auto">
              <button
                onClick={() => setActiveTab("submit")}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === "submit"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-gray-600 hover:bg-white hover:text-gray-900"
                }`}
              >
                <Send className="w-4 h-4" />
                Kirim Pengaduan
              </button>
              <button
                onClick={() => setActiveTab("status")}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === "status"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-gray-600 hover:bg-white hover:text-gray-900"
                }`}
              >
                <Search className="w-4 h-4" />
                Cek Status
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8">
            {/* TAB 1: Submit Complaint */}
            {activeTab === "submit" && (
              <div className="animate-fadeIn">
                <form onSubmit={handleSubmitComplaint} className="space-y-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Mail className="w-4 h-4 text-blue-600" />
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      Detail Pengaduan
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
                      placeholder="Jelaskan keluhan Anda secara detail..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Kirim Pengaduan
                      </>
                    )}
                  </button>
                </form>

                {ticket && (
                  <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-green-900 mb-1">
                          Pengaduan Berhasil Dikirim!
                        </h3>
                        <p className="text-sm text-green-700 mb-3">
                          Kami telah menerima pengaduan Anda dan akan segera memprosesnya.
                        </p>
                        <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-green-200">
                          <Ticket className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium text-gray-700">Nomor Tiket:</span>
                          <code className="text-lg font-bold text-green-700 font-mono">{ticket}</code>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Check Status */}
            {activeTab === "status" && (
              <div className="animate-fadeIn">
                <form onSubmit={handleCheckStatus} className="space-y-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Ticket className="w-4 h-4 text-blue-600" />
                      Nomor Tiket
                    </label>
                    <input
                      type="text"
                      value={ticketSearch}
                      onChange={(e) => setTicketSearch(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-mono text-lg"
                      placeholder="Masukkan 10 digit nomor tiket"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loadingStatus}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 flex items-center justify-center gap-2"
                  >
                    {loadingStatus ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Mencari...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        Cek Status Tiket
                      </>
                    )}
                  </button>
                </form>

                {statusData && (
                  <div className="mt-6 bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl border-2 border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Ticket className="w-5 h-5" />
                        Informasi Pengaduan
                      </h3>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Nomor Tiket</p>
                          <code className="text-xl font-bold text-gray-900 font-mono">
                            {statusData.ticket_number}
                          </code>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Status</p>
                          <span
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                              statusData.status === "selesai"
                                ? "bg-green-100 text-green-700 border-2 border-green-300"
                                : "bg-amber-100 text-amber-700 border-2 border-amber-300"
                            }`}
                          >
                            {statusData.status === "selesai" ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <Clock className="w-4 h-4" />
                            )}
                            {statusData.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Keterangan:</p>
                        <p className="text-gray-600 leading-relaxed bg-white p-4 rounded-xl border border-gray-200">
                          {statusData.description || "Belum ada keterangan tambahan."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}