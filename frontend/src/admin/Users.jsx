import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminService } from "../services/adminService";
import { formatCurrency } from "../utils/formatCurrency";
import {
  FaChevronDown, FaChevronUp, FaBullhorn,
  FaExchangeAlt, FaSearch, FaDownload,
} from "react-icons/fa";

const STATUS_CLS = {
  pending:   "bg-yellow-100 text-yellow-800",
  approved:  "bg-emerald-100 text-emerald-800",
  rejected:  "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
  draft:     "bg-gray-100 text-gray-600",
};

// ─── User Detail Panel (inline expand) ───────────────────────────────────────
function UserDetailPanel({ userId }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState("campaigns");

  useEffect(() => {
    adminService.getUserDetails(userId)
      .then((res) => setData(res.data))
      .catch(() => toast.error("Failed to load user details"))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="py-8 flex justify-center">
        <div className="w-7 h-7 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { campaigns = [], donations = [] } = data || {};
  const totalRaised  = campaigns.reduce((s, c) => s + (c.raisedAmount || 0), 0);
  const totalDonated = donations.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="border-t bg-gray-50">
      {/* Mini stats */}
      <div className="grid grid-cols-4 divide-x border-b bg-white text-center text-sm">
        {[
          { label: "Campaigns",    value: campaigns.length },
          { label: "Total Raised", value: formatCurrency(totalRaised) },
          { label: "Donations",    value: donations.length },
          { label: "Total Donated",value: formatCurrency(totalDonated) },
        ].map((s) => (
          <div key={s.label} className="py-3 px-4">
            <p className="font-black text-gray-800 text-base">{s.value}</p>
            <p className="text-xs text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 p-3 border-b bg-white">
        <button
          onClick={() => setTab("campaigns")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            tab === "campaigns" ? "bg-emerald-600 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <FaBullhorn /> Campaigns ({campaigns.length})
        </button>
        <button
          onClick={() => setTab("donations")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            tab === "donations" ? "bg-teal-700 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <FaExchangeAlt /> Donations ({donations.length})
        </button>
      </div>

      {/* Campaigns sub-tab */}
      {tab === "campaigns" && (
        campaigns.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-6">No campaigns created.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Campaign</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Goal</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Raised</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Donors</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Deadline</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {campaigns.map((c) => (
                  <tr key={c._id} className="hover:bg-white">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={c.images?.[0] || "https://placehold.co/32x32/e2e8f0/94a3b8?text=CF"}
                          alt=""
                          className="w-8 h-8 rounded-lg object-cover shrink-0"
                        />
                        <span className="font-medium text-gray-800 line-clamp-1 max-w-40">{c.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{formatCurrency(c.goalAmount)}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">{formatCurrency(c.raisedAmount || 0)}</td>
                    <td className="px-4 py-3 text-gray-600">{c.donorCount || 0}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(c.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_CLS[c.status] || STATUS_CLS.draft}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Donations sub-tab */}
      {tab === "donations" && (
        donations.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-6">No donations made.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Campaign</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Amount</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Date</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Payment ID</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {donations.map((d) => (
                  <tr key={d._id} className="hover:bg-white">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={d.campaignId?.images?.[0] || "https://placehold.co/32x32/e2e8f0/94a3b8?text=CF"}
                          alt=""
                          className="w-8 h-8 rounded-lg object-cover shrink-0"
                        />
                        <span className="font-medium text-gray-800 line-clamp-1 max-w-40">{d.campaignId?.title || "Campaign"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-600">{formatCurrency(d.amount)}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(d.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{d.paymentId ? d.paymentId.slice(-12) : "—"}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-40"><span className="line-clamp-1">{d.message || "—"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function Users() {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllUsers();
      setUsers(res.data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const exportCSV = () => {
    if (!users.length) { toast.error("No users to export"); return; }
    const rows = [
      ["ID", "Name", "Email", "Role", "Campaigns Created", "Total Raised", "Total Donated", "Joined"],
      ...users.map((u) => [
        u._id,
        `"${u.name}"`,
        u.email,
        u.role,
        u.stats?.campaignsCreated || 0,
        u.stats?.totalRaised || 0,
        u.stats?.totalDonated || 0,
        new Date(u.createdAt).toLocaleDateString("en-IN"),
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Users exported!");
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-800 mb-1">Users</h1>
          <p className="text-gray-500">{users.length} registered users.</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-teal-700 to-teal-800 text-white rounded-xl font-semibold text-sm hover:from-teal-800 hover:to-gray-900 shadow-md transition-all"
        >
          <FaDownload /> Export CSV
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3 max-w-md">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-gray-50"
          />
        </div>
      </form>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border">
          <div className="text-5xl mb-3">👥</div>
          <p className="text-gray-500">No users found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Role</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Campaigns</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Total Raised</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Total Donated</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase hidden xl:table-cell">Joined</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const isExpanded = expandedId === u._id;
                return (
                  <>
                    <tr key={u._id} className={`border-t hover:bg-gray-50 transition-colors ${isExpanded ? "bg-gray-50" : ""}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-linear-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-black shrink-0">
                            {u.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-800 text-sm">{u.name}</p>
                            <p className="text-xs text-gray-400 truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          u.role === "admin" ? "bg-teal-100 text-teal-800" : "bg-gray-100 text-gray-700"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700 font-medium hidden sm:table-cell">
                        {u.stats?.campaignsCreated || 0}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-emerald-600 hidden lg:table-cell">
                        {formatCurrency(u.stats?.totalRaised || 0)}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 hidden lg:table-cell">
                        {formatCurrency(u.stats?.totalDonated || 0)}
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-400 hidden xl:table-cell">
                        {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : u._id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                            isExpanded
                              ? "bg-teal-700 text-white border-teal-700"
                              : "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100"
                          }`}
                        >
                          {isExpanded ? <FaChevronUp className="text-[9px]" /> : <FaChevronDown className="text-[9px]" />}
                          {isExpanded ? "Hide" : "View"}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${u._id}-detail`}>
                        <td colSpan={7} className="p-0">
                          <UserDetailPanel userId={u._id} />
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Users;
