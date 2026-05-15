import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminService } from "../services/adminService";
import { formatCurrency } from "../utils/formatCurrency";
import { FaDownload, FaSearch } from "react-icons/fa";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");

  useEffect(() => {
    adminService.getTransactions()
      .then((res) => setTransactions(res.data))
      .catch(() => toast.error("Failed to load transactions"))
      .finally(() => setLoading(false));
  }, []);

  const exportCSV = () => {
    if (!transactions.length) { toast.error("No transactions to export"); return; }
    const rows = [
      ["Donation ID", "Donor", "Donor Email", "Campaign", "Amount (INR)", "Date", "Payment ID"],
      ...transactions.map((t) => [
        t._id,
        `"${t.donorId?.name || ""}"`,
        t.donorId?.email || "",
        `"${t.campaignId?.title || ""}"`,
        t.amount,
        new Date(t.createdAt).toLocaleDateString("en-IN"),
        t.paymentId || "",
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
    toast.success("Transactions exported!");
  };

  const filtered = transactions.filter(
    (t) =>
      t.donorId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.campaignId?.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.donorId?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = transactions.reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-800 mb-1">Transactions</h1>
          <p className="text-gray-500">
            {transactions.length} completed donations · Total:{" "}
            <span className="font-bold text-emerald-600">{formatCurrency(totalRevenue)}</span>
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-teal-700 to-teal-800 text-white rounded-xl font-semibold text-sm hover:from-teal-800 hover:to-gray-900 shadow-md transition-all"
        >
          <FaDownload /> Export CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Transactions", value: transactions.length,        color: "from-teal-600 to-teal-700" },
          { label: "Total Revenue",      value: formatCurrency(totalRevenue), color: "from-emerald-500 to-emerald-600" },
          { label: "Avg. Donation",      value: transactions.length ? formatCurrency(Math.round(totalRevenue / transactions.length)) : "₹0", color: "from-teal-700 to-teal-800" },
        ].map((s) => (
          <div key={s.label} className={`bg-linear-to-br ${s.color} text-white p-5 rounded-2xl shadow-lg`}>
            <p className="text-xs opacity-80 mb-1">{s.label}</p>
            <p className="text-2xl font-black">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="text"
          placeholder="Search by donor, email or campaign..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-gray-50"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border">
          <div className="text-5xl mb-3">💸</div>
          <p className="text-gray-500">No transactions found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Donor</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Campaign</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Date</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Payment ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-linear-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0">
                          {t.donorId?.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-gray-800">{t.donorId?.name || "Unknown"}</p>
                          <p className="text-xs text-gray-400 truncate">{t.donorId?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={t.campaignId?.images?.[0] || "https://placehold.co/32x32/e2e8f0/94a3b8?text=CF"}
                          alt=""
                          className="w-8 h-8 rounded-lg object-cover shrink-0 hidden sm:block"
                        />
                        <span className="font-medium text-sm text-gray-800 line-clamp-1 max-w-40">
                          {t.campaignId?.title || "Campaign"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-emerald-600">{formatCurrency(t.amount)}</span>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="text-sm text-gray-500">
                        {new Date(t.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-xs text-gray-400 font-mono">{t.paymentId ? t.paymentId.slice(-14) : "—"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;
