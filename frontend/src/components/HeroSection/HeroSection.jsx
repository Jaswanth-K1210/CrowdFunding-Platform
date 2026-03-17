import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1600&q=80')",
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 via-emerald-900/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full px-6 lg:px-16 xl:px-24 py-20">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl space-y-6"
        >
          <p className="text-emerald-300 font-semibold text-sm uppercase tracking-widest">
            Welcome to CrowdFund
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Help The Poor To Build
            <br />
            <span className="text-emerald-300">A Better World</span>
          </h1>

          <p className="text-gray-200 text-lg max-w-lg leading-relaxed">
            Launch campaigns instantly. Reach millions. Change lives.
            The most trusted platform for crowdfunding that matters.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => navigate("/donate")}
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold text-base transition-all duration-300"
            >
              Donate Now
            </button>
            <button
              onClick={() => navigate("/raise")}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold text-base transition-all duration-300"
            >
              Start a Campaign
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default HeroSection;
