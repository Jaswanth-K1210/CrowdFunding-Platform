import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { adminService } from "../services/adminService";
import { formatCurrency } from "../utils/formatCurrency";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentCampaigns, setRecentCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [statsRes, campaignsRes] = await Promise.all([
        adminService.getDashboard(),
        adminService.getAllCampaigns()
      ]);
      setStats(statsRes.data);
      setRecentCampaigns(campaignsRes.data.slice(0, 10));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await adminService.getTransactions();
      const csv = 'Donation ID,Donor,Campaign,Amount,Date\n' + res.data.map(t => `"${t._id}","${t.donorId?.name}","${t.campaignId?.title}",${t.amount},${new Date(t.createdAt).toLocaleDateString()}`).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Report exported successfully!');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <>
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-black mb-2">
                Dashboard
              </h1>
              <p className="text-gray-500 text-lg">Welcome back, Admin. Here's what's happening.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleExport}
                className="px-6 py-2 bg-gradient-to-r from-teal-800 to-teal-900 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:from-teal-900 hover:to-gray-900"
              >
                Export Report
              </button>
            </div>
          </div>

          {/* Stats Cards - Interface matching design */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="group bg-gradient-to-br from-teal-700 to-teal-800 text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium opacity-90">Total Users</span>
              </div>
              <div className="text-4xl font-black">{stats?.totalUsers || 0}</div>
              <div className="text-teal-100">↑ 12% from last month</div>
            </div>

            <div className="group bg-gradient-to-br from-teal-700 to-teal-800 text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium opacity-90">Campaigns</span>
              </div>
              <div className="text-4xl font-black">{stats?.totalCampaigns || 0}</div>
              <div className="text-teal-100">23 new today</div>
            </div>

            <div className="group bg-gradient-to-br from-teal-700 to-teal-800 text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium opacity-90">Donations</span>
              </div>
              <div className="text-4xl font-black">{stats?.totalDonations || 0}</div>
              <div className="text-teal-100">Active payments</div>
            </div>

            <div className="group bg-gradient-to-br from-teal-700 to-teal-800 text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 00-2 2v4a2 2 0 002 2h8a2 2 0 002-2v-4a2 2 0 00-2-2H6zm6 2a2 2 0 110 4 2 2 0 010-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium opacity-90">Revenue</span>
              </div>
              <div className="text-4xl font-black">{formatCurrency(stats?.totalMoneyRaised || 0)}</div>
              <div className="text-teal-100">Platform total</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-3xl shadow-lg border">
              <h3 className="text-2xl font-bold mb-6">Recent Campaigns</h3>
              <div className="space-y-4">
                {recentCampaigns.slice(0, 3).map((campaign) => (
                  <div key={campaign._id} className="flex items-center gap-4 p-4 bg-white rounded-2xl hover:shadow-md transition-shadow">
                    <img 
                      src={campaign.images?.[0] || "https://placehold.co/48x48"} 
                      alt={campaign.title}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold line-clamp-1">{campaign.title}</h4>
                      <p className="text-sm text-gray-500 line-clamp-1">{campaign.creatorId?.name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      campaign.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      campaign.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                ))}
                {recentCampaigns.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No recent campaigns</p>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-3xl shadow-lg border">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/admin/campaigns" className="block w-full bg-white p-4 rounded-xl border hover:shadow-md transition-all text-gray-800 font-semibold text-center">
                  Manage Campaigns
                </Link>
                <Link to="/admin/transactions" className="block w-full bg-white p-4 rounded-xl border hover:shadow-md transition-all text-gray-800 font-semibold text-center">
                  View Transactions
                </Link>
              </div>
            </div>
          </div>

    </>
  );
}

export default AdminDashboard;