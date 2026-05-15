import "../tokens.css";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { campaignService } from "../../services/campaignService";
import { formatCurrency } from "../../utils/formatCurrency";

const CATS = [
  { id: "education", emoji: "📚" },
  { id: "medical",   emoji: "🏥" },
  { id: "animals",   emoji: "🐾" },
  { id: "business",  emoji: "📈" },
  { id: "ngo",       emoji: "🌍" },
  { id: "community", emoji: "🤝" },
  { id: "emergency", emoji: "🚨" },
  { id: "technology",emoji: "💡" },
];

function Card({ campaign }) {
  const navigate = useNavigate();
  const pct = Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100);
  const days = Math.max(0, Math.ceil((new Date(campaign.deadline) - new Date()) / 86400000));

  return (
    <motion.div layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35 }}
      onClick={() => navigate(`/campaign/${campaign._id}`)}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden flex flex-col"
      style={{ boxShadow: "var(--shadow-sm)", border: "1px solid var(--c-line)" }}
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(10,75,56,.14)" }}
    >
      <div className="relative overflow-hidden h-52">
        <img src={campaign.images?.[0] || "https://placehold.co/400x208/0A4B38/FBF7F0?text=Campaign"}
          alt={campaign.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
            style={{ background: "var(--c-gold)", color: "var(--c-dark)" }}>
            {campaign.category}
          </span>
        </div>
        {days <= 5 && days > 0 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
            {days}d left
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-base mb-2 line-clamp-2 leading-snug"
          style={{ fontFamily: "var(--ff-display)", color: "var(--c-text)" }}>
          {campaign.title}
        </h3>
        <p className="text-xs mb-4 line-clamp-2 flex-1" style={{ color: "var(--c-muted)" }}>
          {campaign.description}
        </p>

        <div>
          <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--c-muted)" }}>
            <span className="font-bold" style={{ color: "var(--c-brand)" }}>
              {formatCurrency(campaign.raisedAmount)}
            </span>
            <span>{pct.toFixed(0)}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--c-line)" }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: `linear-gradient(to right, var(--c-brand-mid), var(--c-brand-lit))` }} />
          </div>
          <div className="flex justify-between mt-2 text-xs" style={{ color: "var(--c-muted)" }}>
            <span>of {formatCurrency(campaign.goalAmount)}</span>
            <span>{campaign.donorCount || 0} donors</span>
          </div>
        </div>

        <button className="mt-4 w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-300"
          style={{ background: "var(--c-brand)", color: "white" }}>
          Donate Now →
        </button>
      </div>
    </motion.div>
  );
}

export default function FDDonatePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [campaigns, setCampaigns]       = useState([]);
  const [search, setSearch]             = useState(searchParams.get("search") || "");
  const [category, setCategory]         = useState(searchParams.get("category") || "");
  const [sort, setSort]                 = useState(searchParams.get("sort") || "");
  const [loading, setLoading]           = useState(true);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const params = { status: "approved", limit: 50 };
      if (category) params.category = category;
      if (sort)     params.sort     = sort;
      if (search)   params.search   = search;
      const res = await campaignService.getAll(params);
      setCampaigns(res.data.campaigns || []);
    } catch { setCampaigns([]); }
    finally   { setLoading(false); }
  }, [category, sort, search]);

  useEffect(() => { fetchCampaigns(); }, [category, sort, search]);
  useEffect(() => {
    const p = new URLSearchParams();
    if (category) p.set("category", category);
    if (sort)     p.set("sort", sort);
    if (search)   p.set("search", search);
    setSearchParams(p);
  }, [category, sort, search]);

  return (
    <div className="fd-root min-h-screen" style={{ background: "var(--c-bg)" }}>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden" style={{ background: "var(--c-dark)" }}>
        <div className="absolute inset-0"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1400&q=75')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.2 }} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, var(--c-dark) 50%, rgba(10,75,56,.5) 100%)" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--c-gold)" }}>
              {campaigns.length > 0 ? `${campaigns.length} Active Campaigns` : "Browse Campaigns"}
            </p>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6"
              style={{ fontFamily: "var(--ff-display)" }}>
              Find a cause <em className="italic" style={{ color: "var(--c-brand-lit)" }}>worth giving to.</em>
            </h1>

            {/* Search */}
            <div className="flex max-w-lg" style={{ background: "white", borderRadius: 14, overflow: "hidden", boxShadow: "var(--shadow-lg)" }}>
              <input
                type="text"
                placeholder="Search campaigns…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-5 py-4 text-sm outline-none"
                style={{ fontFamily: "var(--ff-body)", color: "var(--c-text)", background: "transparent" }}
              />
              <button
                onClick={() => fetchCampaigns()}
                className="px-6 text-white text-sm font-bold shrink-0"
                style={{ background: "var(--c-brand)" }}>
                Search
              </button>
            </div>
          </motion.div>
        </div>

        {/* Wave */}
        <div className="relative z-10 h-10 -mb-1">
          <svg viewBox="0 0 1440 40" fill="none" className="w-full h-full">
            <path d="M0 40L1440 40L1440 0C1200 32 960 40 720 24C480 8 240 0 0 20Z" fill="var(--c-bg)" />
          </svg>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setCategory("")}
            className="shrink-0 px-5 py-2 rounded-full text-sm font-bold transition-all"
            style={{
              background: !category ? "var(--c-brand)" : "white",
              color:      !category ? "white"          : "var(--c-muted)",
              border:     "1.5px solid",
              borderColor: !category ? "var(--c-brand)" : "var(--c-line)",
            }}>
            All
          </button>
          {CATS.map((c) => (
            <button key={c.id} onClick={() => setCategory(category === c.id ? "" : c.id)}
              className="shrink-0 flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold capitalize transition-all"
              style={{
                background:  category === c.id ? "var(--c-brand)"   : "white",
                color:       category === c.id ? "white"            : "var(--c-muted)",
                border:      "1.5px solid",
                borderColor: category === c.id ? "var(--c-brand)"   : "var(--c-line)",
              }}>
              <span>{c.emoji}</span>{c.id}
            </button>
          ))}

          <div className="ml-auto shrink-0">
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2 rounded-xl text-sm font-bold outline-none"
              style={{ background: "white", border: "1.5px solid var(--c-line)", color: "var(--c-text)", fontFamily: "var(--ff-body)" }}>
              <option value="">Sort: Default</option>
              <option value="most-funded">Most Funded</option>
              <option value="newest">Newest</option>
              <option value="ending-soon">Ending Soon</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse" style={{ border: "1px solid var(--c-line)" }}>
                <div className="h-52 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-200 rounded-full w-full" />
                  <div className="h-3 bg-gray-200 rounded-full w-1/2" />
                  <div className="h-1.5 bg-gray-200 rounded-full w-full mt-4" />
                  <div className="h-9 bg-gray-200 rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-black mb-2" style={{ fontFamily: "var(--ff-display)" }}>No campaigns found</h3>
            <p className="text-sm mb-6" style={{ color: "var(--c-muted)" }}>Try changing your filters or search term.</p>
            <button onClick={() => { setCategory(""); setSearch(""); setSort(""); }}
              className="px-6 py-3 rounded-xl font-bold text-sm text-white"
              style={{ background: "var(--c-brand)" }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence>
              {campaigns.map((c) => <Card key={c._id} campaign={c} />)}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
