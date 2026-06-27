import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

type User = {
  id: string;
  name: string;
  email: string;
  role: "customer" | "farmer" | "admin";
};

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 space-y-6">
        {/* HEADER */}
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-orange-400 flex items-center justify-center text-white text-2xl font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <h2 className="mt-3 text-xl font-bold">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>

          <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 capitalize">
            {user.role}
          </span>
        </div>

        {/* ACTIONS */}
        <div className="space-y-3">
          {/* ADMIN */}
          {user.role === "admin" && (
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="w-full bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition"
            >
              Go to Admin Dashboard
            </button>
          )}

          {/* FARMER */}
          {user.role === "farmer" && (
            <button
              onClick={() => navigate("/farmer/dashboard")}
              className="w-full bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition"
            >
              Go to Farmer Dashboard
            </button>
          )}

          {/* CUSTOMER */}
          {user.role === "customer" && (
            <button
              onClick={() => navigate("/orders")}
              className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition"
            >
              View My Orders
            </button>
          )}

          {/* COMMON ACTIONS */}
          <button
            onClick={() => navigate("/")}
            className="w-full border py-2 rounded-xl hover:bg-gray-100 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
