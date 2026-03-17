import React from "react";
import { useNavigate } from "react-router-dom";

function HeroSection() {

  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 py-20 px-6 rounded-lg">

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        {/* Left Content */}
        <div>

          <h1 className="text-4xl font-bold mb-4">
            Raise Funds for What Matters
          </h1>

          <p className="text-gray-600 mb-6">
            Start a fundraiser for medical emergencies, education,
            community projects, and more. Get support from people
            around the world.
          </p>

          <div className="flex gap-4">

            <button
              onClick={() => navigate("/raise")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Start Raising Funds
            </button>

            <button
              onClick={() => navigate("/donate")}
              className="bg-white border px-6 py-3 rounded-lg"
            >
              Explore Campaigns
            </button>

          </div>

        </div>

        {/* Right Image */}
        <div>
          <img
            src="https://images.unsplash.com/photo-1593113630400-ea4288922497"
            alt="Crowdfunding"
            className="rounded-lg"
          />
        </div>

      </div>

    </div>
  );
}

export default HeroSection; 