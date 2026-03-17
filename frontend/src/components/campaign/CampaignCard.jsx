import React from 'react';

function CampaignCard({ title, description, creator, goal, raised, image }) {
  // Calculate progress percentage
  const progress = Math.min((raised / goal) * 100, 100);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Campaign Image */}
      <img src={image} alt={title} className="w-full h-48 object-cover" />

      {/* Campaign Details */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
        <p className="text-sm text-gray-500 mt-2">By: {creator}</p>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-600 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Raised: ${raised} / ${goal}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CampaignCard;