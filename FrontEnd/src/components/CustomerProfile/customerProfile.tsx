import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import UserProfileCard from "../UserProfile";

type Address = {
  street?: string;
  city?: string;
  district?: string;
  province?: string;
  postalCode?: string;
};

type User = {
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: Address | string;
};

const CustomerProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
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
    { label: "Dashboard", action: () => navigate("/customerDashboard") },
    { label: "My Orders", action: () => navigate("/orders") },
    { label: "Profile", action: () => navigate("/customer-profile") },
    { label: "Cart", action: () => navigate("/cart") },
  ];

  // SIDEBAR 
  const Sidebar = () => (
    <div>
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

      <div className="mt-10 border-t pt-4">
       <UserProfileCard/>
      </div>
    </div>
  );

  return (
    <div className="min-h-145 bg-gray-100 flex">
      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow px-4 py-3 flex justify-between items-center">
        <h2 className="font-bold text-orange-500">Profile</h2>

        <button onClick={() => setMobileMenuOpen(true)}>
          <HiOutlineMenu className="text-2xl" />
        </button>
      </div>

      {/* MOBILE SIDEBAR */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 flex">
          <div className="w-72 bg-white h-full p-6">
            <button
              className="mb-6"
              onClick={() => setMobileMenuOpen(false)}
            >
              <HiX className="text-2xl" />
            </button>

            <Sidebar />
          </div>

          <div
            className="flex-1"
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:block w-64 bg-white shadow-md p-6">
        <Sidebar />
      </aside>

      {/* rightside */}
      <main className="flex-1">
        <div className="min-h-145 bg-gray-100 py-8 px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
            
            {/* Header */}
            <div className="bg-orange-500 h-32"></div>

            {/* Profile Body */}
            <div className="px-8 pb-8">

              {/* Avatar */}
              <div className="-mt-14 flex flex-col items-center">
                <div className="w-28 h-28 rounded-full bg-white border-4 border-white shadow flex items-center justify-center text-4xl font-bold text-orange-500">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>

                <h1 className="mt-4 text-2xl font-bold">{user?.name}</h1>
                <p className="text-gray-500 capitalize">{user?.role}</p>
              </div>

              {/* Info Grid */}
              <div className="mt-10 grid gap-6 sm:grid-cols-2">

                <div>
                  <p className="text-gray-500 text-sm">Full Name</p>
                  <p className="font-semibold text-lg">{user?.name}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="font-semibold text-lg">{user?.email}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Phone Number</p>
                  <p className="font-semibold text-lg">
                    {user?.phone || "Not Added"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Role</p>
                  <p className="font-semibold text-lg capitalize">
                    {user?.role}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-gray-500 text-sm">Shipping Address</p>

                  <p className="font-semibold text-lg">
                    {user?.address
                      ? typeof user.address === "string"
                        ? user.address
                        : `${user.address.street || ""}, ${user.address.city || ""}, ${user.address.district || ""}, ${user.address.province || ""} - ${user.address.postalCode || ""}`
                      : "No shipping address added"}
                  </p>
                </div>

              </div>

              {/* Buttons */}
              <div className="mt-10 flex flex-wrap gap-4">

                <button
                  onClick={() => navigate("/edit-profile")}
                  className="px-6 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition"
                >
                  Edit Profile
                </button>

                <button
                  onClick={() => navigate(-1)}
                  className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  Back
                </button>

              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerProfile;