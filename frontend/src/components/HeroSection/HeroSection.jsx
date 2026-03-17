import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

function HeroSection() {
  const navigate = useNavigate();

  const stats = [
    { number: "50K+", label: "Campaigns" },
    { number: "$10M", label: "Raised" },
    { number: "1M+", label: "Donors" },
  ];

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient + pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-pink-500/10 via-transparent to-transparent" />
      
      {/* Animated particles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 xl:px-24 text-center text-white h-full flex flex-col justify-center">
        <div className="w-full max-w-7xl mx-auto h-full flex flex-col justify-center">  
          
          {/* Main heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-8 leading-tight"
          >
            Crowdfunding
            <br />
            <span className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text drop-shadow-2xl">
              Reimagined
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-200/90 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Launch campaigns instantly. Reach millions. Change lives. 
            The most trusted platform for crowdfunding that matters.
          </motion.p>

          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <button
              onClick={() => navigate("/raise")}
              className="group relative bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-12 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-emerald-500/25 transform hover:-translate-y-2 transition-all duration-500 flex items-center gap-3"
            >
              <span>Start Campaign</span>
              <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
            
            <button
              onClick={() => navigate("/donate")}
              className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-12 py-5 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all duration-300"
            >
              Browse Campaigns
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16 text-sm md:text-base"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-300 uppercase tracking-wider font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default HeroSection;
