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

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
        {campaigns.map((campaign) => (
          <motion.div
            key={campaign._id}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Link
              to={`/campaign/${campaign._id}`}
              className="group block bg-white rounded-2xl shadow-lg overflow-hidden h-full"
            >
              {/* Equal-height card layout */}
              <div className="flex flex-col h-full">
                {/* Responsive, non-cropping image area */}
                <div className="relative w-full">
                  <div className="aspect-[4/3] bg-gray-50 overflow-hidden">
                    <img
                      src={
                        campaign.images?.[0] ||
                        "https://placehold.co/600x450?text=Campaign"
                      }
                      alt={campaign.title}
                      className="w-full h-full object-contain bg-gray-50 transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    {Array.isArray(campaign.images) && campaign.images.length > 1 && (
                      <div className="absolute top-3 left-3 flex gap-1">
                        {campaign.images.slice(0, 3).map((url, i) => (
                          <img
                            key={url + i}
                            src={url}
                            alt=""
                            className={
                              "w-8 h-8 rounded-lg object-cover border border-white shadow-sm " +
                              (i === 0 ? "opacity-100" : "opacity-70")
                            }
                          />
                        ))}
                      </div>
                    )}

                  </div>

                  {/* subtle premium accent */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-emerald-500/10 to-transparent" />
                </div>

                {/* Details: fill remaining height for consistent card height */}
                <div className="flex flex-col flex-1 p-5 text-center">
                  <div className="flex-1">
                    <h3 className="text-[16px] font-semibold text-gray-900 leading-snug line-clamp-2">
                      {campaign.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                      By {campaign.creatorId?.name}
                    </p>
                  </div>

                  <div className="mt-4">
                    <div className="text-sm text-gray-500">Raised</div>
                    <p className="text-emerald-600 font-extrabold text-lg leading-none">
                      {formatCurrency(campaign.raisedAmount)}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default TopFundraisers;
