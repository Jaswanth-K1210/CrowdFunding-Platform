import "../tokens.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { campaignService } from "../../services/campaignService";
import { formatCurrency } from "../../utils/formatCurrency";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [.22,1,.36,1] } },
};

const CATEGORIES = [
  { name: "Medical",    emoji: "🏥", color: "#E8F5E9", accent: "#2E7D32" },
  { name: "Education",  emoji: "📚", color: "#E3F2FD", accent: "#1565C0" },
  { name: "Animals",    emoji: "🐾", color: "#FFF3E0", accent: "#E65100" },
  { name: "Community",  emoji: "🤝", color: "#F3E5F5", accent: "#6A1B9A" },
  { name: "Emergency",  emoji: "🚨", color: "#FFEBEE", accent: "#B71C1C" },
  { name: "Technology", emoji: "💡", color: "#E0F7FA", accent: "#006064" },
  { name: "NGO",        emoji: "🌍", color: "#F9FBE7", accent: "#558B2F" },
  { name: "Business",   emoji: "📈", color: "#FFF8E1", accent: "#F57F17" },
];

function StatCounter({ end, prefix = "", suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setVal(end); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 20);
    return () => clearInterval(timer);
  }, [end]);
  return <span>{prefix}{val.toLocaleString("en-IN")}{suffix}</span>;
}

