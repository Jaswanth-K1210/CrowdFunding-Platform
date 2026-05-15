import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaShieldAlt, FaHandHoldingHeart, FaUsers,
  FaChartLine, FaLock, FaGlobe, FaStar, FaQuoteLeft,
  FaCheckCircle, FaArrowRight, FaHeart, FaBell,
  FaClipboardCheck, FaUserCheck, FaSearchDollar,
  FaChevronDown, FaChevronUp, FaMedal, FaFileAlt,
} from "react-icons/fa";

/* ─── Data ─────────────────────────────────────────── */

const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.09, duration: 0.55, ease: "easeOut" },
  }),
};

const stats = [
  { number: "1,000+",  label: "Campaigns Funded",  icon: FaHandHoldingHeart, color: "text-emerald-600 bg-emerald-100" },
  { number: "50,000+", label: "Generous Donors",    icon: FaUsers,            color: "text-teal-600    bg-teal-100"    },
  { number: "₹10 Cr+", label: "Total Raised",       icon: FaHeart,            color: "text-emerald-600 bg-emerald-100" },
  { number: "99.9%",   label: "Satisfaction Rate",  icon: FaStar,             color: "text-teal-600    bg-teal-100"    },
];

const pillars = [
  {
    icon: FaShieldAlt,
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    title: "Verified Campaigns",
    body: "Every campaign is manually reviewed and approved by our admin team before going live — ensuring authenticity, legitimacy, and accountability at every step.",
  },
  {
    icon: FaLock,
    color: "from-teal-500 to-cyan-500",
    bg: "bg-teal-50",
    border: "border-teal-100",
    title: "Bank-Grade Security",
    body: "All transactions run through Razorpay with 256-bit SSL encryption. Your financial data is never stored on our servers — ever.",
  },
  {
    icon: FaHandHoldingHeart,
    color: "from-emerald-600 to-green-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    title: "100% Transparent",
    body: "Track every donation in real-time. See exactly how much has been raised, where the funds are going, and how lives are being changed.",
  },
  {
    icon: FaUsers,
    color: "from-teal-600 to-emerald-500",
    bg: "bg-teal-50",
    border: "border-teal-100",
    title: "Community Driven",
    body: "Built by people who care. Our platform connects donors directly with those in need — no middlemen, no hidden agendas, just genuine impact.",
  },
  {
    icon: FaChartLine,
    color: "from-green-500 to-teal-500",
    bg: "bg-green-50",
    border: "border-green-100",
    title: "Proven Impact",
    body: "Thousands of campaigns successfully funded. Medical emergencies, education dreams, animal welfare, community projects — real lives transformed.",
  },
  {
    icon: FaGlobe,
    color: "from-cyan-500 to-emerald-500",
    bg: "bg-cyan-50",
    border: "border-cyan-100",
    title: "Accessible to All",
    body: "Anyone can start a campaign or donate. No barriers, no hidden fees, no jargon — just a platform designed to work for every Indian.",
  },
];

const verificationSteps = [
  {
    step: "01",
    icon: FaFileAlt,
    title: "Campaign Submission",
    body: "Campaign creator submits full details — story, documents, images, and bank details for fund disbursement.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    step: "02",
    icon: FaClipboardCheck,
    title: "Document Review",
    body: "Our team reviews every submitted document — medical records, certificates, or proof of need — for authenticity.",
    color: "from-teal-500 to-cyan-500",
  },
  {
    step: "03",
    icon: FaUserCheck,
    title: "Identity Verification",
    body: "Campaign creator's identity is verified through government ID and a live check before campaign goes live.",
    color: "from-cyan-500 to-emerald-500",
  },
  {
    step: "04",
    icon: FaSearchDollar,
    title: "Fund Monitoring",
    body: "Even after approval, funds are monitored and disbursed in tranches to ensure they're used for the stated purpose.",
    color: "from-emerald-500 to-green-500",
  },
];

const stories = [
  {
    name: "Anita Sharma",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    category: "Medical",
    raised: "8,50,000",
    story: "My father needed urgent heart surgery and we had no way to afford it. Within 5 days of creating a campaign, we raised over 8 lakhs. My father is alive and healthy today because of the generosity of strangers.",
    gradient: "from-emerald-50 to-teal-50",
    border: "border-emerald-200",
    tag: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "Rahul Verma",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    category: "Education",
    raised: "3,20,000",
    story: "Coming from a small village, I never thought I could afford engineering. Strangers believed in my dream. I'm now in my final year at NIT and I mentor other students from my village.",
    gradient: "from-teal-50 to-cyan-50",
    border: "border-teal-200",
    tag: "bg-teal-100 text-teal-700",
  },
  {
    name: "Sneha Patel",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    category: "Community",
    raised: "12,00,000",
    story: "Our community needed clean water. In just 3 weeks, 400+ donors helped us raise enough to build a water purification plant that now serves 2,000 families daily.",
    gradient: "from-green-50 to-emerald-50",
    border: "border-green-200",
    tag: "bg-green-100 text-green-700",
  },
  {
    name: "Dr. Meera Krishnan",
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    category: "Animals",
    raised: "5,40,000",
    story: "Through CrowdFund we've run 6 successful campaigns, saved over 200 stray animals, and built a proper shelter. The transparency of the platform built trust with our donors.",
    gradient: "from-teal-50 to-emerald-50",
    border: "border-teal-200",
    tag: "bg-teal-100 text-teal-700",
  },
];

