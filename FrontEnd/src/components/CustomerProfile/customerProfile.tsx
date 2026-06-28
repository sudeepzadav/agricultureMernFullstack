import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsed = JSON.parse(storedUser);

    // basic role protection
    if (parsed.role !== "customer") {
      navigate("/");
      return;
    }

    setUser(parsed);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-6">
      {/* Header */}
      <div className="bg-white shadow-sm rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {user?.name || "Customer"} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your orders, profile, and shopping activity
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-4 md:mt-0 px-5 py-2 rounded-full bg-orange-500 text-white hover:opacity-90 transition"
        >
          Continue Shopping
        </button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

        {/* Orders */}
        <div
          onClick={() => navigate("/orders")}
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition"
        >
          <h2 className="text-lg font-semibold text-gray-800">My Orders</h2>
          <p className="text-gray-500 mt-2">
            View and track your recent purchases
          </p>
        </div>

        {/* Profile */}
        <div
          onClick={() => navigate("/profile")}
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition"
        >
          <h2 className="text-lg font-semibold text-gray-800">Profile</h2>
          <p className="text-gray-500 mt-2">
            Update your personal information
          </p>
        </div>

        {/* Cart */}
        <div
          onClick={() => navigate("/cart")}
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition"
        >
          <h2 className="text-lg font-semibold text-gray-800">Cart</h2>
          <p className="text-gray-500 mt-2">
            View items you are about to purchase
          </p>
        </div>

        {/* Settings (future use) */}
        <div className="bg-white p-6 rounded-xl shadow-sm opacity-60">
          <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
          <p className="text-gray-500 mt-2">
            Coming soon...
          </p>
        </div>

      </div>
    </div>
  );
};

export default CustomerDashboard;