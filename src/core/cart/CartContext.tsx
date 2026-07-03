import { createContext } from "react";
import type { CartItem } from "./cartTypes";

export interface CartContextType {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export const CartContext = createContext<CartContextType | null>(null);