const testimonials = [
  { name: "Vikram Joshi",   role: "Donor",            image: "https://randomuser.me/api/portraits/men/45.jpg",   msg: "I've donated to 15+ campaigns on CrowdFund. What I love most is the transparency — I can see exactly where my money goes." },
  { name: "Priya Menon",    role: "Campaign Creator", image: "https://randomuser.me/api/portraits/women/33.jpg", msg: "The approval process gave my donors confidence that my campaign was genuine. Simple, stress-free fundraising." },
  { name: "Arjun Reddy",    role: "Donor",            image: "https://randomuser.me/api/portraits/men/55.jpg",   msg: "Secure payments, real campaigns, and real impact. CrowdFund is the only platform I trust for charitable giving." },
  { name: "Kavitha Nair",   role: "Campaign Creator", image: "https://randomuser.me/api/portraits/women/52.jpg", msg: "When my son was diagnosed with a rare condition, CrowdFund became our lifeline. The community here is incredibly generous." },
  { name: "Sameer Khan",    role: "Donor",            image: "https://randomuser.me/api/portraits/men/67.jpg",   msg: "Every campaign is verified before going live. It gives me peace of mind knowing my donation reaches the right people." },
  { name: "Deepa Gupta",    role: "Campaign Creator", image: "https://randomuser.me/api/portraits/women/71.jpg", msg: "Raised funds for our school's computer lab in just 10 days. The share feature helped us reach donors we never could have found." },
];

const faqs = [
  {
    q: "How do you verify campaigns before approving them?",
    a: "Every campaign goes through a 4-step manual review: document verification, identity checks, purpose validation, and admin approval. Campaigns that don't meet our standards are rejected or asked to provide additional proof.",
  },
  {
    q: "Is my payment information secure?",
    a: "Absolutely. We use Razorpay, India's most trusted payment gateway, with 256-bit SSL encryption. Your card or UPI details are never stored on our servers — all payment data is handled entirely by Razorpay.",
  },
  {
    q: "What happens if a campaign doesn't reach its goal?",
    a: "Donors are refunded if a campaign doesn't meet its minimum required amount within the deadline. If the campaign creator wants, they can also choose to keep partial funds — donors are notified before any disbursement.",
  },
  {
    q: "How do you ensure funds are used correctly?",
    a: "We disburse funds in tranches based on campaign milestones. Campaign creators must provide proof of usage (bills, receipts, photos) before each tranche is released. Our team reviews every disbursement request.",
  },
  {
    q: "Can I get a receipt for my donation for tax purposes?",
    a: "Yes! Every donation generates an automated receipt sent to your email. For NGO campaigns with 80G certification, you'll also receive a tax exemption certificate directly from the campaign creator.",
  },
];

const trustBadges = [
  { icon: FaShieldAlt, label: "SSL Secured",       sub: "256-bit encryption"      },
  { icon: FaMedal,     label: "Admin Verified",     sub: "Every campaign reviewed" },
  { icon: FaLock,      label: "Razorpay Powered",   sub: "PCI-DSS compliant"       },
  { icon: FaBell,      label: "Real-time Tracking", sub: "Live donation updates"   },
];

