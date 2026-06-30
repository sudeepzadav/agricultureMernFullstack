import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import type { CartType } from "../../page/cart";

interface CartContextType {
  cart: CartType | null;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartType | null>(null);

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/v1/cart",
        config
      );
      setCart(res.data.cart);
    } catch (error) {
      console.error(error);
    }
  };

  const addToCart = async (productId: string, quantity = 1) => {
    try {
      await axios.post(
        "http://localhost:4000/api/v1/cart/add",
        { productId, quantity },
        config
      );
      await fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      await axios.delete(
        `http://localhost:4000/api/v1/cart/remove/${productId}`,
        config
      );
      await fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(
        "http://localhost:4000/api/v1/cart/clear",
        config
      );
      await fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        fetchCart,
        addToCart,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};