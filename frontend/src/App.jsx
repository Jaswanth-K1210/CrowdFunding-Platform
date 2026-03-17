import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./store/authStore";
import RootLayout from "./components/layout/RootLayout";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import RaiseFund from "./pages/RaiseFund";
import Register from "./pages/Register";
import DonatePage from "./pages/DonatePage";
import CampaignDetail from "./pages/CampaignDetail";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./admin/AdminDashboard";
import CampaignApproval from "./admin/CampaignApproval";
import Transactions from "./admin/Transactions";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "donate", element: <DonatePage /> },
      { path: "campaign/:id", element: <CampaignDetail /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "profile", element: <Profile /> },
      { path: "raise", element: <RaiseFund /> },
      { path: "admin", element: <AdminDashboard /> },
      { path: "admin/campaigns", element: <CampaignApproval /> },
      { path: "admin/transactions", element: <Transactions /> },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
