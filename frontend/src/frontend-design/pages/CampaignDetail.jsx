import "../tokens.css";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { campaignService } from "../../services/campaignService";
import { donationService } from "../../services/donationService";
import { useAuth } from "../../store/authStore";
import { formatCurrency } from "../../utils/formatCurrency";

const QUICK_AMOUNTS = [100, 250, 500, 1000, 2500, 5000];

function DonorRow({ donation, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.06 }}
      className="flex items-center gap-4 py-3"
      style={{ borderBottom: "1px solid var(--c-line)" }}
    >
      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-black"
        style={{ background: "var(--c-brand)", color: "white" }}>
        {donation.isAnonymous ? "?" : (donation.donorId?.name || "D")[0].toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold truncate" style={{ color: "var(--c-text)" }}>
          {donation.isAnonymous ? "Anonymous" : donation.donorId?.name || "Donor"}
        </p>
        {donation.message && (
          <p className="text-xs truncate" style={{ color: "var(--c-muted)" }}>"{donation.message}"</p>
        )}
      </div>
      <span className="text-sm font-black shrink-0" style={{ color: "var(--c-brand)" }}>
        {formatCurrency(donation.amount)}
      </span>
    </motion.div>
  );
}

export default function FDCampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const donateRef = useRef(null);

  const [campaign, setCampaign]     = useState(null);
  const [donations, setDonations]   = useState([]);
  const [comments, setComments]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [amount, setAmount]         = useState("");
  const [message, setMessage]       = useState("");
  const [anonymous, setAnonymous]   = useState(false);
  const [donating, setDonating]     = useState(false);
  const [activeImg, setActiveImg]   = useState(0);
  const [tab, setTab]               = useState("story");
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    Promise.all([
      campaignService.getById(id),
      donationService.getCampaignDonations(id),
    ]).then(([c, d]) => {
      setCampaign(c.data.campaign);
      setComments(c.data.comments || []);
      setDonations(d.data || []);
    }).catch(() => toast.error("Failed to load campaign"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDonate = async () => {
    if (!user) { toast.error("Please login to donate"); return; }
    if (!amount || Number(amount) <= 0) { toast.error("Enter a valid amount"); return; }
    setDonating(true);
    try {
      const res = await donationService.create({
        campaignId: id,
        amount: Number(amount),
        message,
        isAnonymous: anonymous,
      });
      if (res.data.razorpayOrderId) {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: res.data.amount,
          currency: "INR",
          name: "CrowdFund",
          description: campaign.title,
          order_id: res.data.razorpayOrderId,
          handler: async (response) => {
            await donationService.verify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              donationId: res.data.donationId,
            });
            toast.success("Thank you for your donation!");
            const updated = await campaignService.getById(id);
            setCampaign(updated.data.campaign);
            const updDons = await donationService.getCampaignDonations(id);
            setDonations(updDons.data || []);
            setAmount(""); setMessage("");
          },
          theme: { color: "#0A4B38" },
        };
        new window.Razorpay(options).open();
      }
    } catch { toast.error("Donation failed. Try again."); }
    finally { setDonating(false); }
  };

  if (loading) return (
    <div className="fd-root min-h-screen flex items-center justify-center" style={{ background: "var(--c-bg)" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 animate-spin"
          style={{ borderColor: "var(--c-line)", borderTopColor: "var(--c-brand)" }} />
        <p className="text-sm font-medium" style={{ color: "var(--c-muted)" }}>Loading campaign…</p>
      </div>
    </div>
  );

  if (!campaign) return (
    <div className="fd-root min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "var(--c-bg)" }}>
      <div className="text-6xl">🔍</div>
      <h2 className="text-2xl font-black" style={{ fontFamily: "var(--ff-display)" }}>Campaign not found</h2>
      <button onClick={() => navigate("/donate")} className="px-6 py-3 rounded-xl text-sm font-bold text-white" style={{ background: "var(--c-brand)" }}>
        Browse Campaigns
      </button>
    </div>
  );

  const pct   = Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100);
  const days  = Math.max(0, Math.ceil((new Date(campaign.deadline) - new Date()) / 86400000));
  const imgs  = campaign.images?.length ? campaign.images : ["https://placehold.co/800x500/0A4B38/FBF7F0?text=Campaign"];

  return (
    <div className="fd-root min-h-screen" style={{ background: "var(--c-bg)" }}>

      {/* ── Breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-2">
        <nav className="flex items-center gap-2 text-xs" style={{ color: "var(--c-muted)" }}>
          <Link to="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link to="/donate" className="hover:underline">Campaigns</Link>
          <span>/</span>
          <span className="font-medium truncate max-w-48" style={{ color: "var(--c-text)" }}>{campaign.title}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

        {/* ── LEFT ── */}
        <div>
          {/* Image gallery */}
          <div className="relative rounded-3xl overflow-hidden mb-6" style={{ boxShadow: "var(--shadow-lg)" }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImg}
                src={imgs[activeImg]}
                alt={campaign.title}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full object-cover"
                style={{ height: 420 }}
              />
            </AnimatePresence>

            {/* Category badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
                style={{ background: "var(--c-gold)", color: "var(--c-dark)" }}>
                {campaign.category}
              </span>
            </div>

            {/* Days left */}
            {days > 0 && days <= 7 && (
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-black bg-red-500 text-white">
                {days}d left
              </div>
            )}

            {/* Thumbnail strip */}
            {imgs.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {imgs.map((src, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className="w-14 h-10 rounded-lg overflow-hidden border-2 transition-all"
                    style={{ borderColor: i === activeImg ? "var(--c-gold)" : "rgba(255,255,255,0.4)" }}>
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-black leading-tight mb-3"
            style={{ fontFamily: "var(--ff-display)", color: "var(--c-text)" }}>
            {campaign.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm" style={{ color: "var(--c-muted)" }}>
            {campaign.location && (
              <span className="flex items-center gap-1.5">
                <span>📍</span> {campaign.location}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <span>📅</span> Ends {new Date(campaign.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1.5">
              <span>👥</span> {campaign.donorCount || 0} donors
            </span>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: "var(--c-bg-alt)" }}>
            {[
              { id: "story",    label: "Story" },
              { id: "updates",  label: `Donors (${donations.length})` },
              { id: "docs",     label: "Documents" },
            ].map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="flex-1 py-2.5 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: tab === t.id ? "white" : "transparent",
                  color:      tab === t.id ? "var(--c-brand)" : "var(--c-muted)",
                  boxShadow:  tab === t.id ? "var(--shadow-sm)" : "none",
                }}>
                {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "story" && (
              <motion.div key="story" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <p className="leading-relaxed text-base whitespace-pre-wrap" style={{ color: "var(--c-text)", lineHeight: 1.85 }}>
                  {campaign.description}
                </p>

                {/* Creator card */}
                <div className="mt-8 flex items-center gap-4 p-5 rounded-2xl" style={{ background: "var(--c-bg-alt)", border: "1px solid var(--c-line)" }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg"
                    style={{ background: "var(--c-brand)", color: "white" }}>
                    {(campaign.creatorId?.name || "U")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: "var(--c-muted)" }}>Campaign organiser</p>
                    <p className="font-bold text-sm" style={{ color: "var(--c-text)" }}>{campaign.creatorId?.name || "Organiser"}</p>
                  </div>
                </div>

                {/* Comments */}
                <div className="mt-8">
                  <h3 className="text-lg font-black mb-4" style={{ fontFamily: "var(--ff-display)" }}>Comments</h3>
                  {comments.length === 0 && (
                    <p className="text-sm py-4 text-center" style={{ color: "var(--c-muted)" }}>No comments yet. Be the first!</p>
                  )}
                  {comments.map((c, i) => (
                    <div key={c._id || i} className="flex gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-black"
                        style={{ background: "var(--c-bg-alt)", border: "1px solid var(--c-line)", color: "var(--c-brand)" }}>
                        {(c.userId?.name || "U")[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold mb-1" style={{ color: "var(--c-muted)" }}>{c.userId?.name || "User"}</p>
                        <p className="text-sm" style={{ color: "var(--c-text)" }}>{c.text}</p>
                      </div>
                    </div>
                  ))}
                  {user && (
                    <div className="flex gap-3 mt-4">
                      <input value={newComment} onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment…"
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
                        style={{ background: "var(--c-bg-alt)", border: "1.5px solid var(--c-line)", color: "var(--c-text)" }} />
                      <button onClick={() => setNewComment("")}
                        className="px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                        style={{ background: "var(--c-brand)" }}>Post</button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {tab === "updates" && (
              <motion.div key="updates" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {donations.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-3">💚</div>
                    <p className="font-bold mb-1" style={{ color: "var(--c-text)" }}>No donations yet</p>
                    <p className="text-sm" style={{ color: "var(--c-muted)" }}>Be the first to contribute!</p>
                  </div>
                ) : (
                  <div>
                    {donations.map((d, i) => <DonorRow key={d._id} donation={d} i={i} />)}
                  </div>
                )}
              </motion.div>
            )}

            {tab === "docs" && (
              <motion.div key="docs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {!campaign.documents?.length ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-3">📁</div>
                    <p className="font-bold" style={{ color: "var(--c-muted)" }}>No documents uploaded</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {campaign.documents.map((doc, i) => (
                      <a key={i} href={doc} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:-translate-y-1"
                        style={{ background: "var(--c-bg-alt)", border: "1px solid var(--c-line)", boxShadow: "var(--shadow-sm)" }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl"
                          style={{ background: "var(--c-brand)", color: "white" }}>📄</div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate" style={{ color: "var(--c-text)" }}>
                            Document {i + 1}
                          </p>
                          <p className="text-xs" style={{ color: "var(--c-brand)" }}>View →</p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── RIGHT: Sticky donate panel ── */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl overflow-hidden" ref={donateRef}
            style={{ background: "white", border: "1px solid var(--c-line)", boxShadow: "var(--shadow-lg)" }}>

            {/* Progress header */}
            <div className="p-7" style={{ background: "var(--c-dark)" }}>
              <div className="flex justify-between text-xs mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
                <span className="font-black text-xl" style={{ color: "var(--c-brand-lit)", fontFamily: "var(--ff-display)" }}>
                  {formatCurrency(campaign.raisedAmount)}
                </span>
                <span className="self-end">{pct.toFixed(0)}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: "rgba(255,255,255,0.15)" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(to right, var(--c-brand-mid), var(--c-brand-lit))` }} />
              </div>
              <div className="flex justify-between text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                <span>of {formatCurrency(campaign.goalAmount)} goal</span>
                <span>{days > 0 ? `${days} days left` : "Ended"}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { label: "Donors", value: campaign.donorCount || 0 },
                  { label: "Days Left", value: days },
                ].map((s) => (
                  <div key={s.label} className="text-center py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <p className="text-xl font-black text-white" style={{ fontFamily: "var(--ff-display)" }}>{s.value}</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Donate form */}
            <div className="p-6 space-y-4">
              <p className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--c-muted)" }}>Quick Amounts</p>
              <div className="grid grid-cols-3 gap-2">
                {QUICK_AMOUNTS.map((q) => (
                  <button key={q} onClick={() => setAmount(String(q))}
                    className="py-2 rounded-xl text-xs font-bold transition-all"
                    style={{
                      background: amount === String(q) ? "var(--c-brand)" : "var(--c-bg-alt)",
                      color:      amount === String(q) ? "white" : "var(--c-text)",
                      border:     "1.5px solid",
                      borderColor: amount === String(q) ? "var(--c-brand)" : "var(--c-line)",
                    }}>
                    ₹{q >= 1000 ? `${q / 1000}k` : q}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--c-muted)" }}>
                  Custom Amount (₹)
                </label>
                <input type="number" placeholder="Enter amount"
                  value={amount} onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none"
                  style={{ background: "var(--c-bg-alt)", border: "1.5px solid var(--c-line)", color: "var(--c-text)" }}
                  onFocus={(e) => e.target.style.borderColor = "var(--c-brand)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--c-line)"} />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--c-muted)" }}>
                  Message (optional)
                </label>
                <textarea placeholder="Leave an encouraging message…" rows={2}
                  value={message} onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                  style={{ background: "var(--c-bg-alt)", border: "1.5px solid var(--c-line)", color: "var(--c-text)" }}
                  onFocus={(e) => e.target.style.borderColor = "var(--c-brand)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--c-line)"} />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded accent-emerald-700" />
                <span className="text-xs font-medium" style={{ color: "var(--c-muted)" }}>Donate anonymously</span>
              </label>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDonate}
                disabled={donating || !amount}
                className="w-full py-4 rounded-xl font-black text-base text-white transition-all disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, var(--c-brand), var(--c-brand-mid))", fontFamily: "var(--ff-display)" }}>
                {donating ? "Processing…" : `Donate ${amount ? formatCurrency(Number(amount)) : "Now"} →`}
              </motion.button>

              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="text-xs" style={{ color: "var(--c-muted)" }}>🔒 Secured by Razorpay · 100% safe</span>
              </div>
            </div>
          </div>

          {/* Share */}
          <button
            onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}
            className="mt-4 w-full py-3 rounded-xl text-sm font-bold transition-all hover:bg-gray-100"
            style={{ border: "1.5px solid var(--c-line)", color: "var(--c-text)", background: "white" }}>
            🔗 Share Campaign
          </button>
        </div>
      </div>
    </div>
  );
}
