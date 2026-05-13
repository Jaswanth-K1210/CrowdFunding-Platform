import React from "react";

function ProgressBar({ raised = 0, goal = 100 }) {

  const percentage = Math.min((raised / goal) * 100, 100);

  return (
    <div className="w-full">

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">

        <div
          className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />

      </div>

      {/* Progress Text */}
      <div className="flex justify-between text-sm mt-1 text-gray-600">

        <span>₹{raised.toLocaleString()} raised</span>

        <span>{percentage.toFixed(0)}%</span>

      </div>

    </div>
  );
}

export default ProgressBar;