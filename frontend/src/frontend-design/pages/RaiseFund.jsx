import "../tokens.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { campaignService } from "../../services/campaignService";
import { useAuth } from "../../store/authStore";

const STEPS = ["Basics", "Story", "Media", "Review"];

const CATEGORIES = [
  { id: "education",  emoji: "📚", label: "Education" },
  { id: "medical",    emoji: "🏥", label: "Medical" },
  { id: "animals",    emoji: "🐾", label: "Animals" },
  { id: "business",   emoji: "📈", label: "Business" },
  { id: "ngo",        emoji: "🌍", label: "NGO" },
  { id: "community",  emoji: "🤝", label: "Community" },
  { id: "emergency",  emoji: "🚨", label: "Emergency" },
  { id: "technology", emoji: "💡", label: "Technology" },
];

const inputStyle = {
  background: "var(--c-bg-alt)",
  border: "1.5px solid var(--c-line)",
  color: "var(--c-text)",
  fontFamily: "var(--ff-body)",
};

function StepDots({ current }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300`}
              style={{
                background: i < current ? "var(--c-brand-lit)" : i === current ? "var(--c-brand)" : "var(--c-line)",
                color: i <= current ? "white" : "var(--c-muted)",
              }}>
              {i < current ? "✓" : i + 1}
            </div>
            <span className="text-xs font-medium mt-1.5 hidden sm:block"
              style={{ color: i === current ? "var(--c-brand)" : "var(--c-muted)" }}>
              {s}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="h-0.5 w-12 sm:w-20 mx-1 mb-4 transition-all duration-500"
              style={{ background: i < current ? "var(--c-brand-lit)" : "var(--c-line)" }} />
          )}
        </div>
      ))}
    </div>
  );
}

function ImagePreview({ files, onRemove }) {
  if (!files.length) return null;
  return (
    <div className="flex flex-wrap gap-3 mt-3">
      {files.map((file, i) => (
        <div key={i} className="relative group w-20 h-20 rounded-xl overflow-hidden" style={{ border: "1.5px solid var(--c-line)" }}>
          <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
          <button onClick={() => onRemove(i)}
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-lg font-bold">
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

function DocPreview({ files, onRemove }) {
  if (!files.length) return null;
  return (
    <div className="flex flex-wrap gap-3 mt-3">
      {files.map((file, i) => (
        <div key={i} className="relative group flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: "var(--c-bg-alt)", border: "1.5px solid var(--c-line)" }}>
          <span className="text-lg">📄</span>
          <span className="text-xs font-medium max-w-24 truncate" style={{ color: "var(--c-text)" }}>{file.name}</span>
          <button onClick={() => onRemove(i)} className="ml-1 text-red-400 font-bold text-sm leading-none">×</button>
        </div>
      ))}
    </div>
  );
}

export default function FDRaiseFund() {
  const navigate = useNavigate();
  const { user }  = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title:      "",
    category:   "",
    goalAmount: "",
    location:   "",
    deadline:   "",
    description: "",
  });
  const [images, setImages]   = useState([]);
  const [docs, setDocs]       = useState([]);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validateStep = () => {
    if (step === 0) {
      if (!form.title.trim()) { toast.error("Title is required"); return false; }
      if (!form.category)     { toast.error("Select a category"); return false; }
      if (!form.goalAmount || Number(form.goalAmount) < 1000) { toast.error("Goal must be ≥ ₹1,000"); return false; }
      if (!form.deadline)     { toast.error("Deadline is required"); return false; }
    }
    if (step === 1) {
      if (form.description.trim().length < 50) { toast.error("Story must be at least 50 characters"); return false; }
    }
    return true;
  };

  const next = () => { if (validateStep()) setStep((s) => s + 1); };
  const back = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    if (!user) { toast.error("Please login first"); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach((f) => fd.append("images", f));
      docs.forEach((f)   => fd.append("documents", f));
      await campaignService.create(fd);
      toast.success("Campaign submitted for review!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 7);

  return (
    <div className="fd-root min-h-screen" style={{ background: "var(--c-bg)" }}>

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden py-16" style={{ background: "var(--c-dark)" }}>
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: "radial-gradient(ellipse at 20% 60%, var(--c-gold) 0%, transparent 55%), radial-gradient(ellipse at 80% 30%, var(--c-brand-lit) 0%, transparent 50%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "var(--c-gold)" }}>
              Start Your Campaign
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4"
              style={{ fontFamily: "var(--ff-display)", fontStyle: "italic" }}>
              Every great cause starts <em style={{ color: "var(--c-brand-lit)" }}>with one story.</em>
            </h1>
            <p className="text-white/60 text-sm max-w-md mx-auto">
              Tell us about your campaign and we'll help you reach thousands of generous donors.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Form ── */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <StepDots current={step} />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35 }}
          >

            {/* ─── STEP 0: BASICS ─── */}
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black mb-1" style={{ fontFamily: "var(--ff-display)" }}>Campaign Basics</h2>
                  <p className="text-sm" style={{ color: "var(--c-muted)" }}>Start with the essential details of your campaign.</p>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-2" style={{ color: "var(--c-muted)" }}>
                    Campaign Title *
                  </label>
                  <input value={form.title} onChange={(e) => set("title", e.target.value)}
                    placeholder="e.g. Help rebuild our school library"
                    className="w-full px-5 py-4 rounded-xl text-sm font-medium outline-none transition-all"
                    style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = "var(--c-brand)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--c-line)"} />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-3" style={{ color: "var(--c-muted)" }}>
                    Category *
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button key={cat.id} type="button"
                        onClick={() => set("category", cat.id)}
                        className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-xs font-bold transition-all"
                        style={{
                          background:  form.category === cat.id ? "var(--c-brand)" : "var(--c-bg-alt)",
                          color:       form.category === cat.id ? "white"           : "var(--c-text)",
                          border:      "1.5px solid",
                          borderColor: form.category === cat.id ? "var(--c-brand)"  : "var(--c-line)",
                        }}>
                        <span className="text-xl">{cat.emoji}</span>
                        <span>{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-2" style={{ color: "var(--c-muted)" }}>
                      Goal Amount (₹) *
                    </label>
                    <input type="number" value={form.goalAmount} onChange={(e) => set("goalAmount", e.target.value)}
                      placeholder="50000" min="1000"
                      className="w-full px-5 py-4 rounded-xl text-sm font-medium outline-none transition-all"
                      style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = "var(--c-brand)"}
                      onBlur={(e) => e.target.style.borderColor = "var(--c-line)"} />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-2" style={{ color: "var(--c-muted)" }}>
                      End Date *
                    </label>
                    <input type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)}
                      min={minDate.toISOString().split("T")[0]}
                      className="w-full px-5 py-4 rounded-xl text-sm font-medium outline-none transition-all"
                      style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = "var(--c-brand)"}
                      onBlur={(e) => e.target.style.borderColor = "var(--c-line)"} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-2" style={{ color: "var(--c-muted)" }}>
                    Location
                  </label>
                  <input value={form.location} onChange={(e) => set("location", e.target.value)}
                    placeholder="City, State"
                    className="w-full px-5 py-4 rounded-xl text-sm font-medium outline-none transition-all"
                    style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = "var(--c-brand)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--c-line)"} />
                </div>
              </div>
            )}

            {/* ─── STEP 1: STORY ─── */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black mb-1" style={{ fontFamily: "var(--ff-display)" }}>Your Campaign Story</h2>
                  <p className="text-sm" style={{ color: "var(--c-muted)" }}>
                    A compelling story raises 3× more. Share your situation honestly and specifically.
                  </p>
                </div>

                <div className="p-4 rounded-xl" style={{ background: "var(--c-bg-alt)", border: "1px solid var(--c-line)" }}>
                  <p className="text-xs font-bold mb-2" style={{ color: "var(--c-brand)" }}>💡 Tips for a great story:</p>
                  <ul className="text-xs space-y-1" style={{ color: "var(--c-muted)" }}>
                    <li>• Explain who you are and what the funds are for</li>
                    <li>• Share your personal connection to the cause</li>
                    <li>• Be specific about how donations will be used</li>
                  </ul>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-2" style={{ color: "var(--c-muted)" }}>
                    Full Description * (min. 50 characters)
                  </label>
                  <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
                    placeholder="Tell donors your story…" rows={12}
                    className="w-full px-5 py-4 rounded-xl text-sm font-medium outline-none resize-none transition-all"
                    style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = "var(--c-brand)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--c-line)"} />
                  <p className="text-xs mt-1 text-right" style={{ color: form.description.length < 50 ? "var(--c-muted)" : "var(--c-brand)" }}>
                    {form.description.length} characters
                  </p>
                </div>
              </div>
            )}

            {/* ─── STEP 2: MEDIA ─── */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black mb-1" style={{ fontFamily: "var(--ff-display)" }}>Photos & Documents</h2>
                  <p className="text-sm" style={{ color: "var(--c-muted)" }}>Campaigns with photos raise significantly more. Add proof documents for trust.</p>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-3" style={{ color: "var(--c-muted)" }}>
                    Campaign Photos (up to 5)
                  </label>
                  <label className="flex flex-col items-center justify-center gap-3 py-10 rounded-2xl cursor-pointer transition-all hover:border-[var(--c-brand)]"
                    style={{ border: "2px dashed var(--c-line)", background: "var(--c-bg-alt)" }}>
                    <span className="text-4xl">📸</span>
                    <span className="text-sm font-bold" style={{ color: "var(--c-muted)" }}>Click to add photos</span>
                    <span className="text-xs" style={{ color: "var(--c-muted)" }}>JPG, PNG, WEBP — max 5MB each</span>
                    <input type="file" accept="image/*" multiple className="hidden"
                      onChange={(e) => {
                        const selected = Array.from(e.target.files || []);
                        setImages((prev) => [...prev, ...selected].slice(0, 5));
                        e.target.value = "";
                      }} />
                  </label>
                  <ImagePreview files={images} onRemove={(i) => setImages((p) => p.filter((_, idx) => idx !== i))} />
                </div>

                {/* Documents */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-3" style={{ color: "var(--c-muted)" }}>
                    Supporting Documents (optional, up to 5)
                  </label>
                  <label className="flex flex-col items-center justify-center gap-3 py-8 rounded-2xl cursor-pointer transition-all hover:border-[var(--c-brand)]"
                    style={{ border: "2px dashed var(--c-line)", background: "var(--c-bg-alt)" }}>
                    <span className="text-4xl">📎</span>
                    <span className="text-sm font-bold" style={{ color: "var(--c-muted)" }}>Click to attach files</span>
                    <span className="text-xs" style={{ color: "var(--c-muted)" }}>PDF, DOC — medical records, ID proof, etc.</span>
                    <input type="file" accept=".pdf,.doc,.docx" multiple className="hidden"
                      onChange={(e) => {
                        const selected = Array.from(e.target.files || []);
                        setDocs((prev) => [...prev, ...selected].slice(0, 5));
                        e.target.value = "";
                      }} />
                  </label>
                  <DocPreview files={docs} onRemove={(i) => setDocs((p) => p.filter((_, idx) => idx !== i))} />
                </div>
              </div>
            )}

            {/* ─── STEP 3: REVIEW ─── */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black mb-1" style={{ fontFamily: "var(--ff-display)" }}>Review & Submit</h2>
                  <p className="text-sm" style={{ color: "var(--c-muted)" }}>Double-check everything before submitting for admin review.</p>
                </div>

                {/* Summary card */}
                <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--c-line)" }}>
                  {images.length > 0 && (
                    <img src={URL.createObjectURL(images[0])} alt="" className="w-full h-40 object-cover" />
                  )}
                  <div className="p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{CATEGORIES.find((c) => c.id === form.category)?.emoji || "📋"}</span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--c-muted)" }}>
                          {form.category}
                        </p>
                        <h3 className="text-xl font-black leading-tight" style={{ fontFamily: "var(--ff-display)" }}>{form.title}</h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Goal",     value: `₹${Number(form.goalAmount).toLocaleString("en-IN")}` },
                        { label: "Deadline", value: new Date(form.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
                        { label: "Location", value: form.location || "—" },
                        { label: "Photos",   value: `${images.length} attached` },
                      ].map((r) => (
                        <div key={r.label} className="p-3 rounded-xl" style={{ background: "var(--c-bg-alt)" }}>
                          <p className="text-xs" style={{ color: "var(--c-muted)" }}>{r.label}</p>
                          <p className="text-sm font-bold" style={{ color: "var(--c-text)" }}>{r.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 rounded-xl" style={{ background: "var(--c-bg-alt)" }}>
                      <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--c-muted)" }}>Story preview</p>
                      <p className="text-sm line-clamp-4" style={{ color: "var(--c-text)", lineHeight: 1.8 }}>
                        {form.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl" style={{ background: "#FEF3C7", border: "1px solid #FCD34D" }}>
                  <p className="text-xs font-bold" style={{ color: "#92400E" }}>📋 What happens next?</p>
                  <p className="text-xs mt-1" style={{ color: "#92400E" }}>
                    Your campaign will be reviewed by our team within 24-48 hours. You'll be notified once it's approved and goes live.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Navigation ── */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button onClick={back}
              className="flex-1 py-4 rounded-xl font-bold text-sm transition-all hover:bg-gray-100"
              style={{ border: "1.5px solid var(--c-line)", color: "var(--c-text)" }}>
              ← Back
            </button>
          )}
          {step < 3 ? (
            <button onClick={next}
              className="flex-1 py-4 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.02]"
              style={{ background: "var(--c-brand)" }}>
              Continue →
            </button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-4 rounded-xl font-black text-sm text-white transition-all disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, var(--c-brand), var(--c-brand-mid))" }}>
              {loading ? "Submitting…" : "Submit Campaign ✓"}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
