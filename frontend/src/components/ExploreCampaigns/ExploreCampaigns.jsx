import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { campaignService } from "../../services/campaignService";
import CampaignCard from "../campaign/CampaignCard.jsx";

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
          {campaigns.map((campaign) => (
            <motion.div
              key={campaign._id}
              whileHover={{ scale: 1.03 }}
              className="h-full"
            >
              <CampaignCard campaign={campaign} />
            </motion.div>
          ))}
        </div>
      )}

      <div className="text-center mt-8">
        <Link
          to="/donate"
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
        >
          View All Campaigns
        </Link>
      </div>
    </div>
  );
}

export default ExploreCampaigns;
