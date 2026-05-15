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

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-screen-xl mx-auto px-6 py-6 flex gap-6 items-start">
        {/* Sticky sidebar */}
        <div className="sticky top-24 shrink-0 self-start">
          <AdminSidebar />
        </div>

        {/* Scrollable content */}
        <main className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
