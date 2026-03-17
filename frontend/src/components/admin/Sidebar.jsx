import { useAuth } from "../../store/authStore";
import { Link, useLocation } from "react-router-dom";
import { FaChartLine, FaClipboardList, FaDollarSign, FaUsers, FaSignOutAlt } from "react-icons/fa";

function AdminSidebar() {
  const { logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: "/admin", icon: FaChartLine, label: "Dashboard" },
    { path: "/admin/campaigns", icon: FaClipboardList, label: "Campaigns" },
    { path: "/admin/transactions", icon: FaDollarSign, label: "Transactions" },
    { path: "/admin/users", icon: FaUsers, label: "Users" },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Admin Panel
        </h2>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                active 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 transform -translate-x-1" 
                  : "hover:bg-gray-700 hover:transform hover:translate-x-1"
              }`}
            >
              <Icon className="text-xl" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 p-3 text-left rounded-xl hover:bg-red-600/30 hover:text-red-300 transition-all duration-300"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;

