import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../services/adminService";
import { useAuth } from "../store/authStore";
import { formatCurrency } from "../utils/formatCurrency";

function Transactions() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      navigate("/login");
      return;
    }
    if (user?.role === "admin") fetchTransactions();
  }, [user, authLoading]);

  const fetchTransactions = async () => {
    try {
      const res = await adminService.getTransactions();
      setTransactions(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="space-y-6 pt-24 px-8">
      <h1 className="text-3xl font-bold">Transactions</h1>

      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions yet.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold">Payment ID</th>
                <th className="text-left px-4 py-3 text-sm font-semibold">Donor</th>
                <th className="text-left px-4 py-3 text-sm font-semibold">Campaign</th>
                <th className="text-left px-4 py-3 text-sm font-semibold">Amount</th>
                <th className="text-left px-4 py-3 text-sm font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id} className="border-t">
                  <td className="px-4 py-3 text-sm text-gray-600">{t.paymentId || "-"}</td>
                  <td className="px-4 py-3 text-sm">
                    {t.donorId?.name || "Unknown"}
                    <br />
                    <span className="text-gray-400 text-xs">{t.donorId?.email}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">{t.campaignId?.title || "Unknown"}</td>
                  <td className="px-4 py-3 text-sm font-semibold">{formatCurrency(t.amount)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Transactions;
