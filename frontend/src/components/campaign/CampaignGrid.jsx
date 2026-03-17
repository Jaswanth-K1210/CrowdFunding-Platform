import React from 'react';
import CampaignCard from './CampaignCard';

function CampaignGrid({ campaigns }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          title={campaign.title}
          description={campaign.description}
          creator={campaign.creator}
          goal={campaign.goal}
          raised={campaign.raised}
          image={campaign.image}
        />
      ))}
    </div>
  );
}

export default CampaignGrid;