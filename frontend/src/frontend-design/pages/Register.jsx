import "../tokens.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { authService } from "../../services/authService";
import { useAuth } from "../../store/authStore";
import toast from "react-hot-toast";

const STEPS = ["Account", "Personal", "Confirm"];

export default function FDRegister() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep]       = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm]       = useState({ name: "", email: "", password: "", confirm: "" });

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error("Passwords don't match"); return; }
    setLoading(true);
    try {
      const res = await authService.register({ name: form.name, email: form.email, password: form.password });
      login(res.data.user, res.data.token);
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = {
    background: "var(--c-bg-alt)",
    border: "1.5px solid var(--c-line)",
    color: "var(--c-text)",
    fontFamily: "var(--ff-body)",
  };

  return (
    <div className="fd-root min-h-screen" style={{ background: "var(--c-bg)" }}>
      <div className="flex min-h-screen">

        {/* ── Left: Decorative panel ── */}
        <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-14 relative overflow-hidden"
          style={{ background: "var(--c-brand)" }}>

          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle at 30% 50%, var(--c-gold) 0%, transparent 60%), radial-gradient(circle at 80% 80%, var(--c-brand-lit) 0%, transparent 50%)" }} />

          <Link to="/" className="text-2xl font-black text-white relative z-10"
            style={{ fontFamily: "var(--ff-display)" }}>
            Crowd<em className="not-italic" style={{ color: "var(--c-gold)" }}>Fund</em>
          </Link>

          <div className="relative z-10">
            <h2 className="text-5xl font-black text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--ff-display)", fontStyle: "italic" }}>
              Join 50,000+ donors changing the world.
            </h2>
            <div className="space-y-4">
              {["Free to join — always", "Donate to verified campaigns only", "Download invoices & track your impact"].map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black"
                    style={{ background: "var(--c-gold)", color: "var(--c-dark)" }}>✓</div>
                  <span className="text-white/80 text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step indicators */}
          <div className="relative z-10 flex gap-2">
            {STEPS.map((s, i) => (
              <div key={s} className={`flex items-center gap-2 ${i <= step ? "opacity-100" : "opacity-40"}`}>
                <div className="w-6 h-6 rounded-full text-xs font-black flex items-center justify-center"
                  style={{ background: i <= step ? "var(--c-gold)" : "rgba(255,255,255,0.3)", color: i <= step ? "var(--c-dark)" : "white" }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span className="text-white text-xs font-medium">{s}</span>
                {i < STEPS.length - 1 && <div className="w-8 h-px bg-white/30 ml-1" />}
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Form ── */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-16">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm"
          >
            <h1 className="text-4xl font-black mb-2" style={{ fontFamily: "var(--ff-display)" }}>
              {step === 0 ? "Create Account" : step === 1 ? "Your Details" : "Almost Done!"}
            </h1>
            <p className="text-sm mb-10" style={{ color: "var(--c-muted)" }}>
              Already have an account?{" "}
              <Link to="/login" className="font-bold" style={{ color: "var(--c-brand)" }}>Sign in →</Link>
            </p>

            <form onSubmit={step < 2 ? (e) => { e.preventDefault(); setStep(step + 1); } : handleSubmit}
              className="space-y-5">

              {step === 0 && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--c-muted)" }}>Email Address</label>
                    <input name="email" type="email" placeholder="you@example.com" value={form.email}
                      onChange={handleChange} required
                      className="w-full px-5 py-3.5 rounded-xl text-sm font-medium outline-none transition-all"
                      style={inputCls}
                      onFocus={(e) => e.target.style.borderColor = "var(--c-brand)"}
                      onBlur={(e) => e.target.style.borderColor = "var(--c-line)"} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--c-muted)" }}>Password</label>
                    <input name="password" type="password" placeholder="Min. 8 characters" value={form.password}
                      onChange={handleChange} required minLength={8}
                      className="w-full px-5 py-3.5 rounded-xl text-sm font-medium outline-none transition-all"
                      style={inputCls}
                      onFocus={(e) => e.target.style.borderColor = "var(--c-brand)"}
                      onBlur={(e) => e.target.style.borderColor = "var(--c-line)"} />
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--c-muted)" }}>Full Name</label>
                    <input name="name" type="text" placeholder="Your full name" value={form.name}
                      onChange={handleChange} required
                      className="w-full px-5 py-3.5 rounded-xl text-sm font-medium outline-none transition-all"
                      style={inputCls}
                      onFocus={(e) => e.target.style.borderColor = "var(--c-brand)"}
                      onBlur={(e) => e.target.style.borderColor = "var(--c-line)"} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--c-muted)" }}>Confirm Password</label>
                    <input name="confirm" type="password" placeholder="Repeat password" value={form.confirm}
                      onChange={handleChange} required
                      className="w-full px-5 py-3.5 rounded-xl text-sm font-medium outline-none transition-all"
                      style={inputCls}
                      onFocus={(e) => e.target.style.borderColor = "var(--c-brand)"}
                      onBlur={(e) => e.target.style.borderColor = "var(--c-line)"} />
                  </div>
                </>
              )}

              {step === 2 && (
                <div className="rounded-2xl p-6 space-y-3" style={{ background: "var(--c-bg-alt)", border: "1px solid var(--c-line)" }}>
                  {[["Name", form.name], ["Email", form.email], ["Password", "••••••••"]].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm">
                      <span className="font-medium" style={{ color: "var(--c-muted)" }}>{k}</span>
                      <span className="font-bold">{v}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                {step > 0 && (
                  <button type="button" onClick={() => setStep(step - 1)}
                    className="flex-1 py-4 rounded-xl font-bold text-sm transition-all hover:bg-gray-100"
                    style={{ border: "1.5px solid var(--c-line)", color: "var(--c-text)" }}>
                    ← Back
                  </button>
                )}
                <button type="submit" disabled={loading}
                  className="flex-1 py-4 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-60"
                  style={{ background: "var(--c-brand)" }}>
                  {step < 2 ? "Continue →" : loading ? "Creating…" : "Create Account ✓"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
