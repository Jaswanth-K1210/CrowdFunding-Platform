import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-12">

      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">

        {/* Logo & Description */}
        <div>
          <h2 className="text-xl font-bold mb-2">
            CrowdFund
          </h2>

          <p className="text-gray-400 text-sm">
            A platform to help people raise funds for medical,
            education, and emergency needs.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-3">
            Quick Links
          </h3>

          <ul className="space-y-2 text-gray-400">

            <li>
              <Link to="/" className="hover:text-white">
                Home
              </Link>
            </li>

            <li>
              <Link to="/donate" className="hover:text-white">
                Donate
              </Link>
            </li>

            <li>
              <Link to="/raise" className="hover:text-white">
                Raise Fund
              </Link>
            </li>

          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-3">
            Contact
          </h3>

          <p className="text-gray-400 text-sm">
            Email: support@crowdfund.com
          </p>

          <p className="text-gray-400 text-sm">
            Phone: +91 98765 43210
          </p>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 text-center py-4 text-gray-400 text-sm">
        © {new Date().getFullYear()} CrowdFund. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;