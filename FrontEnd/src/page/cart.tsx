import { useContext } from "react";
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
  const cartContext = useContext(CartContext);

  if (!cartContext) return null;

  const { cart, removeItem, clearCart } = cartContext;

  if (!cart) return <p>Loading...</p>;

  return (
    <div>
      <h2>Cart</h2>

      {cart.items.map((item) => (
        <div key={item._id}>
          <h4>{item.product.title}</h4>
          <p>Qty: {item.quantity}</p>
          <p>Price: ₹{item.price}</p>

          <button onClick={() => removeItem(item.product._id)}>
            Remove
          </button>
        </div>
      ))}

      <h3>Total: ₹{cart.totalPrice}</h3>

      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
};

export default Cart;