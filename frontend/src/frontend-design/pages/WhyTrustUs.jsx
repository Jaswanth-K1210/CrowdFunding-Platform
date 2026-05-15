import "../tokens.css";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";

const STATS = [
  { value: "₹24Cr+", label: "Total Raised",     sub: "across all campaigns" },
  { value: "1.8L+",  label: "Donors",            sub: "who gave with confidence" },
  { value: "4,200+", label: "Campaigns Funded",  sub: "fully transparent" },
  { value: "98%",    label: "Satisfaction Rate",  sub: "verified by donors" },
];

const PILLARS = [
  {
    icon: "🔍",
    title: "Verified Campaigns Only",
    body: "Every campaign goes through manual verification by our team before going live. We check identity, cause legitimacy, and financial need — so you give with confidence, not doubt.",
  },
  {
    icon: "🔐",
    title: "Bank-Grade Payment Security",
    body: "Payments are processed through Razorpay — RBI-licensed and PCI-DSS certified. We never store your card details. Every rupee is encrypted end-to-end.",
  },
  {
    icon: "📊",
    title: "100% Transparent Funding",
    body: "Every campaign shows real-time fund flow. Donors receive itemised receipts and campaign creators must submit fund-usage reports — visible to all.",
  },
  {
    icon: "🤝",
    title: "Donor Protection Policy",
    body: "If a campaign is found fraudulent after funding, eligible donors receive a full refund. We hold funds in escrow and release them in milestones.",
  },
  {
    icon: "🏛️",
    title: "Legal & Compliance First",
    body: "CrowdFund is registered under the Companies Act. All NGO campaigns are FCRA-compliant. Tax-deductible donations are processed with 80G certificates.",
  },
  {
    icon: "📞",
    title: "Human Support, Always",
    body: "Our support team is reachable via chat, email, and phone — 7 days a week. A real person will respond within 4 hours to any concern.",
  },
];

const TESTIMONIALS = [
  {
    quote: "I was skeptical about donating online. But CrowdFund's transparency — real photos, hospital reports, and a live tracker — made me donate ₹10,000 without hesitation.",
    name: "Kavitha R.",
    role: "Donor, Bangalore",
    img: "https://i.pravatar.cc/80?img=47",
  },
  {
    quote: "We raised ₹18 lakhs for my daughter's treatment in just 12 days. The team personally called us to verify our documents. I felt genuinely supported.",
    name: "Ramesh Nair",
    role: "Campaign Creator, Kochi",
    img: "https://i.pravatar.cc/80?img=12",
  },
  {
    quote: "Our NGO has been using CrowdFund for 2 years. The FCRA compliance tools saved us weeks of paperwork. Donations are now fully auditable.",
    name: "Priya Mehta",
    role: "NGO Director, Mumbai",
    img: "https://i.pravatar.cc/80?img=32",
  },
];

const PARTNERS = ["Razorpay", "AWS", "Google", "Cloudinary", "Twilio"];

function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
}