function CampaignCardFD({ campaign, large }) {
  const progress = Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100);
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/campaign/${campaign._id}`)}
      className={`group relative overflow-hidden rounded-[20px] cursor-pointer ${large ? "h-[480px]" : "h-[320px]"}`}
      style={{ boxShadow: "var(--shadow-md)" }}
    >
      <img
        src={campaign.images?.[0] || "https://placehold.co/800x480/0A4B38/FBF7F0?text=Campaign"}
        alt={campaign.title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full"
          style={{ background: "var(--c-gold)", color: "var(--c-dark)" }}>
          {campaign.category}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className={`text-white font-bold mb-3 line-clamp-2 ${large ? "text-2xl" : "text-base"}`}
          style={{ fontFamily: "var(--ff-display)" }}>
          {campaign.title}
        </h3>
        <div className="mb-2">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-white/90 font-semibold">{formatCurrency(campaign.raisedAmount)}</span>
            <span className="text-white/60">of {formatCurrency(campaign.goalAmount)}</span>
          </div>
          <div className="h-1 bg-white/25 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: "var(--c-brand-lit)" }} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/60">{campaign.donorCount || 0} donors</span>
          <span className="text-xs font-bold rounded-full px-3 py-1 text-white"
            style={{ background: "var(--c-brand-mid)" }}>
            {progress.toFixed(0)}% funded
          </span>
        </div>
      </div>
    </div>
  );
}

export default function FDHomePage() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [inView, setInView]       = useState(false);

  useEffect(() => {
    campaignService.getAll({ status: "approved", limit: 7 })
      .then((r) => setCampaigns(r.data.campaigns || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.2 });
    const el = document.getElementById("fd-stats");
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="fd-root">

      {/* ──────────── HERO ──────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: "var(--c-dark)" }}>

        {/* Background collage */}
        <div className="absolute inset-0 grid grid-cols-3 gap-1 opacity-25 pointer-events-none">
          {[
            "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=70",
            "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=70",
            "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&q=70",
            "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&q=70",
            "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&q=70",
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=70",
          ].map((src, i) => (
            <img key={i} src={src} alt="" className="w-full h-full object-cover" />
          ))}
        </div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, var(--c-dark) 55%, transparent 100%)" }} />

        {/* Noise grain */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: "256px" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-28 w-full">
          <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-3xl">

            <motion.p variants={fadeUp} className="text-sm font-bold uppercase tracking-[0.2em] mb-6"
              style={{ color: "var(--c-gold)" }}>
              ✦ India's Most Trusted Crowdfunding Platform
            </motion.p>

            <motion.h1 variants={fadeUp}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-2 leading-[0.95]"
              style={{ fontFamily: "var(--ff-display)" }}>
              Help the World.
            </motion.h1>
            <motion.h1 variants={fadeUp}
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.95]"
              style={{ fontFamily: "var(--ff-display)", fontStyle: "italic", color: "var(--c-brand-lit)" }}>
              One Campaign at a Time.
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg text-white/70 max-w-xl mb-10 leading-relaxed">
              Launch in minutes. Reach millions. Every verified campaign is reviewed so your giving is safe, transparent, and real.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/donate")}
                className="px-8 py-4 font-bold text-sm rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{ background: "var(--c-gold)", color: "var(--c-dark)" }}>
                Browse Campaigns →
              </button>
              <button
                onClick={() => navigate("/raise")}
                className="px-8 py-4 font-bold text-sm rounded-xl border-2 text-white transition-all duration-300 hover:bg-white/10"
                style={{ borderColor: "rgba(255,255,255,0.3)" }}>
                Start a Campaign
              </button>
            </motion.div>
          </motion.div>

          {/* Floating campaign preview card */}
          {campaigns[0] && (
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [.22,1,.36,1] }}
              className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-72"
            >
              <CampaignCardFD campaign={campaigns[0]} large={false} />
              <div className="text-center mt-3 text-xs text-white/40">Featured Campaign</div>
            </motion.div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs text-white/30 uppercase tracking-widest">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-8 rounded-full"
            style={{ background: "linear-gradient(to bottom, var(--c-gold), transparent)" }} />
        </div>
      </section>

      {/* ──────────── STATS ──────────── */}
      <section id="fd-stats" className="py-16 px-6"
        style={{ background: "var(--c-brand)", color: "white" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { end: 1200,   suffix: "+",    label: "Campaigns Funded" },
            { end: 50000,  suffix: "+",    label: "Donors Worldwide" },
            { end: 10,     prefix: "₹",   suffix: " Cr+", label: "Total Raised" },
            { end: 99,     suffix: ".9%",  label: "Satisfaction Rate" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="text-4xl md:text-5xl font-black mb-1"
                style={{ fontFamily: "var(--ff-display)", color: "var(--c-gold)" }}>
                {inView ? <StatCounter end={s.end} prefix={s.prefix} suffix={s.suffix} /> : `${s.prefix || ""}0${s.suffix}`}
              </div>
              <p className="text-sm text-white/70">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ──────────── CAMPAIGNS GRID ──────────── */}
      <section className="py-24 px-6" style={{ background: "var(--c-bg)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest mb-2"
                style={{ color: "var(--c-brand-mid)" }}>Live Now</p>
              <h2 className="text-4xl md:text-5xl font-black"
                style={{ fontFamily: "var(--ff-display)" }}>
                Featured Campaigns
              </h2>
            </div>
            <Link to="/donate"
              className="hidden md:inline-flex items-center gap-2 text-sm font-bold transition-colors hover:opacity-70"
              style={{ color: "var(--c-brand)" }}>
              View All →
            </Link>
          </div>

          {campaigns.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Large card left */}
              <div className="md:col-span-2 md:row-span-2">
                <CampaignCardFD campaign={campaigns[0]} large />
              </div>
              {/* Smaller cards */}
              {campaigns.slice(1, 5).map((c) => (
                <CampaignCardFD key={c._id} campaign={c} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link to="/donate"
              className="inline-block px-6 py-3 font-bold rounded-xl text-white"
              style={{ background: "var(--c-brand)" }}>
              View All Campaigns
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────── HOW IT WORKS ──────────── */}
      <section className="py-24 px-6" style={{ background: "var(--c-bg-alt)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: "var(--c-brand-mid)" }}>Simple Process</p>
            <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: "var(--ff-display)" }}>How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-px"
              style={{ background: "linear-gradient(to right, var(--c-brand-lit), var(--c-brand))" }} />

            {[
              { step: "01", title: "Create Your Campaign", body: "Fill in your story, set a goal, upload photos and documents. Takes under 10 minutes.", emoji: "✍️" },
              { step: "02", title: "Get Verified & Live",  body: "Our team reviews your campaign within 24 hours. Once approved it goes live instantly.", emoji: "✅" },
              { step: "03", title: "Receive Donations",    body: "Donors find you. Every payment is secured through Razorpay with a full receipt.", emoji: "💰" },
            ].map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="relative bg-white rounded-2xl p-8 text-center"
                style={{ boxShadow: "var(--shadow-sm)" }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-5"
                  style={{ background: "var(--c-bg)", border: "2px solid var(--c-line)" }}>
                  {step.emoji}
                </div>
                <div className="text-xs font-black uppercase tracking-widest mb-2"
                  style={{ color: "var(--c-brand-lit)" }}>{step.step}</div>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "var(--ff-display)" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--c-muted)" }}>{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── CATEGORIES ──────────── */}
      <section className="py-24 px-6" style={{ background: "var(--c-bg)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: "var(--c-brand-mid)" }}>Explore by Cause</p>
              <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: "var(--ff-display)" }}>Every Cause Matters</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={cat.name} initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}>
                <Link to={`/donate?category=${cat.name.toLowerCase()}`}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl font-semibold text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  style={{ background: cat.color, color: cat.accent }}>
                  <span className="text-3xl">{cat.emoji}</span>
                  {cat.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── TRUST STRIP ──────────── */}
      <section className="py-20 px-6 fd-clip-bottom" style={{ background: "var(--c-dark)" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-12"
            style={{ fontFamily: "var(--ff-display)" }}>
            Why thousands trust <em className="italic" style={{ color: "var(--c-brand-lit)" }}>CrowdFund</em>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "🔒", title: "Bank-grade Security",      body: "All payments via Razorpay with end-to-end encryption." },
              { icon: "📋", title: "Admin-verified Campaigns", body: "Every campaign is reviewed before going live." },
              { icon: "📊", title: "Real-time Transparency",   body: "Track every rupee in real-time on the campaign page." },
            ].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex gap-4 p-6 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <span className="text-2xl">{t.icon}</span>
                <div>
                  <h4 className="font-bold text-white mb-1" style={{ fontFamily: "var(--ff-display)" }}>{t.title}</h4>
                  <p className="text-sm text-white/55 leading-relaxed">{t.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── CTA ──────────── */}
      <section className="py-28 px-6 text-center" style={{ background: "var(--c-bg-alt)" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}>
          <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: "var(--c-brand-mid)" }}>Ready?</p>
          <h2 className="text-5xl md:text-6xl font-black mb-6 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--ff-display)" }}>
            Start your campaign <em className="italic" style={{ color: "var(--c-brand)" }}>today.</em>
          </h2>
          <p className="text-base mb-10 max-w-md mx-auto" style={{ color: "var(--c-muted)" }}>
            It's free, it's fast, and it's the most trusted platform in India.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/raise"
              className="px-10 py-4 font-bold rounded-xl text-white transition-all hover:scale-105 hover:shadow-xl"
              style={{ background: "var(--c-brand)" }}>
              Start a Campaign
            </Link>
            <Link to="/trust-us"
              className="px-10 py-4 font-bold rounded-xl border-2 transition-all hover:bg-gray-100"
              style={{ borderColor: "var(--c-line)", color: "var(--c-brand)" }}>
              Why Trust Us?
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
