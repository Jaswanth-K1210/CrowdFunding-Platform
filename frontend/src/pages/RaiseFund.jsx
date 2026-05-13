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
    <div className="flex justify-center bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Start Your Campaign</h2>
          <p className="text-gray-600">Share your story and raise funds for what matters</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Help rebuild after flood"
              value={campaign.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={campaign.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Goal Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Funding Goal (INR)</label>
            <input
              type="number"
              name="goalAmount"
              placeholder="50000"
              value={campaign.goalAmount}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Image URL</label>
            <input
              type="text"
              name="images"
              placeholder="https://example.com/image.jpg"
              value={campaign.images}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              name="location"
              placeholder="e.g. Mumbai, India"
              value={campaign.location}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Deadline</label>
            <input
              type="date"
              name="deadline"
              value={campaign.deadline}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tell your story</label>
            <textarea
              name="description"
              placeholder="Share your campaign story, why you need funding, and how donations will help..."
              value={campaign.description}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-vertical"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none transition-all duration-300 text-lg"
          >
            {submitting ? "Creating Campaign..." : "Launch Campaign"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RaiseFund;
