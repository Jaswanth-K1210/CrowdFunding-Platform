import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { campaignService } from "../services/campaignService";
import CampaignCard from "../components/campaign/CampaignCard.jsx";

function DonatePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [campaigns, setCampaigns] = useState([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Update URL when filters change
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    if (search) params.set("search", search);
    setSearchParams(params);
  }, [category, sort, search, setSearchParams]);

  useEffect(() => {
    fetchCampaigns();
  }, [category, sort, search]);

  const fetchCampaigns = useCallback(async () => {
    try {
      const params = { status: "approved", limit: 50 };
      if (category) params.category = category;
      if (sort) params.sort = sort;
      if (search) params.search = search;

      const res = await campaignService.getAll(params);
      setCampaigns(res.data.campaigns || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [category, sort, search, campaignService]);

  const categories = [
    "education", "medical", "animals", "business",
    "ngo", "community", "emergency", "technology",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCampaigns();
  };

  return (
  <div className="flex justify-center bg-gray-50 min-h-screen py-10">
    <div className="w-full max-w-6xl bg-white p-6 rounded-2xl shadow-md space-y-6">

      <h1 className="text-3xl font-bold text-center text-gray-800">
        Donate to Campaigns
      </h1>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="flex gap-3 justify-center"
      >
        <input
          type="text"
          placeholder="Search campaigns..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 p-3 flex-1 max-w-md rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 rounded-xl shadow"
        >
          Search
        </button>
      </form>

      {/* Filters */}
      <div className="flex gap-3 justify-center flex-wrap">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sort By</option>
          <option value="most-funded">Most Funded</option>
          <option value="newest">Newest</option>
          <option value="ending-soon">Ending Soon</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-center text-gray-500">
          Loading campaigns...
        </p>
      ) : campaigns.length === 0 ? (
        <p className="text-gray-400 text-center">
          No campaigns found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div className="transform hover:scale-105 transition duration-300">
              <CampaignCard key={campaign._id} campaign={campaign} />
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
}

export default DonatePage;
