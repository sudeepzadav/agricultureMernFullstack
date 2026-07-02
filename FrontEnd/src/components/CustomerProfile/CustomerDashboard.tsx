import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import UserProfileCard from "../UserProfile";

const CustomerDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsed = JSON.parse(storedUser);

    if (parsed.role !== "customer") {
      navigate("/");
      return;
    }

    setUser(parsed);
  }, [navigate]);

  const menuItems = [
    {
      label: "Dashboard",
      action: () => navigate("/customerDashboard"),
    },
    {
      label: "My Orders",
      action: () => navigate("/orders"),
    },
    {
      label: "Profile",
      action: () => navigate("/customer-profile"),
    },
    {
      label: "Cart",
      action: () => navigate("/cart"),
    },
  ];

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-orange-500 mb-8">
          Customer Panel
        </h2>

        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li
              key={item.label}
              onClick={() => {
                item.action();
                setMobileMenuOpen(false);
              }}
              className="cursor-pointer rounded-lg px-3 py-2 hover:bg-orange-50 hover:text-orange-500 transition"
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      
      <UserProfileCard/>
    </div>
  );

  return (
    <div className="min-h-145 bg-gray-50 flex">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow px-4 py-3 flex justify-between items-center z-20">
        <h2 className="font-bold text-orange-500">Customer Panel</h2>

        <button onClick={() => setMobileMenuOpen(true)}>
          <HiOutlineMenu className="text-2xl" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 flex">
          <div className="w-72 bg-white h-full p-6 flex flex-col justify-between">
            <div>
              <button className="mb-6" onClick={() => setMobileMenuOpen(false)}>
                <HiX className="text-2xl" />
              </button>

              <Sidebar />
            </div>
          </div>

          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white shadow-md p-6 flex-col justify-between">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 mt-16 md:mt-0">
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
          <div
            onClick={() => navigate("/orders")}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition"
          >
            <h2 className="text-lg font-semibold text-gray-800">My Orders</h2>

            <p className="text-gray-500 mt-2">
              View and track your recent purchases
            </p>
          </div>

          <div
            onClick={() => navigate("/profile")}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition"
          >
            <h2 className="text-lg font-semibold text-gray-800">Profile</h2>

            <p className="text-gray-500 mt-2">
              Update your personal information
            </p>
          </div>

          <div
            onClick={() => navigate("/cart")}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition"
          >
            <h2 className="text-lg font-semibold text-gray-800">Cart</h2>

            <p className="text-gray-500 mt-2">
              View items you are about to purchase
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm opacity-60">
            <h2 className="text-lg font-semibold text-gray-800">Settings</h2>

            <p className="text-gray-500 mt-2">Coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
