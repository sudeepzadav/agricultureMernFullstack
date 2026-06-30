import { FaCartShopping, FaUserPlus } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router";
import { Logo } from "../../constants/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../utils/store";
import { logout as logoutAction } from "../../utils/userSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Single source of truth: Redux, not localStorage
  const user = useSelector((state: RootState) => state.user.user);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 🛒 CART COUNT STATE
  const [cartCount, setCartCount] = useState(0);

  // ✅ Sync cart count (still localStorage-based, that's fine for cart)
  useEffect(() => {
    const syncCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");

      const total = cart.reduce((sum: number, item: any) => {
        return sum + (item.qty || item.quantity || 1);
      }, 0);

      setCartCount(total);
    };

    syncCart();

    window.addEventListener("storage", syncCart);
    window.addEventListener("focus", syncCart);

    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener("focus", syncCart);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    dispatch(logoutAction());
    setDropdownOpen(false);

    navigate("/login");
  };

  const goToDashboard = () => {
    if (user?.role === "farmer") {
      navigate("/farmerDashboard");
    } else if (user?.role === "customer") {
      navigate("/customerDashboard");
    } else {
      navigate("/profile");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 px-4 sm:px-6 lg:px-10 py-3">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        {/* LOGO */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer flex items-center justify-center p-2 rounded-xl hover:bg-gray-100 transition"
          >
            <img src={Logo} alt="Logo" className="w-36 sm:w-44" />
          </div>

          {/* MOBILE ICONS */}
          <div className="flex md:hidden items-center gap-4 text-xl">

            {/* 🛒 CART MOBILE */}
            <div className="relative cursor-pointer" onClick={() => navigate("/cart")}>
              <FaCartShopping />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </div>

            {user ? (
              <button
                onClick={goToDashboard}
                className="w-10 h-10 rounded-full bg-amber-400 text-white font-bold"
              >
                {user.name?.charAt(0).toUpperCase()}
              </button>
            ) : (
              <button onClick={() => navigate("/login")}>
                <FaUserPlus />
              </button>
            )}
          </div>
        </div>

        {/* SEARCH */}
        <div className="w-full md:max-w-xl mx-auto">
          <div className="flex border rounded-full overflow-hidden">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 px-4 py-2 outline-none"
            />

            <button className="bg-orange-500 px-5 text-white">
              <IoSearch />
            </button>
          </div>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">

          {/* 🛒 CART DESKTOP */}
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/cart")}
          >
            <FaCartShopping className="text-xl" />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </div>

          {/* USER */}
          {user ? (
            <div className="relative">

              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100"
              >
                <div className="w-8 h-8 bg-amber-500 text-white flex items-center justify-center rounded-full">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <span>{user.name}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-xl overflow-hidden">

                  <button
                    onClick={() => {
                      goToDashboard();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Dashboard
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
              className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-full"
            >
              <FaUserPlus />
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;