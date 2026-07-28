import { createContext } from "react";
import type { CartItem } from "./cartTypes";
import type { Product } from "../../types/product";

export interface CartContextType {
  
  cartItems: CartItem[];

  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;

  addToCart: (product: Product) => void;

  removeFromCart: (id: string) => void;

  updateQuantity: (id: string, qty: number) => void;

  clearCart: () => void;

  increaseQuantity: (id: string) => void;

  decreaseQuantity: (id: string) => void;
}

export const CartContext = createContext<CartContextType | null>(null);