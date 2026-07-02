import { useContext } from "react";
import { useNavigate } from "react-router";
import { HiOutlineTrash, HiOutlineShoppingBag } from "react-icons/hi";
import { CartContext } from "../components/context/CartContext";

/** Types */
type Product = {
  _id: string;
  title: string;
};

type CartItem = {
  _id: string;
  product: Product;
  quantity: number;
  price: number;
};

export type CartType = {
  items: CartItem[];
  totalPrice: number;
};

const Cart = () => {
  const navigate = useNavigate();
  const cartContext = useContext(CartContext);

  if (!cartContext) return null;

  const { cart, removeItem, clearCart } = cartContext;

  // ================= LOADING STATE =================
  if (!cart) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Loading your cart...</p>
      </div>
    );
  }

  // ================= EMPTY STATE =================
  if (cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <HiOutlineShoppingBag className="text-6xl text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-6">
          Looks like you haven't added anything yet.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors"
        >
          Start shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 h-145">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= ITEMS LIST ================= */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cart.items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800 truncate">
                  {item.product.title}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Qty: {item.quantity}
                </p>
                <p className="text-sm text-gray-500">
                  ₹{item.price}{" "}
                  <span className="text-gray-400">/ item</span>
                </p>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="font-semibold text-gray-800">
                  ₹{item.price * item.quantity}
                </span>

                <button
                  onClick={() => removeItem(item.product._id)}
                  className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors"
                >
                  <HiOutlineTrash className="text-base" />
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="w-fit text-sm text-gray-500 hover:text-red-500 underline underline-offset-2 mt-2 transition-colors"
          >
            Clear cart
          </button>
        </div>

        {/* ================= ORDER SUMMARY ================= */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>
                Items (
                {cart.items.reduce((acc, i) => acc + i.quantity, 0)})
              </span>
              <span>₹{cart.totalPrice}</span>
            </div>

            <div className="border-t border-gray-100 my-3" />

            <div className="flex justify-between text-base font-semibold mb-6">
              <span>Total</span>
              <span>₹{cart.totalPrice}</span>
            </div>

            <button className="w-full bg-orange-500 text-white py-2.5 rounded-full font-medium hover:bg-orange-600 transition-colors">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;