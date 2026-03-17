import React from "react";
import { Link } from "react-router-dom";

function Navbar() {

  const token = localStorage.getItem("token");

  return (
    <nav className="bg-white shadow-md">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          CrowdFund
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">

          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/donate"
            className="text-gray-700 hover:text-blue-600"
          >
            Donate
          </Link>

          <Link
            to="/raise"
            className="text-gray-700 hover:text-blue-600"
          >
            Raise Fund
          </Link>

        </div>

        {/* Auth Section */}
        <div>

          {token ? (
            <Link
              to="/profile"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Profile
            </Link>
          ) : (
            <div className="flex gap-3">

              <Link
                to="/login"
                className="text-gray-700"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Register
              </Link>

            </div>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;