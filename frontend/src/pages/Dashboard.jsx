import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { campaignService } from "../services/campaignService";
import { donationService } from "../services/donationService";
import { useAuth } from "../store/authStore";
import { formatCurrency } from "../utils/formatCurrency";

function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [myDonations, setMyDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }
    if (user) fetchData();
  }, [user, authLoading]);

  const fetchData = async () => {
    try {
      const [campaignsRes, donationsRes] = await Promise.all([
        campaignService.getMine(),
        donationService.getMine(),
      ]);
      setMyCampaigns(campaignsRes.data);
      setMyDonations(donationsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500 text-sm">Campaigns Created</p>
          <p className="text-2xl font-bold text-blue-600">{myCampaigns.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500 text-sm">Total Donated</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(myDonations.reduce((sum, d) => sum + d.amount, 0))}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500 text-sm">Total Raised</p>
          <p className="text-2xl font-bold text-purple-600">
            {formatCurrency(myCampaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0))}
          </p>
        </div>
      </div>

      {/* My Campaigns */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">My Campaigns</h2>
          <Link to="/raise" className="text-blue-600 hover:underline text-sm">
            + Create New
          </Link>
        </div>

        {myCampaigns.length === 0 ? (
          <p className="text-gray-500">No campaigns created yet.</p>
        ) : (
          <div className="space-y-3">
            {myCampaigns.map((campaign) => (
              <Link
                key={campaign._id}
                to={`/campaign/${campaign._id}`}
                className="block border p-4 rounded-lg hover:shadow transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{campaign.title}</h3>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(campaign.raisedAmount)} / {formatCurrency(campaign.goalAmount)}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    campaign.status === "approved" ? "bg-green-100 text-green-700" :
                    campaign.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    campaign.status === "rejected" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {campaign.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* My Donations */}
      <section>
        <h2 className="text-xl font-semibold mb-3">My Donations</h2>

        {myDonations.length === 0 ? (
          <p className="text-gray-500">No donations yet.</p>
        ) : (
          <div className="space-y-2">
            {myDonations.map((donation) => (
              <div key={donation._id} className="border p-3 rounded flex justify-between">
                <span>{donation.campaignId?.title || "Campaign"}</span>
                <span className="font-semibold">{formatCurrency(donation.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
