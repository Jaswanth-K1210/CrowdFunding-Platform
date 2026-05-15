import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage       from "../pages/HomePage.jsx";
import DonatePage     from "../pages/DonatePage.jsx";
import CampaignDetail from "../pages/CampaignDetail.jsx";
import Login          from "../pages/Login.jsx";
import Register       from "../pages/Register.jsx";
import RaiseFund      from "../pages/RaiseFund.jsx";
import Dashboard      from "../pages/Dashboard.jsx";
import WhyTrustUs     from "../pages/WhyTrustUs.jsx";

const NAV = [
  { to: "/",           label: "Home" },
  { to: "/donate",     label: "Donate" },
  { to: "/why-trust",  label: "Why Trust Us" },
  { to: "/raise-fund", label: "Raise Fund" },
  { to: "/dashboard",  label: "Dashboard" },
  { to: "/login",      label: "Login" },
  { to: "/register",   label: "Register" },
];

function PreviewNav() {
  return (
    <div style={{ position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)", zIndex: 9999,
      background: "rgba(13,31,24,0.95)", backdropFilter: "blur(12px)", borderRadius: 999,
      padding: "10px 20px", display: "flex", gap: 4, boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      border: "1px solid rgba(255,255,255,0.08)" }}>
      {NAV.map((n) => (
        <NavLink key={n.to} to={n.to} end={n.to === "/"}
          style={({ isActive }) => ({
            padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700,
            textDecoration: "none", transition: "all 0.2s",
            background: isActive ? "#0A4B38" : "transparent",
            color: isActive ? "#12C78A" : "rgba(255,255,255,0.55)",
          })}>
          {n.label}
        </NavLink>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <PreviewNav />
      <Routes>
        <Route path="/"                element={<HomePage />} />
        <Route path="/donate"          element={<DonatePage />} />
        <Route path="/campaign/:id"    element={<CampaignDetail />} />
        <Route path="/why-trust"       element={<WhyTrustUs />} />
        <Route path="/raise-fund"      element={<RaiseFund />} />
        <Route path="/dashboard"       element={<Dashboard />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
