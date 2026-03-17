import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { campaignService } from "../services/campaignService";
import { useAuth } from "../store/authStore";

function RaiseFund() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [campaign, setCampaign] = useState({
    title: "",
    description: "",
    category: "medical",
    goalAmount: "",
    deadline: "",
    location: "",
    images: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    "education", "medical", "animals", "business",
    "ngo", "community", "emergency", "technology",
  ];

  const handleChange = (e) => {
    setCampaign({ ...campaign, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    setSubmitting(true);
    try {
      await campaignService.create({
        ...campaign,
        goalAmount: Number(campaign.goalAmount),
        images: campaign.images ? [campaign.images] : [],
      });
      toast.success("Campaign created! Pending admin approval.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create campaign");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Create Campaign</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Campaign Title"
            value={campaign.title}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <textarea
            name="description"
            placeholder="Campaign Description / Story"
            value={campaign.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full border p-2 rounded"
          />

          <select
            name="category"
            value={campaign.category}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="goalAmount"
            placeholder="Goal Amount (INR)"
            value={campaign.goalAmount}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={campaign.location}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            name="images"
            placeholder="Image URL"
            value={campaign.images}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            type="date"
            name="deadline"
            value={campaign.deadline}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {submitting ? "Creating..." : "Create Campaign"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RaiseFund;
