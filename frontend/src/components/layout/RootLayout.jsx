import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="grow max-w-7xl w-full mx-auto px-6 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default RootLayout;
