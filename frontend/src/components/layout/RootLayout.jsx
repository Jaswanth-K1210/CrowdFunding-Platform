import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";

function RootLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const FULL_WIDTH_PATHS = ["/", "/donate", "/trust-us", "/raise"];
  const isFullWidth = isAdmin || FULL_WIDTH_PATHS.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className={isFullWidth ? "grow" : "grow max-w-7xl w-full mx-auto px-6 py-6 pt-24"}>
        <Outlet />
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

export default RootLayout;
