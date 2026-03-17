import React, { useState } from "react";
import Button from "../common/Button";

function DonationForm({ campaignId, onDonate }) {

  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      alert("Please enter a valid donation amount");
      return;
    }

    const donationData = {
      campaignId,
      amount,
      message,
    };

    if (onDonate) {
      onDonate(donationData);
    }

    setAmount("");
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 space-y-4"
    >

      <h2 className="text-lg font-semibold">
        Support this Campaign
      </h2>

      {/* Amount Input */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Donation Amount
        </label>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Message (Optional)
        </label>

        <textarea
          placeholder="Leave a supportive message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* Donate Button */}
      <Button type="submit" className="w-full">
        Donate Now
      </Button>

    </form>
  );
}

export default DonationForm;