export default function FDWhyTrustUs() {
  return (
    <div className="fd-root min-h-screen" style={{ background: "var(--c-bg)" }}>

      {/* ── HERO ── */}
      <div className="relative overflow-hidden" style={{ background: "var(--c-dark)", minHeight: 520 }}>
        <div className="absolute inset-0"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1400&q=75')", backgroundSize: "cover", backgroundPosition: "center top", opacity: 0.18 }} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(160deg, var(--c-dark) 40%, rgba(10,75,56,0.55) 100%)" }} />

        {/* Grain overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: "var(--c-gold)" }}>
              Transparency · Security · Impact
            </p>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-none"
              style={{ fontFamily: "var(--ff-display)" }}>
              Why donors trust <br/>
              <em className="italic" style={{ color: "var(--c-brand-lit)" }}>CrowdFund.</em>
            </h1>
            <p className="text-white/60 text-base max-w-xl mx-auto mb-10 leading-relaxed">
              We believe in radical transparency. Every rupee, every campaign, every donor is treated with the highest standard of integrity.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/donate"
                className="px-8 py-4 rounded-2xl font-black text-sm text-white transition-all hover:scale-105"
                style={{ background: "var(--c-brand)" }}>
                Browse Campaigns →
              </Link>
              <Link to="/raise-fund"
                className="px-8 py-4 rounded-2xl font-black text-sm transition-all hover:scale-105"
                style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1.5px solid rgba(255,255,255,0.2)" }}>
                Start a Campaign
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Wave */}
        <div className="relative z-10 -mb-1">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path d="M0 60L1440 60L1440 0C1200 48 900 60 720 36C540 12 240 0 0 30Z" fill="var(--c-bg)" />
          </svg>
        </div>
      </div>

      {/* ── STATS STRIP ── */}
      <div className="max-w-5xl mx-auto px-6 -mt-4 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.1}>
              <div className="text-center py-8 px-4 rounded-2xl"
                style={{ background: "white", border: "1px solid var(--c-line)", boxShadow: "var(--shadow-sm)" }}>
                <p className="text-3xl font-black mb-1" style={{ fontFamily: "var(--ff-display)", color: "var(--c-brand)" }}>
                  {s.value}
                </p>
                <p className="text-sm font-bold" style={{ color: "var(--c-text)" }}>{s.label}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--c-muted)" }}>{s.sub}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* ── PILLARS ── */}
      <div className="max-w-5xl mx-auto px-6 mb-24">
        <FadeIn>
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "var(--c-gold)" }}>Our Commitments</p>
            <h2 className="text-4xl font-black" style={{ fontFamily: "var(--ff-display)" }}>
              Built on <em className="italic">trust, not just promises.</em>
            </h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(10,75,56,.12)" }}
                className="p-7 rounded-2xl transition-all"
                style={{ background: "white", border: "1px solid var(--c-line)", boxShadow: "var(--shadow-sm)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
                  style={{ background: "var(--c-bg-alt)" }}>
                  {p.icon}
                </div>
                <h3 className="text-lg font-black mb-3 leading-tight"
                  style={{ fontFamily: "var(--ff-display)", color: "var(--c-text)" }}>
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--c-muted)", lineHeight: 1.8 }}>
                  {p.body}
                </p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* ── HOW FUNDS ARE PROTECTED ── */}
      <div className="py-20" style={{ background: "var(--c-dark)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "var(--c-gold)" }}>How We Protect Your Money</p>
              <h2 className="text-4xl font-black text-white" style={{ fontFamily: "var(--ff-display)" }}>
                The <em className="italic" style={{ color: "var(--c-brand-lit)" }}>escrow process</em> explained.
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: "01", icon: "💳", title: "You Donate", desc: "Payment secured via Razorpay. Receipt generated instantly." },
              { step: "02", icon: "🏦", title: "Funds in Escrow", desc: "Held securely until milestone conditions are verified." },
              { step: "03", icon: "✅", title: "Verification", desc: "Our team verifies campaign progress against proof submitted." },
              { step: "04", icon: "📤", title: "Funds Released", desc: "Creator receives funds in staged milestones, not lump sum." },
            ].map((s, i) => (
              <FadeIn key={s.step} delay={i * 0.12}>
                <div className="relative text-center p-6 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-black"
                    style={{ background: "var(--c-gold)", color: "var(--c-dark)" }}>
                    {s.step}
                  </div>
                  <div className="text-3xl mt-4 mb-3">{s.icon}</div>
                  <h4 className="text-white font-black text-base mb-2" style={{ fontFamily: "var(--ff-display)" }}>{s.title}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <div className="max-w-5xl mx-auto px-6 py-24">
        <FadeIn>
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "var(--c-gold)" }}>Real Stories</p>
            <h2 className="text-4xl font-black" style={{ fontFamily: "var(--ff-display)" }}>
              Thousands trust us. <em className="italic">Here's why.</em>
            </h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.1}>
              <div className="p-7 rounded-2xl flex flex-col"
                style={{ background: "white", border: "1px solid var(--c-line)", boxShadow: "var(--shadow-sm)" }}>
                <div className="text-3xl mb-4" style={{ color: "var(--c-gold)" }}>"</div>
                <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: "var(--c-text)", lineHeight: 1.85 }}>
                  {t.quote}
                </p>
                <div className="flex items-center gap-3">
                  <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-black" style={{ color: "var(--c-text)" }}>{t.name}</p>
                    <p className="text-xs" style={{ color: "var(--c-muted)" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* ── PARTNERS ── */}
      <div className="py-14" style={{ background: "var(--c-bg-alt)", borderTop: "1px solid var(--c-line)" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-black uppercase tracking-widest mb-8" style={{ color: "var(--c-muted)" }}>
            Trusted infrastructure partners
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {PARTNERS.map((p) => (
              <span key={p} className="text-lg font-black opacity-40 hover:opacity-70 transition-opacity" style={{ color: "var(--c-text)" }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="py-20 text-center" style={{ background: "var(--c-bg)" }}>
        <FadeIn>
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight" style={{ fontFamily: "var(--ff-display)" }}>
              Ready to make a <em className="italic" style={{ color: "var(--c-brand)" }}>difference?</em>
            </h2>
            <p className="text-sm mb-8" style={{ color: "var(--c-muted)" }}>
              Browse verified campaigns and give with complete peace of mind.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/donate"
                className="px-8 py-4 rounded-2xl font-black text-sm text-white transition-all hover:scale-105 hover:shadow-lg"
                style={{ background: "var(--c-brand)" }}>
                Browse Campaigns →
              </Link>
              <Link to="/raise-fund"
                className="px-8 py-4 rounded-2xl font-black text-sm transition-all hover:scale-105"
                style={{ border: "1.5px solid var(--c-brand)", color: "var(--c-brand)" }}>
                Start a Campaign
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
