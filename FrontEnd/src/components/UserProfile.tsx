// src/components/common/UserProfileCard.tsx
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { FiLogOut } from "react-icons/fi";
import type { RootState } from "../utils/store";
import { logout as logoutAction } from "../utils/userSlice";
import { setCart } from "../utils/cartSlice";

const UserProfileCard = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    dispatch(logoutAction());
    dispatch(setCart([]));

    navigate("/login");
  };

  return (
    <div className="mt-8 w-full rounded-2xl bg-linear-to-br from-orange-50 to-amber-100 p-5 shadow-md border border-orange-200">
      {/* Profile */}
      <div className="flex flex-col items-center text-center">
        <div className="w-16 rounded-full bg-linear-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
          {user.name?.charAt(0).toUpperCase()}
        </div>

        <h3 className="mt-2 text-lg font-bold text-gray-800">{user.name}</h3>

        <span className="mt-1 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold capitalize text-orange-600 shadow-sm">
          {user.role}
        </span>
      </div>

      
      <div className="my-2 border-t border-orange-200" />

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-1 font-medium text-white transition-all duration-200 hover:bg-red-600 hover:shadow-lg active:scale-95"
      >
        <FiLogOut size={18} />
        Logout
      </button>
    </div>
  );
};

export default UserProfileCard;
