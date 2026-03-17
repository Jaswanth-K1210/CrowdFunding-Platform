import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { adminService } from "../services/adminService";
import { useAuth } from "../store/authStore";
import { formatCurrency } from "../utils/formatCurrency";

function CampaignApproval() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      navigate("/login");
      return;
    }
    if (user?.role === "admin") fetchCampaigns();
  }, [user, authLoading, filter]);

  const fetchCampaigns = async () => {
    try {
      const res = filter === "pending"
        ? await adminService.getPendingCampaigns()
        : await adminService.getAllCampaigns();
      setCampaigns(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminService.approveCampaign(id, "");
      toast.success("Campaign approved");
      setCampaigns(campaigns.map((c) =>
        c._id === id ? { ...c, status: "approved" } : c
      ));
    } catch {
      toast.error("Failed to approve");
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Rejection reason:");
    if (reason === null) return;
    try {
      await adminService.rejectCampaign(id, reason);
      toast.success("Campaign rejected");
      setCampaigns(campaigns.map((c) =>
        c._id === id ? { ...c, status: "rejected" } : c
      ));
    } catch {
      toast.error("Failed to reject");
    }
  };

  if (authLoading || loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Campaign Approvals</h1>

      <div className="flex gap-3">
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded ${filter === "pending" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          All Campaigns
        </button>
      </div>

      {campaigns.length === 0 ? (
        <p className="text-gray-500">No campaigns found.</p>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div key={campaign._id} className="bg-white shadow-md rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold">{campaign.title}</h2>
                  <p className="text-gray-600 text-sm">
                    Creator: {campaign.creatorId?.name} ({campaign.creatorId?.email})
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Category: {campaign.category} | Goal: {formatCurrency(campaign.goalAmount)}
                  </p>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {campaign.description}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                  campaign.status === "approved" ? "bg-green-100 text-green-700" :
                  campaign.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                  campaign.status === "rejected" ? "bg-red-100 text-red-700" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {campaign.status}
                </span>
              </div>

              {campaign.status === "pending" && (
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => handleApprove(campaign._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(campaign._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CampaignApproval;
