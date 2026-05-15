import { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { campaignService } from "../services/campaignService";
import CampaignCard from "../components/campaign/CampaignCard.jsx";
import {
  FaSearch, FaFilter, FaHeart, FaShieldAlt, FaBolt,
  FaHandHoldingHeart, FaUsers, FaCheckCircle, FaArrowRight,
  FaStar, FaQuoteLeft,
} from "react-icons/fa";

const CATEGORIES = [
  "education", "medical", "animals", "business",
  "ngo", "community", "emergency", "technology",
];

const SORT_OPTIONS = [
  { value: "",            label: "Sort By" },
  { value: "most-funded", label: "Most Funded" },
  { value: "newest",      label: "Newest" },
  { value: "ending-soon", label: "Ending Soon" },
];

const CATEGORY_ICONS = {
  education: "🎓", medical: "🏥", animals: "🐾", business: "💼",
  ngo: "🌍", community: "🤝", emergency: "🚨", technology: "💻",
};

const stats = [
  { number: "1,000+",  label: "Campaigns Funded",  icon: FaHandHoldingHeart },
  { number: "50,000+", label: "Generous Donors",    icon: FaUsers },
  { number: "₹10 Cr+", label: "Total Raised",       icon: FaHeart },
  { number: "99.9%",   label: "Satisfaction Rate",  icon: FaStar },
];

const steps = [
  {
    step: "01",
    icon: FaSearch,
    title: "Browse Campaigns",
    body: "Explore hundreds of verified campaigns across education, medical, animals, and more. Use filters and search to find causes close to your heart.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    step: "02",
    icon: FaShieldAlt,
    title: "Choose & Trust",
    body: "Every campaign is reviewed and approved by our admin team. Read the story, see the documents, and donate with full confidence.",
    color: "from-teal-500 to-cyan-500",
  },
  {
    step: "03",
    icon: FaBolt,
    title: "Donate Securely",
    body: "Pay via Razorpay with bank-grade encryption. Track your donation in real-time and see the direct impact your generosity creates.",
    color: "from-cyan-500 to-emerald-500",
  },
];

const testimonials = [
  { name: "Vikram Joshi",  role: "Donor",            image: "https://randomuser.me/api/portraits/men/45.jpg",   msg: "I've donated to 15+ campaigns. The transparency is unmatched — I can see exactly where every rupee goes." },
  { name: "Priya Menon",   role: "Beneficiary",      image: "https://randomuser.me/api/portraits/women/33.jpg", msg: "Within 3 days of creating my campaign, kind strangers helped fund my daughter's surgery. Life-changing." },
  { name: "Arjun Reddy",   role: "Monthly Donor",    image: "https://randomuser.me/api/portraits/men/55.jpg",   msg: "Secure payments, verified campaigns, real impact. CrowdFund is the only platform I trust for giving." },
];

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

function DonatePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [campaigns, setCampaigns]       = useState([]);
  const [search, setSearch]             = useState(searchParams.get("search")   || "");
  const [category, setCategory]         = useState(searchParams.get("category") || "");
  const [sort, setSort]                 = useState(searchParams.get("sort")     || "");
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (sort)     params.set("sort", sort);
    if (search)   params.set("search", search);
    setSearchParams(params);
  }, [category, sort, search]);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const params = { status: "approved", limit: 50 };
      if (category) params.category = category;
      if (sort)     params.sort     = sort;
      if (search)   params.search   = search;
      const res = await campaignService.getAll(params);
      setCampaigns(res.data.campaigns || []);
    } catch {
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, [category, sort, search]);

  useEffect(() => { fetchCampaigns(); }, [category, sort, search]);

  const activeCategory = CATEGORIES.find((c) => c === category);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1600&q=80')" }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-teal-900/90 via-emerald-900/78 to-teal-800/60" />

        {/* Decorative orbs */}
        <div className="absolute top-10 right-20 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-56 h-56 bg-teal-300/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 px-6 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <span className="inline-flex items-center gap-2 text-emerald-300 font-semibold text-sm uppercase tracking-widest mb-5">
              <FaHeart className="text-xs animate-pulse" /> Make a Difference Today
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-5 leading-tight">
              Donate to a <br className="hidden md:block" />
              <span className="text-emerald-400">Campaign</span>
            </h1>
            <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Every rupee counts. Browse verified campaigns and support
              the causes that matter to you — securely and transparently.
            </p>

            {/* Search bar */}
            <form
              onSubmit={(e) => { e.preventDefault(); fetchCampaigns(); }}
              className="flex max-w-2xl mx-auto shadow-2xl rounded-2xl overflow-hidden"
            >
              <div className="relative flex-1">
                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search campaigns by title or cause..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 text-gray-800 focus:outline-none text-sm font-medium bg-white"
                />
              </div>
              <button
                type="submit"
                className="px-7 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-colors flex items-center gap-2 text-sm"
              >
                Search <FaArrowRight className="text-xs" />
              </button>
            </form>

            {/* Quick category pills inside hero */}
            <div className="flex flex-wrap justify-center gap-2 mt-7">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat === category ? "" : cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize backdrop-blur-sm border transition-all ${
                    category === cat
                      ? "bg-emerald-500 border-emerald-400 text-white"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }`}
                >
                  {CATEGORY_ICONS[cat]} {cat}
                </button>
              ))}
              <span className="px-4 py-1.5 text-xs text-emerald-200 font-medium flex items-center">
                +{CATEGORIES.length - 5} more below ↓
              </span>
            </div>
          </motion.div>
        </div>

        {/* Wave bottom */}
        <div className="relative z-10 h-14 -mb-1">
          <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M0 56L1440 56L1440 0C1200 46 960 56 720 38C480 20 240 0 0 28L0 56Z" fill="#f9fafb" />
          </svg>
        </div>
      </div>


 

      {/* ── Filters & Campaign Grid ── */}
      <div className="px-6 py-10 max-w-7xl mx-auto w-full">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-800">Browse Campaigns</h2>
            <p className="text-gray-400 text-sm mt-1">All campaigns are verified and approved by our team</p>
          </div>
          {(activeCategory || search) && (
            <button
              onClick={() => { setCategory(""); setSearch(""); setSort(""); }}
              className="text-sm text-red-400 hover:text-red-600 font-medium underline underline-offset-2 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center mb-3">
          <div className="flex items-center gap-2 text-gray-400 text-sm font-medium shrink-0">
            <FaFilter className="text-xs" />
            <span>Filter:</span>
          </div>

          <div className="flex flex-wrap gap-2 flex-1">
            <button
              onClick={() => setCategory("")}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                !category
                  ? "bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat === category ? "" : cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-all ${
                  category === cat
                    ? "bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {CATEGORY_ICONS[cat]} {cat}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-1.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50 shrink-0"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Active filter chips */}
        {(activeCategory || search) && (
          <div className="mb-5 flex items-center gap-2 text-sm text-gray-500">
            <span>Showing results for</span>
            {activeCategory && (
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full font-semibold capitalize">{activeCategory}</span>
            )}
            {search && (
              <span className="px-2.5 py-1 bg-teal-100 text-teal-700 rounded-full font-medium">"{search}"</span>
            )}
          </div>
        )}

        {/* Campaign grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border animate-pulse">
                <div className="h-56 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-200 rounded-full w-1/3" />
                  <div className="h-4 bg-gray-200 rounded-full w-full" />
                  <div className="h-4 bg-gray-200 rounded-full w-2/3" />
                  <div className="h-2 bg-gray-200 rounded-full w-full mt-4" />
                  <div className="h-10 bg-gray-200 rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-28">
            <div className="text-7xl mb-5">🔍</div>
            <h3 className="text-2xl font-black text-gray-700 mb-2">No campaigns found</h3>
            <p className="text-gray-400 mb-8 max-w-sm mx-auto">Try adjusting your search terms or clearing your filters to see all campaigns.</p>
            <button
              onClick={() => { setCategory(""); setSearch(""); setSort(""); }}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors shadow-md"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-5 flex items-center gap-2">
              <FaCheckCircle className="text-emerald-500" />
              <span>
                <span className="font-semibold text-gray-700">{campaigns.length}</span>{" "}
                verified campaign{campaigns.length !== 1 ? "s" : ""} found
              </span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {campaigns.map((campaign, i) => (
                <motion.div
                  key={campaign._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.3), duration: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  className="h-full"
                >
                  <CampaignCard campaign={campaign} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Mid-page Impact Banner ── */}
      <section className="relative overflow-hidden my-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&q=80')" }}
        />
        <div className="absolute inset-0 bg-gray-900/85" />
        <div className="relative z-10 py-20 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <p className="text-4xl md:text-5xl font-black text-emerald-400 mb-2">{s.number}</p>
                <p className="text-sm text-gray-300 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-widest">Real Stories</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mt-2 mb-3">What Donors Say</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Join thousands of people who've already made a difference.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <FaQuoteLeft className="text-emerald-200 text-2xl mb-3" />
                <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">"{t.msg}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                  <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-100" />
                  <div>
                    <p className="font-bold text-sm text-gray-800">{t.name}</p>
                    <p className="text-xs text-emerald-500 font-medium">{t.role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[...Array(5)].map((_, j) => <FaStar key={j} className="text-yellow-400 text-xs" />)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
                   {/* ── How It Works ── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-widest">Simple &amp; Transparent</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mt-2 mb-3">How Donating Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Three steps to change a life — yours and theirs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-linear-to-r from-emerald-300 via-teal-300 to-cyan-300 z-0" />

            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 z-10 text-center"
                >
                  <div className={`w-16 h-16 bg-linear-to-br ${s.color} text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                    <Icon size={26} />
                  </div>
                  <span className="absolute top-5 right-5 text-4xl font-black text-gray-100">{s.step}</span>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      {/* ── Bottom CTA ── */}
      <section className="bg-linear-to-r from-teal-800 to-emerald-700 py-20 px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block text-emerald-300 font-semibold text-sm uppercase tracking-widest mb-4">
            Be the Change
          </span>
          <h2 className="text-3xl md:text-4xl font-black mb-4">Have a Cause That Needs Support?</h2>
          <p className="text-emerald-100 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Start your own campaign and reach thousands of donors who care.
            Verified, transparent, and free to get started.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/raise"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-teal-800 font-bold rounded-xl hover:bg-emerald-50 shadow-lg transition-colors"
            >
              Start a Campaign <FaArrowRight className="text-sm" />
            </Link>
            <Link
              to="/why-trust-us"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white/60 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
            >
              Why Trust Us <FaShieldAlt className="text-sm" />
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}

export default DonatePage;
