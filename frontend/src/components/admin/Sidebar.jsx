import { useAuth } from "../../store/authStore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaChartLine, FaClipboardList, FaDollarSign, FaUsers, FaSignOutAlt } from "react-icons/fa";
import toast from "react-hot-toast";

function AdminSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/admin",              icon: FaChartLine,    label: "Dashboard"    },
    { path: "/admin/campaigns",    icon: FaClipboardList,label: "Campaigns"    },
    { path: "/admin/transactions", icon: FaDollarSign,   label: "Transactions" },
    { path: "/admin/users",        icon: FaUsers,        label: "Users"        },
  ];

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="w-56 bg-gray-900 text-white rounded-2xl shadow-md flex flex-col">
      {/* Brand */}
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-black bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          Admin Panel
        </h2>
        {user && (
          <p className="text-gray-400 text-xs mt-1 truncate">{user.email}</p>
        )}
      </div>

      {/* Nav */}
      <nav className="p-3 space-y-1 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                active
                  ? "bg-linear-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-700/60 hover:text-white"
              }`}
            >
              <Icon className="text-base shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/20 hover:text-red-300 transition-all text-sm font-medium"
        >
          <FaSignOutAlt className="shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;
