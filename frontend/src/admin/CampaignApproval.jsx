import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminService } from "../services/adminService";
import { formatCurrency } from "../utils/formatCurrency";
import {
  FaEye, FaCheck, FaTimes, FaImages, FaFileAlt,
  FaUser, FaMapMarkerAlt, FaCalendarAlt, FaBullseye,
} from "react-icons/fa";

const STATUS_CLS = {
  pending:   "bg-yellow-100 text-yellow-800",
  approved:  "bg-emerald-100 text-emerald-800",
  rejected:  "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
  draft:     "bg-gray-100 text-gray-600",
};

// ─── Full Campaign Detail Modal ───────────────────────────────────────────────
function CampaignDetailModal({ campaign, onClose, onApprove, onReject }) {
  const [imgIdx, setImgIdx] = useState(0);
  const images = campaign.images || [];
  const docs   = campaign.documents || [];
  const pct    = campaign.goalAmount > 0
    ? Math.min(((campaign.raisedAmount || 0) / campaign.goalAmount) * 100, 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-gray-800 line-clamp-1">{campaign.title}</h2>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_CLS[campaign.status] || STATUS_CLS.draft}`}>
              {campaign.status}
            </span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Image gallery */}
          {images.length > 0 && (
            <div>
              <img
                src={images[imgIdx]}
                alt=""
                className="w-full h-64 object-cover rounded-2xl border"
              />
              {images.length > 1 && (
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                  {images.map((url, i) => (
                    <img
                      key={url}
                      src={url}
                      alt=""
                      onClick={() => setImgIdx(i)}
                      className={`w-16 h-16 object-cover rounded-xl cursor-pointer shrink-0 transition-all ${
                        i === imgIdx ? "ring-2 ring-emerald-500 scale-105" : "opacity-60 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Meta grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: FaUser,          label: "Creator",  value: campaign.creatorId?.name || "—" },
              { icon: FaBullseye,      label: "Goal",     value: formatCurrency(campaign.goalAmount) },
              { icon: FaMapMarkerAlt,  label: "Location", value: campaign.location || "—" },
              { icon: FaCalendarAlt,   label: "Deadline", value: new Date(campaign.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="bg-gray-50 rounded-xl p-3 border">
                  <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                    <Icon className="text-xs" />
                    <span className="text-xs font-medium">{m.label}</span>
                  </div>
                  <p className="font-semibold text-gray-800 text-sm truncate">{m.value}</p>
                </div>
              );
            })}
          </div>

          {/* Creator email */}
          {campaign.creatorId?.email && (
            <p className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">Creator email:</span> {campaign.creatorId.email}
            </p>
          )}

          {/* Category + raised */}
          <div className="flex flex-wrap gap-3 items-center">
            <span className="px-3 py-1 bg-teal-50 border border-teal-200 text-teal-700 rounded-full text-xs font-semibold capitalize">{campaign.category}</span>
            <span className="text-sm text-gray-600">
              Raised: <span className="font-bold text-emerald-600">{formatCurrency(campaign.raisedAmount || 0)}</span>
              <span className="text-gray-400"> · {pct.toFixed(1)}%</span>
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="h-2 rounded-full bg-linear-to-r from-emerald-400 to-emerald-600" style={{ width: `${pct}%` }} />
          </div>

          {/* Description */}
          <div>
            <h4 className="font-bold text-gray-700 mb-2">Campaign Story</h4>
            <div className="bg-gray-50 border rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
              {campaign.description}
            </div>
          </div>

          {/* Admin note if rejected */}
          {campaign.adminNote && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-700">
              <span className="font-semibold">Previous admin note:</span> {campaign.adminNote}
            </div>
          )}

          {/* Documents */}
          {docs.length > 0 && (
            <div>
              <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><FaFileAlt className="text-blue-500" /> Supporting Documents</h4>
              <div className="space-y-2">
                {docs.map((url, i) => {
                  const name = decodeURIComponent(url.split("/").pop().split("?")[0]);
                  return (
                    <a key={i} href={url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm hover:bg-blue-100 transition-colors">
                      📄 <span className="truncate">{name}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Action footer — only show if pending */}
        {campaign.status === "pending" && (
          <div className="sticky bottom-0 bg-white border-t px-6 py-4 rounded-b-2xl flex gap-3">
            <button
              onClick={() => { onApprove(campaign._id); onClose(); }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-linear-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 shadow-md transition-all"
            >
              <FaCheck /> Approve Campaign
            </button>
            <button
              onClick={() => { onReject(campaign._id); onClose(); }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold shadow-md transition-colors"
            >
              <FaTimes /> Reject Campaign
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Reject Reason Modal ──────────────────────────────────────────────────────
function RejectModal({ onConfirm, onCancel }) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-1">Reject Campaign</h3>
        <p className="text-gray-500 text-sm mb-4">Provide a reason — the creator will be notified by email.</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          placeholder="e.g. Insufficient documentation, unclear use of funds..."
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none bg-gray-50"
        />
        <div className="flex gap-3 mt-4">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => reason.trim() && onConfirm(reason.trim())}
            disabled={!reason.trim()}
            className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-xl font-semibold transition-colors"
          >
            Confirm Reject
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function CampaignApproval() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState("pending");
  const [viewing, setViewing]     = useState(null);       // campaign to view in detail modal
  const [rejectId, setRejectId]   = useState(null);       // id awaiting reject reason

  useEffect(() => { fetchCampaigns(); }, [filter]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = filter === "pending"
        ? await adminService.getPendingCampaigns()
        : await adminService.getAllCampaigns();
      setCampaigns(res.data);
    } catch {
      toast.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminService.approveCampaign(id, "");
      toast.success("Campaign approved");
      setCampaigns((prev) => prev.map((c) => c._id === id ? { ...c, status: "approved" } : c));
    } catch {
      toast.error("Failed to approve");
    }
  };

  const handleRejectConfirm = async (reason) => {
    try {
      await adminService.rejectCampaign(rejectId, reason);
      toast.success("Campaign rejected");
      setCampaigns((prev) => prev.map((c) => c._id === rejectId ? { ...c, status: "rejected", adminNote: reason } : c));
    } catch {
      toast.error("Failed to reject");
    } finally {
      setRejectId(null);
    }
  };

  const displayed = filter === "pending"
    ? campaigns.filter((c) => c.status === "pending")
    : campaigns;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-800 mb-1">Campaign Approvals</h1>
        <p className="text-gray-500">Review and approve or reject submitted campaigns.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[
          { id: "pending", label: "Pending Review" },
          { id: "all",     label: "All Campaigns"  },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${
              filter === f.id
                ? "bg-linear-to-r from-emerald-500 to-emerald-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f.label}
            {f.id === "pending" && (
              <span className="ml-2 px-1.5 py-0.5 bg-white/30 rounded-full text-xs">
                {campaigns.filter((c) => c.status === "pending").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border">
          <div className="text-5xl mb-3">✅</div>
          <p className="text-gray-500">No {filter === "pending" ? "pending" : ""} campaigns.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map((c) => {
            const pct = c.goalAmount > 0 ? Math.min(((c.raisedAmount || 0) / c.goalAmount) * 100, 100) : 0;
            return (
              <div key={c._id} className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="flex gap-4 p-4">
                  <img
                    src={c.images?.[0] || "https://placehold.co/72x72/e2e8f0/94a3b8?text=CF"}
                    alt={c.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 justify-between mb-1">
                      <h3 className="font-bold text-gray-800 line-clamp-1">{c.title}</h3>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${STATUS_CLS[c.status] || STATUS_CLS.draft}`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">
                      by <span className="font-medium text-gray-700">{c.creatorId?.name}</span>
                      <span className="text-gray-400"> · {c.creatorId?.email}</span>
                      <span className="ml-2 capitalize text-teal-600 font-medium">· {c.category}</span>
                    </p>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">{c.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>Goal: <span className="font-semibold text-gray-700">{formatCurrency(c.goalAmount)}</span></span>
                      <span>Raised: <span className="font-semibold text-emerald-600">{formatCurrency(c.raisedAmount || 0)}</span></span>
                      <span className="text-gray-400">{pct.toFixed(1)}%</span>
                      {c.images?.length > 0 && <span className="flex items-center gap-1"><FaImages className="text-blue-400" /> {c.images.length}</span>}
                      {c.documents?.length > 0 && <span className="flex items-center gap-1"><FaFileAlt className="text-orange-400" /> {c.documents.length}</span>}
                    </div>
                  </div>
                </div>

                {c.adminNote && c.status === "rejected" && (
                  <div className="mx-4 mb-3 px-3 py-2 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
                    <span className="font-semibold">Rejection reason:</span> {c.adminNote}
                  </div>
                )}

                <div className="border-t px-4 py-3 flex gap-2 bg-gray-50 flex-wrap">
                  <button
                    onClick={() => setViewing(c)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FaEye /> View Full Details
                  </button>

                  {c.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(c._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                      >
                        <FaCheck /> Approve
                      </button>
                      <button
                        onClick={() => setRejectId(c._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <FaTimes /> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewing && (
        <CampaignDetailModal
          campaign={viewing}
          onClose={() => setViewing(null)}
          onApprove={handleApprove}
          onReject={(id) => { setViewing(null); setRejectId(id); }}
        />
      )}

      {rejectId && (
        <RejectModal
          onConfirm={handleRejectConfirm}
          onCancel={() => setRejectId(null)}
        />
      )}
    </div>
  );
}

export default CampaignApproval;
