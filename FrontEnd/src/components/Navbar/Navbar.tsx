import { FaCartShopping, FaUserPlus } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 px-4 sm:px-6 lg:px-10 py-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        {/* Logo + Mobile Icons */}
        <div className="flex items-center justify-between w-full md:w-auto">

          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer select-none text-2xl sm:text-3xl font-extrabold tracking-tight"
          >
            <span className="bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              SK_
            </span>
            <span className="text-gray-800">Login</span>
          </div>

          {/* Mobile Icons */}
          <div className="flex md:hidden items-center gap-4 text-xl text-gray-700">
            <button className="p-2 rounded-full hover:bg-gray-100 hover:text-amber-500 transition">
              <FaCartShopping />
            </button>

            <button className="p-2 rounded-full hover:bg-gray-100 hover:text-amber-500 transition">
              <FaUserPlus />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full md:max-w-xl mx-auto">
          <div className="flex w-full shadow-sm rounded-full overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-amber-400 transition">

            <input
              type="text"
              placeholder="Search for products, brands..."
              className="flex-1 px-4 py-2 text-sm outline-none bg-white"
            />

            <button className="bg-linear-to-r from-amber-400 to-orange-500 px-5 flex items-center justify-center hover:opacity-90 transition hover:cursor-pointer">
              <IoSearch className="text-white text-lg" />
            </button>

          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-gray-700">

          {/* Cart */}
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 hover:text-amber-500 transition hover:cursor-pointer"
          >
            <FaCartShopping className="text-lg" />
            <span className="font-medium">Cart</span>
          </button>

          {/* Login */}
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-purple-500 to-orange-400 text-white hover:bg-gray-800 transition hover:cursor-pointer"
          >
            <FaUserPlus />
            <span className="font-medium">Login</span>
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;