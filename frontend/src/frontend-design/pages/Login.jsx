import "../tokens.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { authService } from "../../services/authService";
import { useAuth } from "../../store/authStore";
import toast from "react-hot-toast";

const SLIDES = [
  { img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&q=80", quote: "₹8.5 lakhs raised in 5 days for my father's surgery.", name: "Anita Sharma" },
  { img: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=900&q=80", quote: "12,00,000 raised to build a water plant for 2,000 families.", name: "Sneha Patel" },
  { img: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=900&q=80", quote: "Education funding that changed my life — and my village.", name: "Rahul Verma" },
];

export default function FDLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [slide, setSlide]     = useState(0);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login(form);
      login(res.data.user, res.data.token);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fd-root min-h-screen flex" style={{ background: "var(--c-bg)" }}>

      {/* ── Left panel: Brand story ── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden flex-col justify-end">
        <img
          src={SLIDES[slide].img}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
        />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to top, var(--c-dark) 40%, rgba(10,20,15,0.3) 100%)" }} />

        {/* Slide content */}
        <div className="relative z-10 p-14">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: "var(--c-gold)" }}>Real Story</p>
            <blockquote className="text-3xl font-black text-white leading-tight mb-3"
              style={{ fontFamily: "var(--ff-display)", fontStyle: "italic" }}>
              "{SLIDES[slide].quote}"
            </blockquote>
            <p className="text-white/60 text-sm">— {SLIDES[slide].name}</p>
          </div>

          {/* Slide dots */}
          <div className="flex gap-2">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)}
                className="h-1 rounded-full transition-all duration-300"
                style={{ width: i === slide ? 32 : 12, background: i === slide ? "var(--c-gold)" : "rgba(255,255,255,0.3)" }} />
            ))}
          </div>
        </div>

        {/* Brand mark */}
        <div className="absolute top-10 left-10 z-10">
          <Link to="/" className="text-2xl font-black text-white" style={{ fontFamily: "var(--ff-display)" }}>
            Crowd<em className="not-italic" style={{ color: "var(--c-brand-lit)" }}>Fund</em>
          </Link>
        </div>
      </div>

      {/* ── Right panel: Form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [.22,1,.36,1] }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-10">
            <Link to="/" className="text-2xl font-black" style={{ fontFamily: "var(--ff-display)", color: "var(--c-brand)" }}>
              Crowd<em className="not-italic" style={{ color: "var(--c-brand-lit)" }}>Fund</em>
            </Link>
          </div>

          <h1 className="text-4xl font-black mb-2" style={{ fontFamily: "var(--ff-display)" }}>Welcome back.</h1>
          <p className="text-sm mb-10" style={{ color: "var(--c-muted)" }}>
            Don't have an account?{" "}
            <Link to="/register" className="font-bold" style={{ color: "var(--c-brand)" }}>Create one →</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { name: "email",    type: "email",    placeholder: "Your email address",  label: "Email" },
              { name: "password", type: "password", placeholder: "Your password",        label: "Password" },
            ].map((f) => (
              <div key={f.name}>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: "var(--c-muted)" }}>{f.label}</label>
                <input
                  name={f.name}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.name]}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 rounded-xl text-sm font-medium outline-none transition-all"
                  style={{
                    background: "var(--c-bg-alt)",
                    border: "1.5px solid var(--c-line)",
                    color: "var(--c-text)",
                    fontFamily: "var(--ff-body)",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "var(--c-brand)"}
                  onBlur={(e)  => e.target.style.borderColor = "var(--c-line)"}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-60"
              style={{ background: "var(--c-brand)", color: "white", fontFamily: "var(--ff-body)" }}
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <p className="text-xs text-center mt-10" style={{ color: "var(--c-muted)" }}>
            By signing in you agree to our{" "}
            <span className="underline cursor-pointer" style={{ color: "var(--c-brand)" }}>Terms & Privacy Policy</span>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
