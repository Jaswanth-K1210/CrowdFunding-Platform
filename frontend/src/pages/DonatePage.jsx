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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Donate to Campaigns</h1>

      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          type="text"
          placeholder="Search campaigns..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 rounded">
          Search
        </button>
      </form>

      <div className="flex gap-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
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
          className="border p-2 rounded"
        >
          <option value="">Sort By</option>
          <option value="most-funded">Most Funded</option>
          <option value="newest">Newest</option>
          <option value="ending-soon">Ending Soon</option>
        </select>
      </div>

      {loading ? (
        <p>Loading campaigns...</p>
      ) : campaigns.length === 0 ? (
        <p className="text-gray-500">No campaigns found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
}

export default DonatePage;
