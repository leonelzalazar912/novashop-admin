import { createContext } from "react";
import type { CartItem } from "./cartTypes";
import type { Product } from "../../types/product";

export interface CartContextType {
  cartItems: CartItem[];

  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;

  addToCart: (product: Product) => void;

  removeFromCart: (id: number) => void;

  updateQuantity: (id: number, qty: number) => void;
}

export const CartContext = createContext<CartContextType | null>(null);