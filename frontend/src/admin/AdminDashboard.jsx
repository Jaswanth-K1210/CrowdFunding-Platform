import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminService } from "../services/adminService";
import { useAuth } from "../store/authStore";
import { formatCurrency } from "../utils/formatCurrency";

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      navigate("/login");
      return;
    }
    if (user?.role === "admin") fetchStats();
  }, [user, authLoading]);

  const fetchStats = async () => {
    try {
      const res = await adminService.getDashboard();
      setStats(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500 text-sm">Total Users</p>
          <p className="text-2xl font-bold text-blue-600">{stats?.totalUsers || 0}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500 text-sm">Total Campaigns</p>
          <p className="text-2xl font-bold text-green-600">{stats?.totalCampaigns || 0}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500 text-sm">Total Donations</p>
          <p className="text-2xl font-bold text-purple-600">{stats?.totalDonations || 0}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500 text-sm">Money Raised</p>
          <p className="text-2xl font-bold text-orange-600">
            {formatCurrency(stats?.totalMoneyRaised || 0)}
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          to="/admin/campaigns"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Campaign Approvals
        </Link>
        <Link
          to="/admin/transactions"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Transactions
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
