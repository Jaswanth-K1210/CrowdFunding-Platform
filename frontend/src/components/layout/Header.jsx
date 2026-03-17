import { Link } from "react-router-dom";
import { useAuth } from "../../store/authStore";

function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link to="/" className="text-2xl font-bold text-blue-600">
          CrowdFund
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/donate" className="text-gray-700 hover:text-blue-600">Donate</Link>
          <Link to="/raise" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Raise Fund
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.role === "admin" && (
                <Link to="/admin" className="text-gray-700 hover:text-blue-600">Admin</Link>
              )}
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
              <Link to="/profile" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                {user.name}
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Register
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}

export default Header;
