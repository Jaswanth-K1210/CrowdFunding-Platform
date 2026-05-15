import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { adminService } from "../services/adminService";
import { formatCurrency } from "../utils/formatCurrency";
import { FaUsers, FaBullhorn, FaDollarSign, FaChartBar, FaDownload } from "react-icons/fa";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentCampaigns, setRecentCampaigns] = useState([]);
  const [recentTx, setRecentTx] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminService.getDashboard(),
      adminService.getAllCampaigns(),
      adminService.getTransactions(),
    ])
      .then(([statsRes, campaignsRes, txRes]) => {
        setStats(statsRes.data);
        setRecentCampaigns(campaignsRes.data.slice(0, 5));
        setRecentTx(txRes.data.slice(0, 5));
      })
      .catch(() => toast.error("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const handleExport = async () => {
    try {
      const res = await adminService.getTransactions();
      const rows = [
        ["Donation ID", "Donor", "Campaign", "Amount", "Date"],
        ...res.data.map((t) => [
          t._id,
          `"${t.donorId?.name || ""}"`,
          `"${t.campaignId?.title || ""}"`,
          t.amount,
          new Date(t.createdAt).toLocaleDateString("en-IN"),
        ]),
      ];
      const csv = rows.map((r) => r.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Report exported!");
    } catch {
      toast.error("Export failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Users",     value: stats?.totalUsers     || 0,  icon: FaUsers,    color: "from-teal-600 to-teal-700"       },
    { label: "Total Campaigns", value: stats?.totalCampaigns || 0,  icon: FaBullhorn, color: "from-emerald-500 to-emerald-600" },
    { label: "Donations",       value: stats?.totalDonations || 0,  icon: FaDollarSign,color:"from-teal-700 to-teal-800"       },
    { label: "Revenue",         value: formatCurrency(stats?.totalMoneyRaised || 0), icon: FaChartBar, color: "from-emerald-600 to-teal-600" },
  ];

  const statusCls = {
    pending:   "bg-yellow-100 text-yellow-800",
    approved:  "bg-emerald-100 text-emerald-800",
    rejected:  "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800",
    draft:     "bg-gray-100 text-gray-600",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-800 mb-1">Dashboard</h1>
          <p className="text-gray-500">Welcome back, Admin. Here's what's happening.</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-teal-700 to-teal-800 text-white rounded-xl font-semibold text-sm hover:from-teal-800 hover:to-gray-900 shadow-md transition-all"
        >
          <FaDownload /> Export CSV
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`bg-linear-to-br ${s.color} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default`}>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Icon className="text-sm" />
                </div>
                <span className="text-xs font-medium opacity-85">{s.label}</span>
              </div>
              <div className="text-3xl font-black">{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Two column: recent campaigns + recent transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Campaigns */}
        <div className="bg-gray-50 rounded-2xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Recent Campaigns</h3>
            <Link to="/admin/campaigns" className="text-xs text-emerald-600 font-semibold hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {recentCampaigns.map((c) => (
              <div key={c._id} className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm">
                <img
                  src={c.images?.[0] || "https://placehold.co/40x40/e2e8f0/94a3b8?text=CF"}
                  alt={c.title}
                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800 truncate">{c.title}</p>
                  <p className="text-xs text-gray-400">{c.creatorId?.name}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusCls[c.status] || statusCls.draft}`}>
                  {c.status}
                </span>
              </div>
            ))}
            {recentCampaigns.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No campaigns yet.</p>}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-gray-50 rounded-2xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
            <Link to="/admin/transactions" className="text-xs text-emerald-600 font-semibold hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {recentTx.map((t) => (
              <div key={t._id} className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm">
                <div className="w-10 h-10 bg-linear-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {t.donorId?.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800 truncate">{t.donorId?.name || "Unknown"}</p>
                  <p className="text-xs text-gray-400 truncate">{t.campaignId?.title || "Campaign"}</p>
                </div>
                <span className="font-bold text-emerald-600 text-sm shrink-0">{formatCurrency(t.amount)}</span>
              </div>
            ))}
            {recentTx.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No transactions yet.</p>}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Approve Campaigns", to: "/admin/campaigns", color: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100" },
          { label: "All Transactions",  to: "/admin/transactions", color: "bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100" },
          { label: "Manage Users",      to: "/admin/users", color: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100" },
          { label: "Export Report",     onClick: handleExport, color: "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100" },
        ].map((a) =>
          a.to ? (
            <Link key={a.label} to={a.to} className={`border rounded-xl px-4 py-3 text-sm font-semibold text-center transition-colors ${a.color}`}>
              {a.label}
            </Link>
          ) : (
            <button key={a.label} onClick={a.onClick} className={`border rounded-xl px-4 py-3 text-sm font-semibold text-center transition-colors ${a.color}`}>
              {a.label}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
