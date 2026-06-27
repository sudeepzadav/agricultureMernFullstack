import { FaCartShopping, FaUserPlus } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router";
import { Logo } from "../../constants/image";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 🔥 Sync auth state when storage changes (login/logout)
  useEffect(() => {
    const syncUser = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };

    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
    setDropdownOpen(false);

    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 px-4 sm:px-6 lg:px-10 py-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        {/* LOGO */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer select-none flex items-center justify-center p-2 rounded-xl transition-all duration-300 hover:scale-105 hover:bg-gray-100"
          >
            <img
              src={Logo}
              alt="Logo"
              className="w-36 sm:w-44 h-auto object-contain drop-shadow-md transition-transform duration-300 hover:rotate-2 rounded-lg"
            />
          </div>

          {/* MOBILE ICONS */}
          <div className="flex md:hidden items-center gap-4 text-xl text-gray-700">
            <button className="p-2 rounded-full hover:bg-gray-100 hover:text-amber-500 transition">
              <FaCartShopping />
            </button>

            {user ? (
              <button
                onClick={() => navigate("/profile")}
                className="w-10 h-10 rounded-full bg-amber-400 text-white font-bold"
              >
                {user.name?.charAt(0).toUpperCase()}
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="p-2 rounded-full hover:bg-gray-100 hover:text-amber-500 transition"
              >
                <FaUserPlus />
              </button>
            )}
          </div>
        </div>

        {/* SEARCH */}
        <div className="w-full md:max-w-xl mx-auto">
          <div className="flex w-full shadow-sm rounded-full overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-amber-400 transition">
            <input
              type="text"
              placeholder="Search for products, brands..."
              className="flex-1 px-4 py-2 text-sm outline-none bg-white"
            />

            <button className="bg-linear-to-r from-amber-400 to-orange-500 px-5 flex items-center justify-center hover:opacity-90 transition">
              <IoSearch className="text-white text-lg" />
            </button>
          </div>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6 text-gray-700">

          {/* CART */}
          <button className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 hover:text-amber-500 transition">
            <FaCartShopping className="text-lg" />
            <span className="font-medium">Cart</span>
          </button>

          {/* USER SECTION */}
          {user ? (
            <div className="relative">

              {/* PROFILE BUTTON */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-orange-100 to-amber-100 hover:from-orange-200 hover:to-amber-200 transition shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center font-bold text-white">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <span className="font-medium text-gray-800">
                  {user.name}
                </span>
              </button>

              {/* DROPDOWN */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg overflow-hidden">

                  {/* ✅ PROFILE LINK */}
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => {
                      navigate("/orders");
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Orders
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-purple-500 to-orange-400 text-white hover:opacity-90 transition"
            >
              <FaUserPlus />
              <span className="font-medium">Login</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;