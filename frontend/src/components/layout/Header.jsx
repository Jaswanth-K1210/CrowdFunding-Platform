import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../store/authStore";
import { FaBars, FaTimes } from "react-icons/fa";


function Header() {
  const { user } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
      <div
        className={`flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500 ${
          scrolled
            ? "bg-gray-900/80 backdrop-blur-xl shadow-2xl shadow-black/10"
            : "bg-white/80 backdrop-blur-xl shadow-lg"
        }`}
      >
        {/* Logo */}
        <Link
          to="/"
          className={`text-xl font-bold transition-colors ${
            scrolled ? "text-white" : "text-gray-900"
          }`}
        >
          CrowdFund
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" scrolled={scrolled} selectedPath={location.pathname}>
            Home
          </NavLink>
          <NavLink to="/donate" scrolled={scrolled} selectedPath={location.pathname}>
            Donate
          </NavLink>
          <NavLink to="/trust-us" scrolled={scrolled} selectedPath={location.pathname}>
            Why Trust Us
          </NavLink>

          <NavLink
            to="/raise"
            scrolled={scrolled}
            selectedPath={location.pathname}
          >
            Raise Fund
          </NavLink>
        </nav>


        {/* Right Side */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <NavLink
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                scrolled={scrolled}
                selectedPath={location.pathname}
              >
                Dashboard
              </NavLink>
              <Link
                to="/profile"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all"
              >
                {user.name}
              </Link>
            </>
          ) : (
            <>
              <NavLink to="/login" scrolled={scrolled} selectedPath={location.pathname}>
                Login
              </NavLink>
              <Link
                to="/register"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all"
              >
                Register
              </Link>
            </>
          )}
        </div>


        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden text-lg ${scrolled ? "text-white" : "text-gray-900"}`}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4 space-y-2">
          <MobileLink to="/" onClick={() => setMenuOpen(false)} selectedPath={location.pathname}>Home</MobileLink>
          <MobileLink to="/donate" onClick={() => setMenuOpen(false)} selectedPath={location.pathname}>Donate</MobileLink>
          <MobileLink to="/trust-us" onClick={() => setMenuOpen(false)} selectedPath={location.pathname}>Why Trust Us</MobileLink>
          <MobileLink to="/raise" onClick={() => setMenuOpen(false)} selectedPath={location.pathname}>Raise Fund</MobileLink>

          {user ? (
            <>
              {user.role === "admin" && (
                <MobileLink to="/admin" onClick={() => setMenuOpen(false)} selectedPath={location.pathname}>Admin</MobileLink>
              )}
              <MobileLink to="/dashboard" onClick={() => setMenuOpen(false)} selectedPath={location.pathname}>Dashboard</MobileLink>
              <MobileLink to="/profile" onClick={() => setMenuOpen(false)} selectedPath={location.pathname}>{user.name}</MobileLink>

            </>
          ) : (
            <>
              <MobileLink to="/login" onClick={() => setMenuOpen(false)} selectedPath={location.pathname}>Login</MobileLink>
              <MobileLink to="/register" onClick={() => setMenuOpen(false)} selectedPath={location.pathname}>Register</MobileLink>

            </>
          )}
        </div>
      )}
    </header>
  );
}

function NavLink({ to, scrolled, selectedPath, children }) {
  const isSelected = selectedPath === to;

  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        isSelected
          ? "bg-emerald-500 hover:bg-emerald-600 text-white"

          : scrolled

            ? "text-gray-300 hover:text-white hover:bg-white/10"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      }`}

    >
      {children}
    </Link>
  );
}


function MobileLink({ to, onClick, selectedPath, children }) {
  const isSelected = selectedPath === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block px-4 py-3 rounded-xl font-medium text-sm transition-all ${
          isSelected
          ? "bg-emerald-500 hover:bg-emerald-600 text-white"
          : "text-gray-700 hover:bg-gray-100"



      }`}
    >
      {children}
    </Link>
  );
}


export default Header;
