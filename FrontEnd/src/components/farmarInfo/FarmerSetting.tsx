import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import type { RootState } from "../../utils/store";
import { logout as logoutAction, updateUser } from "../../utils/userSlice";
import { setCart } from "../../utils/cartSlice";


const FarmerSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  // ================= MOBILE SIDEBAR =================
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ================= PROFILE FORM =================
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [savingProfile, setSavingProfile] = useState(false);

  // ================= PASSWORD FORM =================
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // ================= DELETE ACCOUNT =================
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getToken = () => localStorage.getItem("token");

  // ================= UPDATE PROFILE =================
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = getToken();

      if (!token) {
        toast.error("Please login again");
        return;
      }

      setSavingProfile(true);

      const res = await axios.put(
        "http://localhost:4000/api/v1/user/profile",
        {
          name: name.trim(),
          email: email.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updated = res.data?.user;
      if (updated) {
        dispatch(updateUser(updated));
      }

      toast.success("Profile updated ✅");
    } catch (error: any) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  // ================= CHANGE PASSWORD =================
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        toast.error("Please login again");
        return;
      }

      setSavingPassword(true);

      await axios.put(
        "http://localhost:4000/api/v1/user/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );  

      toast.success("Password updated ✅");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch(logoutAction());
    dispatch(setCart([]));
    navigate("/login");
  };

  // ================= DELETE ACCOUNT =================
  const handleDeleteAccount = async () => {
    try {
      const token = getToken();

      if (!token) {
        toast.error("Please login again");
        return;
      }

      setDeleting(true);

      await axios.delete("http://localhost:4000/api/v1/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Account deleted");

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      dispatch(logoutAction());
      dispatch(setCart([]));
      navigate("/login");
    } catch (error: any) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  const navItems = [
    { label: "Dashboard", path: "/farmerDashboard" },
    { label: "Products", path: "/farmer/myProducts" },
    { label: "Orders", path: "/farmer/orders" },
    { label: "Settings", path: "/farmer/farmerSetting" },
  ];

  const SidebarContent = () => (
    <>
      <div>
        <h2 className="text-xl font-bold mb-6 text-green-600">Farmer Panel</h2>

        <ul className="space-y-4 text-gray-700">
          {navItems.map((item) => {
            const isActive = item.path === "/farmer/farmerSetting";
            return (
              <li
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`cursor-pointer ${
                  isActive
                    ? "text-green-600 font-medium"
                    : "hover:text-green-600"
                }`}
              >
                {item.label}
              </li>
            );
          })}
        </ul>
      </div>

      
    </>
  );

  return (
    <div className="min-h-160 bg-gray-100 flex flex-col md:flex-row">
      {/* ================= MOBILE TOP BAR ================= */}
      <div className="md:hidden flex items-center justify-between bg-white shadow-md px-4 py-3 sticky top-0 z-30">
        <h2 className="text-lg font-bold text-green-600">Farmer Panel</h2>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="text-2xl text-gray-700"
          aria-label="Open menu"
        >
          <HiOutlineMenu />
        </button>
      </div>

      {/* ================= MOBILE SLIDE-IN SIDEBAR ================= */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* overlay */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* drawer */}
          <div className="relative w-72 max-w-[80%] bg-white shadow-md p-5 flex flex-col justify-between h-full overflow-y-auto">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 text-2xl text-gray-500"
              aria-label="Close menu"
            >
              <HiX />
            </button>

            <div className="mt-8">
              <SidebarContent />
            </div>
          </div>
        </div>
      )}

      {/* ================= DESKTOP SIDEBAR ================= */}
      <div className="hidden md:flex w-64 bg-white shadow-md p-5 md:flex-col md:justify-between shrink-0">
        <SidebarContent />
      </div>

      {/* ================= MAIN ================= */}
      <div className="flex-1 p-4 sm:p-6 md:p-8 w-full max-w-3xl mx-auto md:mx-0">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Settings ⚙️</h1>

        {/* ================= PROFILE INFO ================= */}
        <div className="bg-white p-4 sm:p-5 rounded-xl shadow mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Profile Information
          </h2>

          <form
            onSubmit={handleProfileUpdate}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="border p-2 rounded w-full"
            />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="border p-2 rounded w-full"
            />

            <button
              type="submit"
              disabled={savingProfile}
              className="bg-green-600 text-white p-2 rounded md:col-span-2 disabled:opacity-60"
            >
              {savingProfile ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* ================= CHANGE PASSWORD ================= */}
        <div className="bg-white p-4 sm:p-5 rounded-xl shadow mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Change Password
          </h2>

          <form
            onSubmit={handlePasswordChange}
            className="grid grid-cols-1 gap-4"
          >
            <input
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              type="password"
              placeholder="Current Password"
              className="border p-2 rounded w-full"
            />

            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              placeholder="New Password"
              className="border p-2 rounded w-full"
            />

            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="Confirm New Password"
              className="border p-2 rounded w-full"
            />

            <button
              type="submit"
              disabled={savingPassword}
              className="bg-green-600 text-white p-2 rounded disabled:opacity-60"
            >
              {savingPassword ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* ================= ACCOUNT ACTIONS ================= */}
        <div className="bg-white p-4 sm:p-5 rounded-xl shadow">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Account</h2>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleLogout}
              className="w-full sm:w-fit bg-amber-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full sm:w-fit text-red-600 border border-red-200 px-4 py-2 rounded hover:bg-red-50"
              >
                Delete Account
              </button>
            ) : (
              <div className="border border-red-200 bg-red-50 p-4 rounded flex flex-col gap-3">
                <p className="text-sm text-red-700">
                  This will permanently delete your account and all your
                  products. This cannot be undone. Are you sure?
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-60"
                  >
                    {deleting ? "Deleting..." : "Yes, delete my account"}
                  </button>

                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerSettings;
