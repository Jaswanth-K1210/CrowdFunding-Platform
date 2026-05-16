import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { campaignService } from "../services/campaignService";
import { donationService } from "../services/donationService";
import { useAuth } from "../store/authStore";
import { formatCurrency } from "../utils/formatCurrency";
import {
  FaChartLine, FaBullhorn, FaExchangeAlt, FaFileDownload,
  FaEdit, FaTrash, FaEye, FaDownload, FaSignOutAlt,
  FaTimes, FaCheckCircle, FaClock, FaTimesCircle,
  FaChevronDown, FaChevronUp, FaPlus, FaUsers,
} from "react-icons/fa";

const TABS = [
  { id: "overview",   label: "Overview",      icon: FaChartLine },
  { id: "campaigns",  label: "My Campaigns",  icon: FaBullhorn },
  { id: "donations",  label: "Transactions",  icon: FaExchangeAlt },
  { id: "report",     label: "Report",        icon: FaFileDownload },
];

const CATEGORIES = [
  "education", "medical", "animals", "business",
  "ngo", "community", "emergency", "technology",
];

const statusConfig = {
  approved:  { label: "Approved",  icon: FaCheckCircle, cls: "bg-emerald-100 text-emerald-700" },
  pending:   { label: "Pending",   icon: FaClock,       cls: "bg-yellow-100 text-yellow-700" },
  rejected:  { label: "Rejected",  icon: FaTimesCircle, cls: "bg-red-100 text-red-700" },
  draft:     { label: "Draft",     icon: FaClock,       cls: "bg-gray-100 text-gray-600" },
  completed: { label: "Completed", icon: FaCheckCircle, cls: "bg-blue-100 text-blue-700" },
};

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.draft;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.cls}`}>
      <Icon className="text-[10px]" />{cfg.label}
    </span>
  );
}

function MiniProgressBar({ raised, goal }) {
  const pct = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
      <div className="h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({ campaign, onClose, onSave }) {
  const [form, setForm] = useState({
    title:       campaign.title || "",
    description: campaign.description || "",
    category:    campaign.category || "medical",
    goalAmount:  campaign.goalAmount || "",
    location:    campaign.location || "",
    deadline:    campaign.deadline ? campaign.deadline.split("T")[0] : "",
  });
  // existing URLs from Cloudinary — user can remove them
  const [existingImages,    setExistingImages]    = useState(campaign.images    || []);
  const [existingDocuments, setExistingDocuments] = useState(campaign.documents || []);
  // newly picked local files
  const [newImages,    setNewImages]    = useState([]);
  const [newDocuments, setNewDocuments] = useState([]);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(campaign._id, {
        ...form,
        goalAmount: Number(form.goalAmount),
        existingImages,
        existingDocuments,
        newImages,
        newDocuments,
      });
      toast.success("Campaign updated!");
      onClose();
    } catch {
      toast.error("Failed to update campaign");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-gray-50 transition-all";

  const totalImages = existingImages.length + newImages.length;
  const totalDocs   = existingDocuments.length + newDocuments.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-xl font-bold text-gray-800">Edit Campaign</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Basic fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Mumbai, India" className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal (INR) *</label>
              <input name="goalAmount" type="number" min="1" value={form.goalAmount} onChange={handleChange} required className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline *</label>
              <input name="deadline" type="date" value={form.deadline} onChange={handleChange} required className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} required className={`${inputCls} resize-none`} />
          </div>

          {/* Images section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Images <span className="text-gray-400 font-normal">({totalImages}/5)</span>
            </label>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {existingImages.map((url, i) => (
                  <div key={url} className="relative group">
                    <img src={url} alt="" className="w-20 h-20 object-cover rounded-xl border border-gray-200" />
                    <button
                      type="button"
                      onClick={() => setExistingImages((p) => p.filter((_, idx) => idx !== i))}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >×</button>
                  </div>
                ))}
              </div>
            )}

            {/* New image previews */}
            {newImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {newImages.map((file, i) => (
                  <div key={i} className="relative group">
                    <img src={URL.createObjectURL(file)} alt={file.name} className="w-20 h-20 object-cover rounded-xl border-2 border-emerald-300" />
                    <span className="absolute bottom-0 left-0 right-0 bg-emerald-600 text-white text-[9px] text-center rounded-b-xl py-0.5">New</span>
                    <button
                      type="button"
                      onClick={() => setNewImages((p) => p.filter((_, idx) => idx !== i))}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >×</button>
                  </div>
                ))}
              </div>
            )}

            {totalImages < 5 && (
              <label className="flex items-center gap-2 cursor-pointer w-fit px-4 py-2 border-2 border-dashed border-emerald-300 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors text-sm text-emerald-600 font-medium">
                <FaPlus className="text-xs" /> Add Images
                <input
                  type="file" multiple accept="image/*" className="hidden"
                  onChange={(e) => {
                    const picked = Array.from(e.target.files);
                    setNewImages((p) => [...p, ...picked].slice(0, 5 - existingImages.length));
                    e.target.value = "";
                  }}
                />
              </label>
            )}
          </div>

          {/* Documents section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supporting Documents <span className="text-gray-400 font-normal">({totalDocs}/5)</span>
            </label>

            {/* Existing docs */}
            {existingDocuments.length > 0 && (
              <div className="flex flex-col gap-1.5 mb-2">
                {existingDocuments.map((url, i) => {
                  const name = url.split("/").pop().split("?")[0];
                  return (
                    <div key={url} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border text-sm">
                      <span className="text-base">📄</span>
                      <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate flex-1">{decodeURIComponent(name)}</a>
                      <button
                        type="button"
                        onClick={() => setExistingDocuments((p) => p.filter((_, idx) => idx !== i))}
                        className="text-red-400 hover:text-red-600 ml-1 flex-shrink-0"
                      ><FaTimes /></button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* New doc previews */}
            {newDocuments.length > 0 && (
              <div className="flex flex-col gap-1.5 mb-2">
                {newDocuments.map((file, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-sm">
                    <span className="text-base">📄</span>
                    <span className="truncate flex-1 text-gray-700">{file.name}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">NEW</span>
                    <button
                      type="button"
                      onClick={() => setNewDocuments((p) => p.filter((_, idx) => idx !== i))}
                      className="text-red-400 hover:text-red-600 ml-1 flex-shrink-0"
                    ><FaTimes /></button>
                  </div>
                ))}
              </div>
            )}

            {totalDocs < 5 && (
              <label className="flex items-center gap-2 cursor-pointer w-fit px-4 py-2 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors text-sm text-blue-600 font-medium">
                <FaPlus className="text-xs" /> Add Documents
                <input
                  type="file" multiple accept=".pdf,.doc,.docx,.jpg,.png" className="hidden"
                  onChange={(e) => {
                    const picked = Array.from(e.target.files);
                    setNewDocuments((p) => [...p, ...picked].slice(0, 5 - existingDocuments.length));
                    e.target.value = "";
                  }}
                />
              </label>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 sticky bottom-0 bg-white pb-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-60 transition-all shadow-md">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Confirm Delete Dialog ────────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Confirm Delete</h3>
        <p className="text-gray-500 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors shadow-md">Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Campaign Donations Panel (inline expand) ─────────────────────────────────
function CampaignDonationsPanel({ campaignId, campaignTitle }) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    donationService.getCampaignDonations(campaignId)
      .then((res) => setDonations(res.data))
      .catch(() => toast.error("Failed to load donations"))
      .finally(() => setLoading(false));
  }, [campaignId]);

  const handleInvoice = async (donationId) => {
    setDownloading(donationId);
    try {
      const res = await donationService.downloadInvoice(donationId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${donationId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Invoice downloaded!");
    } catch {
      toast.error("Failed to download invoice");
    } finally {
      setDownloading(null);
    }
  };

  if (loading) return <div className="py-6 text-center text-sm text-gray-400">Loading donations...</div>;

  if (donations.length === 0) {
    return <div className="py-6 text-center text-sm text-gray-400">No donations received yet for this campaign.</div>;
  }

  const total = donations.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="mt-1">
      {/* Summary row */}
      <div className="flex gap-4 px-4 py-2 bg-emerald-50 border-b text-xs font-semibold text-emerald-700">
        <span>{donations.length} donation{donations.length !== 1 ? "s" : ""}</span>
        <span>·</span>
        <span>Total: {formatCurrency(total)}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Donor</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Amount</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 hidden sm:table-cell">Message</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 hidden sm:table-cell">Date</th>
              <th className="px-4 py-2.5 text-xs font-semibold text-gray-500">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {donations.map((d) => (
              <tr key={d._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {d.donorId?.avatar
                      ? <img src={d.donorId.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                      : <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                          {d.isAnonymous ? "?" : d.donorId?.name?.charAt(0) || "?"}
                        </div>
                    }
                    <span className="font-medium text-gray-700">{d.donorId?.name || "Anonymous"}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-bold text-emerald-600">{formatCurrency(d.amount)}</td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell max-w-[160px]">
                  <span className="line-clamp-1">{d.message || <span className="italic text-gray-300">—</span>}</span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">
                  {new Date(d.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleInvoice(d._id)}
                    disabled={downloading === d._id}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-teal-50 border border-teal-200 text-teal-700 rounded-lg text-xs font-medium hover:bg-teal-100 disabled:opacity-50 transition-colors"
                  >
                    <FaDownload className="text-[9px]" />
                    {downloading === d._id ? "..." : "PDF"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── TAB: Overview ────────────────────────────────────────────────────────────
function OverviewTab({ campaigns, donations, user }) {
  const totalRaised  = campaigns.reduce((s, c) => s + (c.raisedAmount || 0), 0);
  const totalDonated = donations.reduce((s, d) => s + d.amount, 0);
  const activeCampaigns = campaigns.filter((c) => c.status === "approved").length;

  const stats = [
    { label: "Campaigns Created", value: campaigns.length,          color: "from-teal-600 to-teal-700" },
    { label: "Active Campaigns",  value: activeCampaigns,           color: "from-emerald-500 to-emerald-600" },
    { label: "Total Raised",      value: formatCurrency(totalRaised),  color: "from-teal-700 to-teal-800" },
    { label: "Total Donated",     value: formatCurrency(totalDonated), color: "from-emerald-600 to-teal-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-gray-800 mb-1">Welcome back, {user?.name?.split(" ")[0]} 👋</h2>
        <p className="text-gray-500">Here's a summary of your fundraising activity.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} text-white p-5 rounded-2xl shadow-lg`}>
            <p className="text-xs font-medium opacity-80 mb-1">{s.label}</p>
            <p className="text-2xl font-black">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-2xl p-6 border">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Campaigns</h3>
          {campaigns.length === 0 ? (
            <p className="text-gray-400 text-sm">No campaigns yet.</p>
          ) : (
            <div className="space-y-3">
              {campaigns.slice(0, 4).map((c) => (
                <div key={c._id} className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm">
                  <img
                    src={c.images?.[0] || "https://placehold.co/40x40/e2e8f0/94a3b8?text=CF"}
                    alt={c.title}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 truncate">{c.title}</p>
                    <MiniProgressBar raised={c.raisedAmount} goal={c.goalAmount} />
                    <p className="text-xs text-gray-400 mt-1">{formatCurrency(c.raisedAmount || 0)} of {formatCurrency(c.goalAmount)}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 border">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Donations Made</h3>
          {donations.length === 0 ? (
            <p className="text-gray-400 text-sm">No donations yet.</p>
          ) : (
            <div className="space-y-3">
              {donations.slice(0, 4).map((d) => (
                <div key={d._id} className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm">
                  <img
                    src={d.campaignId?.images?.[0] || "https://placehold.co/40x40/e2e8f0/94a3b8?text=CF"}
                    alt={d.campaignId?.title}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 truncate">{d.campaignId?.title || "Campaign"}</p>
                    <p className="text-xs text-gray-400">{new Date(d.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <span className="font-bold text-emerald-600 text-sm">{formatCurrency(d.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import CampaignCard from "../components/campaign/CampaignCard.jsx";

// ─── TAB: My Campaigns ────────────────────────────────────────────────────────
function CampaignsTab({ campaigns, onEdit, onDelete }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-800">My Campaigns</h2>
          <p className="text-gray-500 text-sm">{campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          to="/raise"
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold text-sm hover:from-emerald-600 hover:to-emerald-700 shadow-md transition-all"
        >
          + New Campaign
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border">
          <div className="text-5xl mb-3">📣</div>
          <p className="text-gray-500 mb-4">You haven't created any campaigns yet.</p>
          <Link to="/raise" className="text-emerald-600 font-semibold hover:underline">Start your first campaign →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((c) => {
            const isExpanded = expandedId === c._id;

            return (
              <div
                key={c._id}
                className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Shared CampaignCard visuals */}
                <div className="p-3 sm:p-4">
                  <div className="relative rounded-2xl overflow-hidden">
                    <div className="ring-1 ring-gray-100 rounded-2xl">
                      <CampaignCard campaign={c} />
                    </div>

                    <div className="absolute top-3 left-3">
                      <StatusBadge status={c.status} />
                    </div>

                    {c.adminNote && c.status === "rejected" && (
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="px-3 py-2 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
                          <span className="font-semibold">Admin note:</span> {c.adminNote}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action bar (functionality unchanged) */}
                <div className="border-t px-4 py-3 flex gap-2 bg-gray-50 flex-wrap">
                  <Link
                    to={`/campaign/${c._id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FaEye /> View
                  </Link>

                  <button
                    onClick={() => onEdit(c)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    <FaEdit /> Edit
                  </button>

                  <button
                    onClick={() => toggleExpand(c._id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      isExpanded
                        ? "bg-teal-700 text-white border-teal-700"
                        : "text-teal-700 bg-teal-50 border-teal-200 hover:bg-teal-100"
                    }`}
                  >
                    <FaExchangeAlt />
                    Donations ({c.donorCount || 0})
                    {isExpanded ? <FaChevronUp className="text-[9px]" /> : <FaChevronDown className="text-[9px]" />}
                  </button>

                  <button
                    onClick={() => onDelete(c)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors ml-auto"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>

                {/* Inline donations panel */}
                {isExpanded && (
                  <div className="border-t">
                    <CampaignDonationsPanel campaignId={c._id} campaignTitle={c.title} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


// ─── TAB: My Transactions (donations I made) ──────────────────────────────────
function TransactionsTab({ donations }) {
  const [downloading, setDownloading] = useState(null);

  const handleInvoice = async (donationId) => {
    setDownloading(donationId);
    try {
      const res = await donationService.downloadInvoice(donationId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${donationId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Invoice downloaded!");
    } catch {
      toast.error("Failed to download invoice");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-800">My Transactions</h2>
        <p className="text-gray-500 text-sm">{donations.length} donation{donations.length !== 1 ? "s" : ""} made</p>
      </div>

      {donations.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border">
          <div className="text-5xl mb-3">💸</div>
          <p className="text-gray-500 mb-4">You haven't made any donations yet.</p>
          <Link to="/donate" className="text-emerald-600 font-semibold hover:underline">Browse campaigns →</Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Campaign</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Date</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Payment ID</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Message</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {donations.map((d) => (
                  <tr key={d._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={d.campaignId?.images?.[0] || "https://placehold.co/36x36/e2e8f0/94a3b8?text=CF"}
                          alt={d.campaignId?.title}
                          className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                        />
                        <div>
                          <span className="font-medium text-sm text-gray-800 line-clamp-1 max-w-[160px] block">{d.campaignId?.title || "Campaign"}</span>
                          {d.isAnonymous && <span className="text-[10px] text-gray-400">Anonymous donation</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-emerald-600">{formatCurrency(d.amount)}</span>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="text-sm text-gray-500">
                        {new Date(d.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-xs text-gray-400 font-mono">{d.paymentId ? d.paymentId.slice(-14) : "—"}</span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-500 line-clamp-1 max-w-[140px]">{d.message || <span className="italic text-gray-300">—</span>}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleInvoice(d._id)}
                        disabled={downloading === d._id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 border border-teal-200 text-teal-700 rounded-lg text-xs font-medium hover:bg-teal-100 disabled:opacity-50 transition-colors"
                      >
                        <FaDownload className="text-[10px]" />
                        {downloading === d._id ? "..." : "PDF"}
                      </button>
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

// ─── TAB: Report ──────────────────────────────────────────────────────────────
function ReportTab({ campaigns, donations }) {
  const totalRaised  = campaigns.reduce((s, c) => s + (c.raisedAmount || 0), 0);
  const totalDonated = donations.reduce((s, d) => s + d.amount, 0);

  const exportDonationsCSV = () => {
    if (!donations.length) { toast.error("No donations to export"); return; }
    const rows = [
      ["Donation ID", "Campaign", "Amount (INR)", "Date", "Payment ID", "Message"],
      ...donations.map((d) => [
        d._id,
        `"${d.campaignId?.title || "Campaign"}"`,
        d.amount,
        new Date(d.createdAt).toLocaleDateString("en-IN"),
        d.paymentId || "",
        `"${d.message || ""}"`,
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `my-donations-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Donations report exported!");
  };

  const exportCampaignsCSV = () => {
    if (!campaigns.length) { toast.error("No campaigns to export"); return; }
    const rows = [
      ["Campaign ID", "Title", "Category", "Goal (INR)", "Raised (INR)", "Donors", "Status", "Deadline"],
      ...campaigns.map((c) => [
        c._id,
        `"${c.title}"`,
        c.category,
        c.goalAmount,
        c.raisedAmount || 0,
        c.donorCount || 0,
        c.status,
        new Date(c.deadline).toLocaleDateString("en-IN"),
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `my-campaigns-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Campaigns report exported!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-800">Reports</h2>
        <p className="text-gray-500 text-sm">Download your activity as CSV.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Campaigns", value: campaigns.length },
          { label: "Active",          value: campaigns.filter((c) => c.status === "approved").length },
          { label: "Total Raised",    value: formatCurrency(totalRaised) },
          { label: "Total Donated",   value: formatCurrency(totalDonated) },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-xl font-black text-gray-800">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-emerald-500 text-white rounded-xl"><FaExchangeAlt /></div>
            <div>
              <h3 className="font-bold text-gray-800">Donations Report</h3>
              <p className="text-xs text-gray-500">{donations.length} records</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">All your donation transactions with campaign, amount, date, payment ID and message.</p>
          <button onClick={exportDonationsCSV} className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-md">
            <FaDownload /> Export Donations CSV
          </button>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-100 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-teal-700 text-white rounded-xl"><FaBullhorn /></div>
            <div>
              <h3 className="font-bold text-gray-800">Campaigns Report</h3>
              <p className="text-xs text-gray-500">{campaigns.length} records</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">All your campaigns with goals, funds raised, donor counts and status.</p>
          <button onClick={exportCampaignsCSV} className="w-full flex items-center justify-center gap-2 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-semibold text-sm transition-colors shadow-md">
            <FaDownload /> Export Campaigns CSV
          </button>
        </div>
      </div>

      {campaigns.length > 0 && (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b">
            <h3 className="font-bold text-gray-800">Campaign Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  {["Campaign", "Goal", "Raised", "Progress", "Donors", "Status"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {campaigns.map((c) => {
                  const pct = c.goalAmount > 0 ? Math.min(((c.raisedAmount || 0) / c.goalAmount) * 100, 100) : 0;
                  return (
                    <tr key={c._id} className="hover:bg-gray-50">
                      <td className="px-5 py-3.5 font-medium text-sm text-gray-800 max-w-[180px]">
                        <span className="line-clamp-1 block">{c.title}</span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">{formatCurrency(c.goalAmount)}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-emerald-600">{formatCurrency(c.raisedAmount || 0)}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-100 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-gray-500">{pct.toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">{c.donorCount || 0}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [campaigns, setCampaigns] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [deletingCampaign, setDeletingCampaign] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) { navigate("/login"); return; }
    if (user) fetchData();
  }, [user, authLoading]);

  const fetchData = async () => {
    try {
      const [cRes, dRes] = await Promise.all([
        campaignService.getMine(),
        donationService.getMine(),
      ]);
      setCampaigns(cRes.data);
      setDonations(dRes.data);
    } catch {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async (id, data) => {
    const res = await campaignService.update(id, data);
    setCampaigns((prev) => prev.map((c) => (c._id === id ? res.data : c)));
  };

  const handleConfirmDelete = async () => {
    if (!deletingCampaign) return;
    try {
      await campaignService.remove(deletingCampaign._id);
      setCampaigns((prev) => prev.filter((c) => c._id !== deletingCampaign._id));
      toast.success("Campaign deleted");
    } catch {
      toast.error("Failed to delete campaign");
    } finally {
      setDeletingCampaign(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/login");
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-6">

          {/* Sidebar */}
          <aside className="w-60 flex-shrink-0 hidden md:flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-sm border p-5 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-2xl font-black">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <p className="font-bold text-gray-800 text-sm">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>

            <nav className="bg-white rounded-2xl shadow-sm border p-3 space-y-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon />{tab.label}
                  </button>
                );
              })}
            </nav>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-2xl border border-red-100 transition-colors bg-white shadow-sm"
            >
              <FaSignOutAlt /> Logout
            </button>
          </aside>

          {/* Mobile bottom tab bar */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40 flex">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex flex-col items-center py-2.5 text-xs font-medium transition-colors ${active ? "text-emerald-600" : "text-gray-400"}`}
                >
                  <Icon className={`text-lg mb-0.5 ${active ? "text-emerald-600" : "text-gray-400"}`} />
                  {tab.label.split(" ")[0]}
                </button>
              );
            })}
          </div>

          {/* Main content */}
          <main className="flex-1 min-w-0 pb-20 md:pb-0">
            <div className="bg-white rounded-2xl shadow-sm border p-6 min-h-[500px]">
              {activeTab === "overview"  && <OverviewTab   campaigns={campaigns} donations={donations} user={user} />}
              {activeTab === "campaigns" && <CampaignsTab  campaigns={campaigns} onEdit={setEditingCampaign} onDelete={setDeletingCampaign} />}
              {activeTab === "donations" && <TransactionsTab donations={donations} />}
              {activeTab === "report"    && <ReportTab     campaigns={campaigns} donations={donations} />}
            </div>
          </main>
        </div>
      </div>

      {editingCampaign && (
        <EditModal campaign={editingCampaign} onClose={() => setEditingCampaign(null)} onSave={handleSaveEdit} />
      )}
      {deletingCampaign && (
        <ConfirmDialog
          message={`Are you sure you want to delete "${deletingCampaign.title}"? This cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingCampaign(null)}
        />
      )}
    </div>
  );
}

export default Dashboard;
