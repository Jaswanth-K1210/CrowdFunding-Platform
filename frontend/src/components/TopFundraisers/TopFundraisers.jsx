import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { campaignService } from "../../services/campaignService";
import { formatCurrency } from "../../utils/formatCurrency";

function TopFundraisers() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    campaignService
      .getTop()
      .then((res) => setCampaigns(res.data))
      .catch(console.error);
  }, []);

  if (campaigns.length === 0) return null;

  return (
    <div className="py-16 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-10">Top Fundraisers</h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6">
        {campaigns.map((campaign) => (
          <motion.div
            key={campaign._id}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Link
              to={`/campaign/${campaign._id}`}
              className="block bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <img
                src={campaign.images?.[0] || "https://placehold.co/400x200?text=Campaign"}
                alt={campaign.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold">{campaign.title}</h3>
                <p className="text-sm text-gray-500">By {campaign.creatorId?.name}</p>
                <p className="text-green-600 font-bold mt-2">
                  {formatCurrency(campaign.raisedAmount)} Raised
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default TopFundraisers;
