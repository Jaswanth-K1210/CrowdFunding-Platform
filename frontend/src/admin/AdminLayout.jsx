import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import AdminSidebar from "../components/admin/Sidebar";

function AdminLayout() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      navigate("/login");
    }
  }, [user, authLoading]);

  if (authLoading) return <p className="text-center py-10">Loading...</p>;
  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-0">
      <div className="flex gap-8">
        <AdminSidebar />
        <div className="flex-1 bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
