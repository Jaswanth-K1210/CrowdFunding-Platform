import "../tokens.css";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { campaignService } from "../../services/campaignService";
import { donationService } from "../../services/donationService";
import { useAuth } from "../../store/authStore";
import { formatCurrency } from "../../utils/formatCurrency";

/* ── Constants ── */
const TABS = [
  { id: "overview",     label: "Overview",      icon: "📊" },
  { id: "campaigns",    label: "My Campaigns",  icon: "🚀" },
  { id: "donations",    label: "Donations",     icon: "💚" },
  { id: "report",       label: "Report",        icon: "📋" },
];

const CATEGORIES = ["education","medical","animals","business","ngo","community","emergency","technology"];

/* ── Small helpers ── */
const pct = (c) => Math.min(((c.raisedAmount || 0) / (c.goalAmount || 1)) * 100, 100).toFixed(0);
const days = (d) => Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000));

/* ── Edit Modal ── */
function EditModal({ campaign, onClose, onSave }) {
  const [form, setForm] = useState({
    title:       campaign.title,
    description: campaign.description,
    category:    campaign.category,
    goalAmount:  campaign.goalAmount,
    location:    campaign.location || "",
    deadline:    campaign.deadline?.slice(0, 10) || "",
  });
  const [existingImages, setExistingImages] = useState(campaign.images || []);
  const [existingDocs,   setExistingDocs]   = useState(campaign.documents || []);
  const [newImages, setNewImages] = useState([]);
  const [newDocs,   setNewDocs]   = useState([]);
  const [saving, setSaving]       = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(campaign._id, { ...form, existingImages, existingDocuments: existingDocs, newImages, newDocuments: newDocs });
      onClose();
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl"
        style={{ background: "white", boxShadow: "var(--shadow-lg)" }}>

        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--c-line)", background: "white", zIndex: 10 }}>
          <h2 className="text-lg font-black" style={{ fontFamily: "var(--ff-display)" }}>Edit Campaign</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold hover:bg-gray-100"
            style={{ color: "var(--c-muted)" }}>×</button>
        </div>

        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-2" style={{ color: "var(--c-muted)" }}>Title</label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: "var(--c-bg-alt)", border: "1.5px solid var(--c-line)", color: "var(--c-text)" }}
              onFocus={(e) => e.target.style.borderColor = "var(--c-brand)"}
              onBlur={(e) => e.target.style.borderColor = "var(--c-line)"} />
          </div>

          {/* Category + Goal */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2" style={{ color: "var(--c-muted)" }}>Category</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none capitalize"
                style={{ background: "var(--c-bg-alt)", border: "1.5px solid var(--c-line)", color: "var(--c-text)" }}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2" style={{ color: "var(--c-muted)" }}>Goal (₹)</label>
              <input type="number" value={form.goalAmount} onChange={(e) => set("goalAmount", e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "var(--c-bg-alt)", border: "1.5px solid var(--c-line)", color: "var(--c-text)" }}
                onFocus={(e) => e.target.style.borderColor = "var(--c-brand)"}
                onBlur={(e) => e.target.style.borderColor = "var(--c-line)"} />
            </div>
          </div>

          {/* Location + Deadline */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2" style={{ color: "var(--c-muted)" }}>Location</label>
              <input value={form.location} onChange={(e) => set("location", e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "var(--c-bg-alt)", border: "1.5px solid var(--c-line)", color: "var(--c-text)" }}
                onFocus={(e) => e.target.style.borderColor = "var(--c-brand)"}
                onBlur={(e) => e.target.style.borderColor = "var(--c-line)"} />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2" style={{ color: "var(--c-muted)" }}>Deadline</label>
              <input type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "var(--c-bg-alt)", border: "1.5px solid var(--c-line)", color: "var(--c-text)" }}
                onFocus={(e) => e.target.style.borderColor = "var(--c-brand)"}
                onBlur={(e) => e.target.style.borderColor = "var(--c-line)"} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-2" style={{ color: "var(--c-muted)" }}>Description</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={{ background: "var(--c-bg-alt)", border: "1.5px solid var(--c-line)", color: "var(--c-text)" }}
              onFocus={(e) => e.target.style.borderColor = "var(--c-brand)"}
              onBlur={(e) => e.target.style.borderColor = "var(--c-line)"} />
          </div>

          {/* Existing images */}
          {existingImages.length > 0 && (
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2" style={{ color: "var(--c-muted)" }}>Current Photos</label>
              <div className="flex flex-wrap gap-2">
                {existingImages.map((url, i) => (
                  <div key={i} className="relative group w-16 h-16 rounded-xl overflow-hidden"
                    style={{ border: "1.5px solid var(--c-line)" }}>
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => setExistingImages((p) => p.filter((_, idx) => idx !== i))}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-base font-black">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add new images */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-2" style={{ color: "var(--c-muted)" }}>Add Photos</label>
            <label className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-gray-50 transition-all"
              style={{ border: "2px dashed var(--c-line)" }}>
              <span className="text-xl">📸</span>
              <span className="text-sm" style={{ color: "var(--c-muted)" }}>Choose images…</span>
              <input type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => setNewImages((p) => [...p, ...Array.from(e.target.files || [])].slice(0, 5))} />
            </label>
            {newImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {newImages.map((f, i) => (
                  <div key={i} className="relative group w-12 h-12 rounded-lg overflow-hidden">
                    <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => setNewImages((p) => p.filter((_, idx) => idx !== i))}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Docs */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-2" style={{ color: "var(--c-muted)" }}>Add Documents</label>
            <label className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-gray-50 transition-all"
              style={{ border: "2px dashed var(--c-line)" }}>
              <span className="text-xl">📎</span>
              <span className="text-sm" style={{ color: "var(--c-muted)" }}>Attach PDF / DOC…</span>
              <input type="file" accept=".pdf,.doc,.docx" multiple className="hidden"
                onChange={(e) => setNewDocs((p) => [...p, ...Array.from(e.target.files || [])].slice(0, 5))} />
            </label>
            {newDocs.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {newDocs.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
                    style={{ background: "var(--c-bg-alt)", border: "1px solid var(--c-line)" }}>
                    <span>📄</span>
                    <span className="max-w-20 truncate" style={{ color: "var(--c-text)" }}>{f.name}</span>
                    <button onClick={() => setNewDocs((p) => p.filter((_, idx) => idx !== i))} className="text-red-400 font-bold">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose}
              className="flex-1 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all"
              style={{ border: "1.5px solid var(--c-line)", color: "var(--c-muted)" }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-3.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-60"
              style={{ background: "var(--c-brand)" }}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Campaign Card ── */
function CampaignCard({ campaign, onEdit, onDelete }) {
  const [showDonors, setShowDonors] = useState(false);
  const [donors, setDonors]         = useState([]);
  const [loadingDonors, setLD]      = useState(false);

  const loadDonors = async () => {
    if (donors.length || loadingDonors) return;
    setLD(true);
    try {
      const res = await donationService.getCampaignDonations(campaign._id);
      setDonors(res.data || []);
    } catch { /* ignore */ }
    finally { setLD(false); }
  };

  const toggleDonors = () => {
    setShowDonors((s) => !s);
    if (!showDonors) loadDonors();
  };

  const p = pct(campaign);
  const d = days(campaign.deadline);
  const img = campaign.images?.[0] || "https://placehold.co/400x200/0A4B38/FBF7F0?text=Campaign";

  const statusColors = {
    approved: { bg: "#D1FAE5", text: "#065F46" },
    pending:  { bg: "#FEF3C7", text: "#92400E" },
    rejected: { bg: "#FEE2E2", text: "#991B1B" },
  };
  const sc = statusColors[campaign.status] || statusColors.pending;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid var(--c-line)", boxShadow: "var(--shadow-sm)" }}>
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img src={img} alt={campaign.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-black"
            style={{ background: sc.bg, color: sc.text }}>
            {campaign.status}
          </span>
        </div>
        {d > 0 && d <= 7 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-black bg-red-500 text-white">
            {d}d left
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-black text-sm leading-snug mb-1 line-clamp-2"
          style={{ fontFamily: "var(--ff-display)", color: "var(--c-text)" }}>
          {campaign.title}
        </h3>
        <p className="text-xs mb-4 capitalize" style={{ color: "var(--c-muted)" }}>{campaign.category}</p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1" style={{ color: "var(--c-muted)" }}>
            <span className="font-black" style={{ color: "var(--c-brand)" }}>{formatCurrency(campaign.raisedAmount || 0)}</span>
            <span>{p}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--c-line)" }}>
            <div className="h-full rounded-full" style={{ width: `${p}%`, background: `linear-gradient(to right, var(--c-brand-mid), var(--c-brand-lit))` }} />
          </div>
          <div className="flex justify-between mt-1 text-xs" style={{ color: "var(--c-muted)" }}>
            <span>of {formatCurrency(campaign.goalAmount)}</span>
            <span>{campaign.donorCount || 0} donors</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={toggleDonors}
            className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
            style={{ background: showDonors ? "var(--c-bg-alt)" : "var(--c-bg-alt)", border: "1.5px solid var(--c-line)", color: "var(--c-brand)" }}>
            {showDonors ? "Hide Donors" : `Donors (${campaign.donorCount || 0})`}
          </button>
          <button onClick={() => onEdit(campaign)}
            className="px-3 py-2 rounded-xl text-xs font-bold transition-all hover:bg-gray-50"
            style={{ border: "1.5px solid var(--c-line)", color: "var(--c-muted)" }}>✏️</button>
          <button onClick={() => onDelete(campaign._id)}
            className="px-3 py-2 rounded-xl text-xs font-bold transition-all hover:bg-red-50 hover:border-red-300"
            style={{ border: "1.5px solid var(--c-line)", color: "var(--c-muted)" }}>🗑</button>
        </div>

        {/* Donors list */}
        <AnimatePresence>
          {showDonors && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-4">
              <div className="pt-4" style={{ borderTop: "1px solid var(--c-line)" }}>
                {loadingDonors ? (
                  <div className="text-xs text-center py-3" style={{ color: "var(--c-muted)" }}>Loading donors…</div>
                ) : donors.length === 0 ? (
                  <div className="text-xs text-center py-3" style={{ color: "var(--c-muted)" }}>No donations yet</div>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {donors.slice(0, 8).map((d) => (
                      <div key={d._id} className="flex items-center justify-between">
                        <span className="text-xs truncate" style={{ color: "var(--c-text)" }}>
                          {d.isAnonymous ? "Anonymous" : d.donorId?.name || "Donor"}
                        </span>
                        <span className="text-xs font-black shrink-0 ml-2" style={{ color: "var(--c-brand)" }}>
                          {formatCurrency(d.amount)}
                        </span>
                      </div>
                    ))}
                    {donors.length > 8 && (
                      <p className="text-xs text-center" style={{ color: "var(--c-muted)" }}>+{donors.length - 8} more</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Main Dashboard ── */
export default function FDDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab]               = useState("overview");
  const [campaigns, setCampaigns]   = useState([]);
  const [myDonations, setMyDonations] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [editTarget, setEditTarget] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [cRes, dRes] = await Promise.all([
        campaignService.getMine(),
        donationService.getMine(),
      ]);
      setCampaigns(cRes.data.campaigns || []);
      setMyDonations(dRes.data || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchAll();
  }, [user, navigate, fetchAll]);

  const handleSaveEdit = async (id, data) => {
    const res = await campaignService.update(id, data);
    setCampaigns((prev) => prev.map((c) => (c._id === id ? res.data : c)));
    toast.success("Campaign updated!");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this campaign? This cannot be undone.")) return;
    try {
      await campaignService.delete(id);
      setCampaigns((prev) => prev.filter((c) => c._id !== id));
      toast.success("Campaign deleted");
    } catch { toast.error("Delete failed"); }
  };

  const downloadInvoice = async (donationId) => {
    try {
      const res = await donationService.downloadInvoice(donationId);
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a"); a.href = url; a.download = `invoice-${donationId}.pdf`; a.click();
    } catch { toast.error("Invoice not available"); }
  };

  const exportCSV = () => {
    const rows = [["Date", "Campaign", "Amount", "Status"]];
    myDonations.forEach((d) => {
      rows.push([
        new Date(d.createdAt).toLocaleDateString("en-IN"),
        d.campaignId?.title || "—",
        d.amount,
        d.paymentStatus,
      ]);
    });
    const csv = rows.map((r) => r.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = "my-donations.csv"; a.click();
  };

  /* Overview stats */
  const totalRaised  = campaigns.reduce((s, c) => s + (c.raisedAmount || 0), 0);
  const totalDonated = myDonations.filter((d) => d.paymentStatus === "completed").reduce((s, d) => s + d.amount, 0);
  const activeCamps  = campaigns.filter((c) => c.status === "approved").length;

  if (!user) return null;

  return (
    <div className="fd-root min-h-screen" style={{ background: "var(--c-bg)" }}>

      {/* ── Top bar ── */}
      <div className="sticky top-0 z-30" style={{ background: "white", borderBottom: "1px solid var(--c-line)", boxShadow: "var(--shadow-sm)" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-black" style={{ fontFamily: "var(--ff-display)", color: "var(--c-brand)" }}>
            Crowd<em className="not-italic" style={{ color: "var(--c-gold)" }}>Fund</em>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium hidden sm:block" style={{ color: "var(--c-muted)" }}>
              {user.name}
            </span>
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm text-white"
              style={{ background: "var(--c-brand)" }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">

        {/* ── Sidebar ── */}
        <div className="hidden md:block w-52 shrink-0">
          <div className="sticky top-24">
            <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid var(--c-line)", boxShadow: "var(--shadow-sm)" }}>
              {/* User info */}
              <div className="p-5" style={{ background: "var(--c-dark)" }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg text-white mx-auto mb-3"
                  style={{ background: "var(--c-brand)" }}>
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <p className="text-white font-bold text-sm text-center truncate">{user.name}</p>
                <p className="text-xs text-center truncate" style={{ color: "rgba(255,255,255,0.5)" }}>{user.email}</p>
              </div>

              {/* Nav */}
              <nav className="p-2">
                {TABS.map((t) => (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-left text-sm font-bold transition-all"
                    style={{
                      background: tab === t.id ? "var(--c-brand)" : "transparent",
                      color:      tab === t.id ? "white"           : "var(--c-muted)",
                    }}>
                    <span>{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </nav>

              <div className="p-3" style={{ borderTop: "1px solid var(--c-line)" }}>
                <button onClick={() => { logout(); navigate("/login"); }}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all text-left flex items-center gap-2">
                  <span>🚪</span> Logout
                </button>
              </div>
            </div>

            <Link to="/raise-fund"
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-black text-white transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, var(--c-brand), var(--c-brand-mid))" }}>
              ＋ New Campaign
            </Link>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">

          {/* Mobile tab strip */}
          <div className="flex gap-1 mb-6 p-1 rounded-xl overflow-x-auto md:hidden" style={{ background: "var(--c-bg-alt)" }}>
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: tab === t.id ? "white" : "transparent",
                  color:      tab === t.id ? "var(--c-brand)" : "var(--c-muted)",
                  boxShadow:  tab === t.id ? "var(--shadow-sm)" : "none",
                }}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 rounded-2xl animate-pulse" style={{ background: "var(--c-bg-alt)" }} />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* ─── OVERVIEW ─── */}
              {tab === "overview" && (
                <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <h2 className="text-2xl font-black mb-6" style={{ fontFamily: "var(--ff-display)" }}>
                    Welcome back, {user.name?.split(" ")[0]}. 👋
                  </h2>

                  {/* Stat cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                      { label: "Campaigns",     value: campaigns.length,      icon: "🚀", sub: `${activeCamps} active` },
                      { label: "Total Raised",  value: formatCurrency(totalRaised),  icon: "💰", sub: "across your campaigns" },
                      { label: "Donated",       value: formatCurrency(totalDonated), icon: "💚", sub: "to other causes" },
                      { label: "Donations Given", value: myDonations.filter(d=>d.paymentStatus==="completed").length, icon: "🎁", sub: "completed payments" },
                    ].map((s) => (
                      <div key={s.label} className="p-5 rounded-2xl"
                        style={{ background: "white", border: "1px solid var(--c-line)", boxShadow: "var(--shadow-sm)" }}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">{s.icon}</span>
                          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--c-muted)" }}>{s.label}</span>
                        </div>
                        <p className="text-2xl font-black mb-0.5" style={{ fontFamily: "var(--ff-display)", color: "var(--c-brand)" }}>{s.value}</p>
                        <p className="text-xs" style={{ color: "var(--c-muted)" }}>{s.sub}</p>
                      </div>
                    ))}
                  </div>

                  {/* Recent campaigns */}
                  {campaigns.length > 0 && (
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-black" style={{ fontFamily: "var(--ff-display)" }}>Recent Campaigns</h3>
                        <button onClick={() => setTab("campaigns")} className="text-xs font-bold" style={{ color: "var(--c-brand)" }}>
                          View all →
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {campaigns.slice(0, 3).map((c) => (
                          <CampaignCard key={c._id} campaign={c} onEdit={setEditTarget} onDelete={handleDelete} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent donations */}
                  {myDonations.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-black" style={{ fontFamily: "var(--ff-display)" }}>Recent Donations</h3>
                        <button onClick={() => setTab("donations")} className="text-xs font-bold" style={{ color: "var(--c-brand)" }}>
                          View all →
                        </button>
                      </div>
                      <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid var(--c-line)" }}>
                        {myDonations.slice(0, 5).map((d, i) => (
                          <div key={d._id} className="flex items-center gap-4 px-5 py-4"
                            style={{ borderBottom: i < 4 ? "1px solid var(--c-line)" : "none" }}>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                              style={{ background: "var(--c-bg-alt)" }}>💚</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold truncate" style={{ color: "var(--c-text)" }}>
                                {d.campaignId?.title || "Campaign"}
                              </p>
                              <p className="text-xs" style={{ color: "var(--c-muted)" }}>
                                {new Date(d.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </p>
                            </div>
                            <span className="text-sm font-black shrink-0" style={{ color: "var(--c-brand)" }}>
                              {formatCurrency(d.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {campaigns.length === 0 && myDonations.length === 0 && (
                    <div className="text-center py-20">
                      <div className="text-6xl mb-4">🌱</div>
                      <h3 className="text-2xl font-black mb-2" style={{ fontFamily: "var(--ff-display)" }}>Start making an impact</h3>
                      <p className="text-sm mb-8" style={{ color: "var(--c-muted)" }}>Create a campaign or donate to a cause.</p>
                      <div className="flex flex-wrap justify-center gap-3">
                        <Link to="/raise-fund" className="px-6 py-3 rounded-xl font-bold text-sm text-white" style={{ background: "var(--c-brand)" }}>
                          Start a Campaign →
                        </Link>
                        <Link to="/donate" className="px-6 py-3 rounded-xl font-bold text-sm" style={{ border: "1.5px solid var(--c-brand)", color: "var(--c-brand)" }}>
                          Browse Campaigns
                        </Link>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ─── MY CAMPAIGNS ─── */}
              {tab === "campaigns" && (
                <motion.div key="campaigns" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black" style={{ fontFamily: "var(--ff-display)" }}>My Campaigns</h2>
                    <Link to="/raise-fund"
                      className="px-5 py-2.5 rounded-xl font-black text-sm text-white"
                      style={{ background: "var(--c-brand)" }}>
                      ＋ New
                    </Link>
                  </div>
                  {campaigns.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="text-5xl mb-4">🚀</div>
                      <p className="font-bold mb-2" style={{ color: "var(--c-text)" }}>No campaigns yet</p>
                      <p className="text-sm mb-6" style={{ color: "var(--c-muted)" }}>Launch your first campaign today.</p>
                      <Link to="/raise-fund" className="px-6 py-3 rounded-xl font-bold text-sm text-white" style={{ background: "var(--c-brand)" }}>
                        Create Campaign
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {campaigns.map((c) => (
                        <CampaignCard key={c._id} campaign={c} onEdit={setEditTarget} onDelete={handleDelete} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ─── DONATIONS ─── */}
              {tab === "donations" && (
                <motion.div key="donations" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black" style={{ fontFamily: "var(--ff-display)" }}>My Donations</h2>
                    {myDonations.length > 0 && (
                      <button onClick={exportCSV}
                        className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:bg-gray-50"
                        style={{ border: "1.5px solid var(--c-line)", color: "var(--c-text)" }}>
                        Export CSV
                      </button>
                    )}
                  </div>

                  {myDonations.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="text-5xl mb-4">💚</div>
                      <p className="font-bold mb-2">No donations yet</p>
                      <Link to="/donate" className="px-6 py-3 rounded-xl font-bold text-sm text-white inline-block mt-4"
                        style={{ background: "var(--c-brand)" }}>
                        Browse Campaigns →
                      </Link>
                    </div>
                  ) : (
                    <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid var(--c-line)" }}>
                      {myDonations.map((d, i) => (
                        <div key={d._id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
                          style={{ borderBottom: i < myDonations.length - 1 ? "1px solid var(--c-line)" : "none" }}>
                          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                            {d.campaignId?.images?.[0]
                              ? <img src={d.campaignId.images[0]} alt="" className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center text-lg" style={{ background: "var(--c-bg-alt)" }}>💚</div>
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate" style={{ color: "var(--c-text)" }}>
                              {d.campaignId?.title || "Campaign"}
                            </p>
                            <p className="text-xs" style={{ color: "var(--c-muted)" }}>
                              {new Date(d.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-sm font-black" style={{ color: "var(--c-brand)" }}>{formatCurrency(d.amount)}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${d.paymentStatus === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                              {d.paymentStatus}
                            </span>
                            {d.paymentStatus === "completed" && (
                              <button onClick={() => downloadInvoice(d._id)}
                                className="text-xs font-bold hover:underline" style={{ color: "var(--c-brand)" }}>
                                Invoice
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ─── REPORT ─── */}
              {tab === "report" && (
                <motion.div key="report" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <h2 className="text-2xl font-black mb-6" style={{ fontFamily: "var(--ff-display)" }}>Impact Report</h2>

                  {/* Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                      { label: "Campaigns Created", value: campaigns.length },
                      { label: "Total Raised",      value: formatCurrency(totalRaised) },
                      { label: "Total Donated",     value: formatCurrency(totalDonated) },
                      { label: "Donations Made",    value: myDonations.filter(d=>d.paymentStatus==="completed").length },
                    ].map((s) => (
                      <div key={s.label} className="p-5 rounded-2xl text-center"
                        style={{ background: "white", border: "1px solid var(--c-line)", boxShadow: "var(--shadow-sm)" }}>
                        <p className="text-2xl font-black mb-1" style={{ fontFamily: "var(--ff-display)", color: "var(--c-brand)" }}>{s.value}</p>
                        <p className="text-xs font-bold" style={{ color: "var(--c-muted)" }}>{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Campaign breakdown */}
                  {campaigns.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-black mb-4" style={{ fontFamily: "var(--ff-display)" }}>Campaign Performance</h3>
                      <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid var(--c-line)" }}>
                        <table className="w-full text-sm">
                          <thead>
                            <tr style={{ background: "var(--c-bg-alt)", borderBottom: "1px solid var(--c-line)" }}>
                              {["Campaign", "Status", "Raised", "Goal", "Progress"].map((h) => (
                                <th key={h} className="text-left px-5 py-3 text-xs font-black uppercase tracking-wider" style={{ color: "var(--c-muted)" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {campaigns.map((c, i) => (
                              <tr key={c._id} style={{ borderBottom: i < campaigns.length - 1 ? "1px solid var(--c-line)" : "none" }}>
                                <td className="px-5 py-3">
                                  <p className="font-bold text-xs truncate max-w-32" style={{ color: "var(--c-text)" }}>{c.title}</p>
                                </td>
                                <td className="px-5 py-3">
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.status === "approved" ? "bg-green-100 text-green-700" : c.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                                    {c.status}
                                  </span>
                                </td>
                                <td className="px-5 py-3 text-xs font-black" style={{ color: "var(--c-brand)" }}>
                                  {formatCurrency(c.raisedAmount || 0)}
                                </td>
                                <td className="px-5 py-3 text-xs" style={{ color: "var(--c-muted)" }}>
                                  {formatCurrency(c.goalAmount)}
                                </td>
                                <td className="px-5 py-3">
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--c-line)" }}>
                                      <div className="h-full rounded-full" style={{ width: `${pct(c)}%`, background: "var(--c-brand)" }} />
                                    </div>
                                    <span className="text-xs shrink-0" style={{ color: "var(--c-muted)" }}>{pct(c)}%</span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Export */}
                  <div className="flex gap-3">
                    {myDonations.length > 0 && (
                      <button onClick={exportCSV}
                        className="px-6 py-3 rounded-xl font-bold text-sm text-white"
                        style={{ background: "var(--c-brand)" }}>
                        Export Donations CSV
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* ── Edit Modal ── */}
      <AnimatePresence>
        {editTarget && (
          <EditModal campaign={editTarget} onClose={() => setEditTarget(null)} onSave={handleSaveEdit} />
        )}
      </AnimatePresence>
    </div>
  );
}
