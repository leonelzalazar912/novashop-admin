import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";
import { CartProvider } from "./core/cart/CartProvider";

createRoot(document.getElementById("root")!).render(
  <CartProvider>
    <App />
  </CartProvider>
);