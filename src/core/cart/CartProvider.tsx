import { useState } from "react";
import type { ReactNode } from "react";
import { CartContext } from "./CartContext";
import type { CartItem } from "./cartTypes";

interface Props {
  children: ReactNode;
}

export function CartProvider({ children }: Props) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
}