import React from "react";
import { useNavigate } from "react-router-dom";

function RaiseFundCTA() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/raise");
  };

  return (
    <div className="bg-blue-600 text-white text-center py-12 rounded-lg">

      <h2 className="text-3xl font-bold mb-4">
        Start Raising Funds Today
      </h2>

      <p className="mb-6">
        Create a campaign and get support from people around the world.
      </p>

      <button
        onClick={handleClick}
        className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200"
      >
        Start Raising Funds
      </button>

    </div>
  );
}

export default RaiseFundCTA;