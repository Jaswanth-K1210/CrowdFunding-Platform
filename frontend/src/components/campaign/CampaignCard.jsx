import React from 'react';
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";

function CampaignCard({ campaign }) {
  const progress = Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100);
  const creator = campaign.creatorId?.name || 'Unknown';

  return (
    <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden h-full">
      <div className="relative">
        <img 
          src={campaign.images?.[0] || "https://placehold.co/400x250"} 
          alt={campaign.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Title overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg line-clamp-2">
            {campaign.title}
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category badge & creator */}
        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-semibold rounded-full shadow-lg">
            {campaign.category}
          </span>
          <div className="flex items-center gap-2">
  <img
    src="https://media.istockphoto.com/id/1130884625/vector/user-member-vector-icon-for-ui-user-interface-or-profile-face-avatar-app-in-circle-design.jpg?s=612x612&w=0&k=20&c=1ky-gNHiS2iyLsUPQkxAtPBWH1BZt0PKBB1WBtxQJRE="
    alt="creator"
    className="w-8 h-8 rounded-full object-cover"
  />
  <span className="text-sm font-medium text-gray-700">{creator}</span>
</div>
        </div>

        {/* Short description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {campaign.description}
        </p>

        {/* Progress & stats */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Progress</span>
            <span className="font-bold text-gray-900">{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full shadow-md transition-all duration-700" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-emerald-600 font-semibold">
              {formatCurrency(campaign.raisedAmount)}
            </span>
            <span className="text-gray-500">of {formatCurrency(campaign.goalAmount)}</span>
          </div>
        </div>

        {/* Donate CTA */}
        <Link
          to={`/campaign/${campaign._id}`}
          className="block w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-sm uppercase tracking-wide text-center"
        >
          Donate Now
        </Link>
      </div>
    </div>
  );
}

export default CampaignCard;