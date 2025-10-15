"use client";

import { useEffect, useState, FormEvent } from "react";
import api from "@/api/api";
import {
  Search,
  Loader2,
  Filter,
  ClipboardList,
  Hourglass,
  CheckSquare,
  Edit3,
  CheckCircle,
  X,
} from "lucide-react";

interface Complaint {
  id: number;
  ticket_number: string;
  email: string;
  message: string;
  status: string;
  admin_note?: string;
  created_at: string;
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // modal states
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [status, setStatus] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [saving, setSaving] = useState(false);

  // Statistik
  const [stats, setStats] = useState({
    total: 0,
    proses: 0,
    selesai: 0,
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/complaints");
      const data = res.data;
      setComplaints(data);

      setStats({
        total: data.length,
        proses: data.filter((c: Complaint) => c.status === "Diproses").length,
        selesai: data.filter((c: Complaint) => c.status === "Selesai").length,
      });
    } catch (error) {
      console.error("❌ Gagal memuat complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter
  const filteredComplaints = complaints.filter(
    (c) =>
      (statusFilter === "All Status" || c.status === statusFilter) &&
      (c.message.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()))
  );

  // Update handler
  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setSaving(true);

    try {
      const res = await api.put(`/admin/complaints/${selectedComplaint.id}`, {
        status,
        admin_note: adminNote,
      });
      alert("✅ " + res.data.data.status + " | Status berhasil diperbarui!");
      fetchComplaints();
      setSelectedComplaint(null);
    } catch (err) {
      alert("❌ Gagal memperbarui status pengaduan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-semibold">Complaints Dashboard</h1>

      {/* ====== STATS CARDS ====== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Complaint"
          value={stats.total}
          subtitle="Total seluruh complaint"
          icon={<ClipboardList size={24} />}
        />
        <StatCard
          title="Sedang Proses"
          value={stats.proses}
          subtitle="Complaint yang sedang diproses"
          icon={<Hourglass size={24} />}
        />
        <StatCard
          title="Selesai"
          value={stats.selesai}
          subtitle="Complaint yang sudah selesai"
          icon={<CheckSquare size={24} />}
        />
      </div>

      {/* ====== FILTER BAR ====== */}
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="text-gray-500" size={18} />
            <span className="font-semibold">Filters</span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search Complaint..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded-lg pl-9 pr-3 py-2 w-full text-sm focus:ring focus:ring-blue-100"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option>All Status</option>
              <option>Ditinjau</option>
              <option>Diproses</option>
              <option>Selesai</option>
            </select>
          </div>
        </div>
      </div>

      {/* ====== TABLE LIST ====== */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="p-2">Ticket</th>
              <th className="p-2">Complaint</th>
              <th className="p-2">Email</th>
              <th className="p-2">Status</th>
              <th className="p-2">Created</th>
              <th className="p-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">
                  <Loader2 className="animate-spin inline-block mr-2" />
                  Loading data...
                </td>
              </tr>
            ) : filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">
                  No complaints found.
                </td>
              </tr>
            ) : (
              filteredComplaints.map((c) => (
                <tr
                  key={c.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-2 font-mono text-blue-600 text-xs font-semibold">
                    #{c.ticket_number}
                  </td>
                  <td className="p-2">
                    <div className="font-semibold text-gray-800">
                      {c.message.split(" ")[0] || "Complaint"}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {c.message.slice(0, 60)}...
                    </div>
                  </td>
                  <td className="p-2 text-gray-700">{c.email}</td>
                  <td className="p-2">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="p-2 text-gray-600 text-xs">
                    {new Date(c.created_at).toISOString().split("T")[0]}
                  </td>
                  <td className="p-2 text-right">
                    <button
                      onClick={() => {
                        setSelectedComplaint(c);
                        setStatus(c.status || "Ditinjau");
                        setAdminNote(c.admin_note || "");
                      }}
                      className="text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <Edit3 size={16} /> Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ====== EDIT MODAL ====== */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
            <h3 className="text-xl font-semibold mb-4">Edit Complaint</h3>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Ticket Number</label>
                <p className="font-mono text-gray-800">{selectedComplaint.ticket_number}</p>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <p className="text-gray-800">{selectedComplaint.email}</p>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border rounded-lg p-2 w-full"
                >
                  <option value="Ditinjau">Ditinjau</option>
                  <option value="Diproses">Diproses</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Admin Note</label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={3}
                  className="border rounded-lg p-2 w-full"
                  placeholder="Tambahkan catatan..."
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 flex items-center gap-2"
                >
                  <X size={16} /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== COMPONENTS =====
function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5 flex items-center gap-4">
      <div className="p-3 bg-gray-100 rounded-lg text-gray-600">{icon}</div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold">{value}</p>
        <span className="text-xs text-gray-400">{subtitle}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "Selesai"
      ? "bg-green-100 text-green-700"
      : status === "Diproses"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-gray-100 text-gray-700";
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-md ${color}`}
    >
      {status || "Ditinjau"}
    </span>
  );
}
