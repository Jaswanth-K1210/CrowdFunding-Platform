import React, { useState } from 'react';

function CampaignFilter({ onFilterChange }) {
  const [filters, setFilters] = useState({
    category: '',
    status: '',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters); // Notify parent component of filter changes
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 className="text-lg font-bold mb-4">Filter Campaigns</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="">All Categories</option>
            <option value="medical">Medical</option>
            <option value="education">Education</option>
            <option value="animals">Animals</option>
            <option value="business">Business</option>
            <option value="ngo">NGO</option>
            <option value="community">Community</option>
            <option value="emergency">Emergency</option>
            <option value="technology">Technology</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default CampaignFilter;