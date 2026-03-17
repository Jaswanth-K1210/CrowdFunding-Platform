import React, { useState } from "react";
import ProgressBar from "../common/ProgressBar";
import Button from "../common/Button";

function DonateBox({ goal, raised, onDonate }) {
  const [amount, setAmount] = useState("");

  const handleDonate = () => {
    if (!amount || amount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    onDonate(amount);
    setAmount("");
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">

      {/* Goal & Raised */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          ₹{raised.toLocaleString()} raised
        </h3>
        <p className="text-gray-500">
          Goal: ₹{goal.toLocaleString()}
        </p>
      </div>

      {/* Progress Bar */}
      <ProgressBar raised={raised} goal={goal} />

      {/* Donation Input */}
      <div className="mt-4">
        <input
          type="number"
          placeholder="Enter donation amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded-lg p-2 mb-3"
        />

        <Button onClick={handleDonate} className="w-full">
          Donate Now
        </Button>
      </div>

      {/* Share Link */}
      <div className="mt-4 text-center">
        <button
          className="text-blue-600 text-sm hover:underline"
          onClick={() => navigator.clipboard.writeText(window.location.href)}
        >
          Share Campaign
        </button>
      </div>

    </div>
  );
}

export default DonateBox;