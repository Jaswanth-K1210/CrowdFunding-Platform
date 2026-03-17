import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { campaignService } from "../../services/campaignService";
import { formatCurrency } from "../../utils/formatCurrency";

function ExploreCampaigns() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    campaignService
      .getAll({ status: "approved", limit: 6 })
      .then((res) => setCampaigns(res.data.campaigns || []))
      .catch(console.error);
  }, []);

  return (
    <div className="py-12 px-6">
      <h1 className="text-3xl font-bold text-center mb-10">Explore Campaigns</h1>

      {campaigns.length === 0 ? (
        <p className="text-center text-gray-500">No campaigns yet. Be the first to create one!</p>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => {
            const progress = (campaign.raisedAmount / campaign.goalAmount) * 100;

            return (
              <motion.div
                key={campaign._id}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <Link to={`/campaign/${campaign._id}`}>
                  <img
                    src={campaign.images?.[0] || "https://placehold.co/400x200?text=Campaign"}
                    alt={campaign.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5">
                    <h2 className="text-xl font-semibold mb-2">{campaign.title}</h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {campaign.description}
                    </p>

                    <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                      <div
                        className="bg-green-500 h-3 rounded-full"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-sm text-gray-700">
                      <span>Raised: {formatCurrency(campaign.raisedAmount)}</span>
                      <span>Goal: {formatCurrency(campaign.goalAmount)}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="text-center mt-8">
        <Link
          to="/donate"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          View All Campaigns
        </Link>
      </div>
    </div>
  );
}

export default ExploreCampaigns;