/* ─── FAQ accordion ─────────────────────────────────── */

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
      >
        <span className="font-bold text-gray-800 text-sm leading-snug group-hover:text-emerald-700 transition-colors">{q}</span>
        <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${open ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-500"}`}>
          {open ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-4">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Page ──────────────────────────────────────────── */

function TrustUs() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1600&q=80')" }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-teal-900/92 via-emerald-900/80 to-teal-800/60" />

        <div className="absolute top-10 right-24 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-teal-300/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-cyan-400/8 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 text-center px-6 py-36">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 text-emerald-300 font-semibold text-sm uppercase tracking-widest mb-5">
              <FaShieldAlt className="text-xs" /> Our Commitment to You
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
              Why Trust <br className="hidden md:block" />
              <span className="text-emerald-400">CrowdFund?</span>
            </h1>
            <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
              We believe in transparency, security, and real impact.
              Here's why thousands of people choose us to give — and to receive.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {trustBadges.map((b, i) => {
                const Icon = b.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                    className="flex items-center gap-2.5 px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl"
                  >
                    <Icon className="text-emerald-300 text-sm" />
                    <div className="text-left">
                      <p className="text-white text-xs font-bold leading-none">{b.label}</p>
                      <p className="text-emerald-200/70 text-[10px] mt-0.5">{b.sub}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 h-14 -mb-1">
          <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M0 56L1440 56L1440 0C1200 46 960 56 720 38C480 20 240 0 0 28L0 56Z" fill="#f9fafb" />
          </svg>
        </div>
      </div>

      {/* ── Stats Strip ── */}
      <div className="bg-white py-14 px-6 border-b border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex flex-col items-center gap-2"
              >
                <div className={`w-11 h-11 ${s.color} rounded-xl flex items-center justify-center mb-1`}>
                  <Icon size={17} />
                </div>
                <p className="text-3xl md:text-4xl font-black text-emerald-600">{s.number}</p>
                <p className="text-sm text-gray-500 font-medium">{s.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Six Pillars ── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-widest">Built on Trust</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mt-2 mb-3">What Sets Us Apart</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Built on trust, powered by community, and designed for real impact.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className={`${r.bg} rounded-2xl p-7 border ${r.border} hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 group`}
                >
                  <div className={`w-14 h-14 bg-linear-to-br ${r.color} text-white rounded-2xl flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2.5">{r.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{r.body}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaCheckCircle size={11} /> Guaranteed
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Verification Process ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-widest">How We Verify</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mt-2 mb-3">Our 4-Step Verification Process</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Every campaign goes through a rigorous review before it's visible to donors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="hidden lg:block absolute top-11 left-[12.5%] right-[12.5%] h-0.5 bg-linear-to-r from-emerald-300 via-teal-300 to-cyan-300 z-0" />
            {verificationSteps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="relative bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 z-10 text-center"
                >
                  <div className={`w-14 h-14 bg-linear-to-br ${s.color} text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                    <Icon size={22} />
                  </div>
                  <span className="absolute top-4 right-4 text-5xl font-black text-gray-100 leading-none">{s.step}</span>
                  <h3 className="text-base font-bold text-gray-800 mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{s.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Dark Impact Banner ── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&q=80')" }}
        />
        <div className="absolute inset-0 bg-gray-900/87" />
        <div className="relative z-10 py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Real Numbers. Real Impact.</h2>
              <p className="text-gray-300 max-w-xl mx-auto text-sm">Every number here represents a life touched, a dream funded, a crisis overcome.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
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
        </div>
      </section>

      {/* ── Success Stories ── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-widest">Proof in Action</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mt-2 mb-3">Success Stories</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Real people. Real campaigns. Real impact.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stories.map((s, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className={`bg-linear-to-br ${s.gradient} border ${s.border} rounded-2xl p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <img src={s.image} alt={s.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-md shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{s.name}</h3>
                    <span className={`text-xs px-2.5 py-1 ${s.tag} font-semibold rounded-full`}>{s.category}</span>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => <FaStar key={j} className="text-yellow-400 text-xs" />)}
                  </div>
                </div>
                <FaQuoteLeft className="text-emerald-200 text-xl mb-2" />
                <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">"{s.story}"</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/60">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-600">₹{s.raised}</span>
                    <span className="text-xs text-gray-400 font-medium">raised</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                    <FaCheckCircle size={10} /> Verified Campaign
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-widest">Community Voices</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mt-2 mb-3">What People Say</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Hear directly from our donors and campaign creators.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <FaQuoteLeft className="text-emerald-200 text-2xl mb-3" />
                <p className="text-gray-600 text-sm leading-relaxed mb-5 flex-1 italic">"{t.msg}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
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

      {/* ── FAQ ── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-widest">Got Questions?</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mt-2 mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Everything you need to know about safety, security, and how we operate.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-linear-to-r from-teal-800 to-emerald-700 py-24 px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <span className="inline-block text-emerald-300 font-semibold text-sm uppercase tracking-widest mb-4">
            Ready to Act?
          </span>
          <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to Make a Difference?</h2>
          <p className="text-emerald-100 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Join thousands of donors and campaign creators building a better world —
            one campaign at a time. Verified. Transparent. Impactful.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/donate"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-teal-800 font-bold rounded-xl hover:bg-emerald-50 shadow-lg transition-colors"
            >
              Donate Now <FaHeart className="text-sm text-emerald-600" />
            </Link>
            <Link
              to="/raise"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white/60 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
            >
              Start a Campaign <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}

export default TrustUs;
