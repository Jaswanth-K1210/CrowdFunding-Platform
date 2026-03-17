import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../store/authStore";

function Profile() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">User Profile</h2>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-lg font-semibold">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-semibold">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-lg font-semibold capitalize">{user.role}</p>
          </div>
          {user.phone && (
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-lg font-semibold">{user.phone}</p>
            </div>
          )}
          {user.location?.city && (
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="text-lg font-semibold">
                {[user.location.city, user.location.state, user.location.country].filter(Boolean).join(", ")}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
