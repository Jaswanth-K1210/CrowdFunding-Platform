import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../services/adminService";
import { useAuth } from "../store/authStore";
import AdminSidebar from "../components/admin/Sidebar";

function Users() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      navigate("/login");
      return;
    }
    if (user?.role === "admin") fetchUsers();
  }, [user, authLoading]);

  const fetchUsers = async () => {
    try {
      const res = await adminService.getAllUsers(search);
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  if (authLoading || loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 pt-24">
      <div className="flex gap-8">
        <div className="hidden lg:block">
        <AdminSidebar />        
        </div>
        
        <div className="flex-1 bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-black  mb-2">
                Users Management
              </h1>
              <p className="text-gray-500 text-lg">Manage all platform users and their roles.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                Export Users
              </button>
            </div>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-3 max-w-md">
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Search
              </button>
            </div>
          </form>

          {/* Users Table */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="text-left px-8 py-5 text-sm font-bold text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="text-left px-8 py-5 text-sm font-bold text-gray-700 uppercase tracking-wider">Email</th>
                    <th className="text-left px-8 py-5 text-sm font-bold text-gray-700 uppercase tracking-wider">Role</th>
                    <th className="text-left px-8 py-5 text-sm font-bold text-gray-700 uppercase tracking-wider">Campaigns Created</th>
                    <th className="text-left px-8 py-5 text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="text-left px-8 py-5 text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                            <span className="font-bold text-xs text-white">
                              {user.name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-gray-600">{user.email}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm font-semibold text-gray-900">{user.stats?.campaignsCreated || 0}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex gap-2">
                          <button className="px-4 py-1.5 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition">
                            Edit
                          </button>
                          <button className="px-4 py-1.5 bg-gray-500 text-white text-xs rounded-lg hover:bg-gray-600 transition">
                            Suspend
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {users.length === 0 && (
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No users found</h3>
              <p className="text-gray-500">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Users;

