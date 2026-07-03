import { useState } from "react";
import type { ReactNode } from "react";
import { CartContext } from "./CartContext";
import type { CartItem } from "./cartTypes";
import type { Product } from "../../types/product";

interface Props {
  children: ReactNode;
}

export function CartProvider({ children }: Props) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, qty: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty } : item))
    );
  };

  const clearCart = () => {
  setCartItems([]);
};

const increaseQuantity = (id: number) => {
  setCartItems((prev) =>
    prev.map((item) =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    )
  );
};

const decreaseQuantity = (id: number) => {
  setCartItems((prev) =>
    prev
      .map((item) =>
        item.id === id ? { ...item, qty: item.qty - 1 } : item
      )
      .filter((item) => item.qty > 0)
  );
};

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}