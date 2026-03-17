import React from 'react';
import CampaignCard from './CampaignCard';

function CampaignGrid({ campaigns }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <CampaignCard
          key={campaign._id}
          campaign={campaign}
        />
      ))}
    </div>
  );
}

export default CampaignGrid;