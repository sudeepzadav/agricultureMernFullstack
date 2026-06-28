import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

type Order = {
  _id: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  status: string;
};

const orderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // 🔐 Role protection
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.role !== "farmer") {
      navigate("/");
    }
  }, [navigate]);

  // 📦 Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:4000/api/v1/farmer/orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setOrders(res.data?.orders || []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ✅ SIDEBAR */}
      <div className="w-64 bg-white shadow-md p-5 hidden md:block">
        <h2 className="text-xl font-bold mb-6 text-green-600">Farmer Panel</h2>

        <ul className="space-y-4 text-gray-700">
          <li
            onClick={() => navigate("/farmerDashboard")}
            className="hover:text-green-600 cursor-pointer"
          >
            Dashboard
          </li>

          <li
            onClick={() => navigate("/farmer/myProducts")}
            className="hover:text-green-600 cursor-pointer"
          >
            Products
          </li>

          <li
            onClick={() => navigate("/farmer/orders")}
            className="hover:text-green-600 cursor-pointer font-semibold"
          >
            Orders
          </li>

          <li
            onClick={() => navigate("/farmer/settings")}
            className="hover:text-green-600 cursor-pointer"
          >
            Settings
          </li>
        </ul>
      </div>

      {/* ✅ MAIN CONTENT */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>

        {loading ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No orders found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr className="text-left">
                  <th className="p-3">Product</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Total Price</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-t">
                    <td className="p-3">{o.productName}</td>
                    <td className="p-3">{o.quantity}</td>
                    <td className="p-3">Rs {o.totalPrice}</td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          o.status === "delivered"
                            ? "bg-green-100 text-green-600"
                            : o.status === "pending"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-red-100 text-red-600"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default orderList;
