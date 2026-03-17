import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { campaignService } from "../services/campaignService";
import { formatCurrency } from "../utils/formatCurrency";

function DonatePage() {
  const [campaigns, setCampaigns] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, [category, sort]);

  const fetchCampaigns = async () => {
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
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCampaigns();
  };

  const categories = [
    "education", "medical", "animals", "business",
    "ngo", "community", "emergency", "technology",
  ];

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => {
            const progress = Math.min(
              (campaign.raisedAmount / campaign.goalAmount) * 100,
              100
            );

            return (
              <Link
                key={campaign._id}
                to={`/campaign/${campaign._id}`}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={campaign.images?.[0] || "https://placehold.co/400x200?text=Campaign"}
                  alt={campaign.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-800">{campaign.title}</h2>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {campaign.description}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    By: {campaign.creatorId?.name || "Unknown"}
                  </p>

                  <div className="mt-3">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-green-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatCurrency(campaign.raisedAmount)} / {formatCurrency(campaign.goalAmount)}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DonatePage;
