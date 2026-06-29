import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { HeroBanner } from "./components/HeroBanner";
import { OffersStrip } from "./components/OffersStrip";
import { ConsoleCategories } from "./components/ConsoleCategories";
import { ProductGrid } from "./components/ProductGrid";
import { CartDrawer } from "./components/CartDrawer";
import { Footer } from "./components/Footer";
import { ProductCard } from "./components/ProductCard";
import { LoginScreen } from "./components/LoginScreen";
import { RegisterScreen } from "./components/RegisterScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { allGames, featuredGames } from "./components/data";
import { CatalogScreen } from "./components/CatalogScreen";
import type { Game } from "./components/ProductCard";
import { CheckoutScreen } from "./components/CheckoutScreen";
import { PaymentScreen } from "./components/PaymentScreen";
import { CompletedScreen } from "./components/CompletedScreen";
import { DeliveryScreen } from "./components/DeliveryScreen";
import { ClaimsScreen } from "./components/ClaimsScreen";

interface CartItem extends Game {
  qty: number;
}

export default function App() {
  const [initialSelectedGame, setInitialSelectedGame] = useState<Game | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activePlatform, setActivePlatform] = useState("Todos");
  const [screen, setScreen] = useState<
  | "login"
  | "register"
  | "home"
  | "catalog"
  | "profile"
  | "checkout"
  | "delivery"
  | "payment"
  | "completed"
  | "claims"
>("login");
  const [catalogSearch, setCatalogSearch] = useState("");
  useEffect(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto",
  });
}, [screen, initialSelectedGame]);

  const goToCatalog = () => {
  setInitialSelectedGame(null);
  setCatalogSearch("");
  setScreen("catalog");
};
const handleViewDetails = (game: Game) => {
  setInitialSelectedGame(game);
  setScreen("catalog");
};
  const addToCart = (game: Game) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === game.id);
      if (existing) {
        return prev.map((i) => (i.id === game.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...game, qty: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const cartCount = cartItems.reduce((a, i) => a + i.qty, 0);

  const ps5Games = allGames.filter((g) => g.platform === "PS5").slice(0, 5);
  const xboxGames = allGames.filter((g) => g.platform === "Xbox").slice(0, 5);

  if (screen === "login") {
  return (
    <LoginScreen
      onGoRegister={() => setScreen("register")}
      onGoProfile={() => setScreen("home")}
    />
  );
}

if (screen === "register") {
  return (
    <RegisterScreen
      onGoLogin={() => setScreen("login")}
      onGoProfile={() => setScreen("home")}
    />
  );
}

if (screen === "profile") {
  return (
    <ProfileScreen
  onGoLogin={() => setScreen("login")}
  onGoHome={() => setScreen("home")}  
/>
  );
}

if (screen === "catalog") {
  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "#0d0e12", fontFamily: "'Inter', sans-serif" }}
    >
      <Header
  cartCount={cartCount}
  onCartClick={() => setCartOpen(true)}
  onProfileClick={() => setScreen("profile")}
  onGoLogin={() => setScreen("login")}
  onSearchCatalog={(text: string) => {
    setInitialSelectedGame(null);
    setCatalogSearch(text);
    setScreen("catalog");
  }}
  onViewDetails={handleViewDetails}
/>

      <CatalogScreen
  games={allGames}
  initialSearch={catalogSearch}
  onAddToCart={addToCart}
  onBack={() => setScreen("home")}
  initialSelectedGame={initialSelectedGame}
/>

<CartDrawer
  open={cartOpen}
  items={cartItems}
  onClose={() => setCartOpen(false)}
  onRemove={removeFromCart}
  onCheckout={() => {
    setCartOpen(false);
    setScreen("checkout");
  }}
/>

    </div>
  );
}

if (screen === "delivery") {
  return (
    <DeliveryScreen
      onBack={() => setScreen("checkout")}
      onContinue={() => setScreen("payment")}
    />
  );
}

if (screen === "checkout") {
  return (
    <CheckoutScreen
      items={cartItems}
      onBack={() => {
        setScreen("home");
        setCartOpen(true);
      }}
      onContinue={() => setScreen("delivery")}
      onRemoveItem={(id) => {
        setCartItems(cartItems.filter((item) => item.id !== id));
      }}
      onIncreaseItem={(id) => {
  setCartItems(
    cartItems.map((item) =>
      item.id === id
        ? { ...item, qty: item.qty + 1 }
        : item
    )
  );
}}

onDecreaseItem={(id) => {
  setCartItems(
    cartItems
      .map((item) =>
        item.id === id
          ? { ...item, qty: item.qty - 1 }
          : item
      )
      .filter((item) => item.qty > 0)
  );
}}
    />
  );
}

if (screen === "payment") {
  return (
    <PaymentScreen
      items={cartItems}
      onBack={() => setScreen("delivery")}
      onComplete={() => setScreen("completed")}
    />
  );
}

if (screen === "completed") {
  return (
    <CompletedScreen
  items={cartItems}
  onBackPayment={() => setScreen("payment")}
  onBackHome={() => {
    setCartItems([]);
    setScreen("home");
  }}
/>
  );
}

if (screen === "claims") {
  return (
    <ClaimsScreen
      onBack={() => setScreen("home")}
      onFinish={() => setScreen("home")}
    />
  );
}

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "#0d0e12", fontFamily: "'Inter', sans-serif" }}
    >
      <Header
  cartCount={cartCount}
  onCartClick={() => setCartOpen(true)}
  onProfileClick={() => setScreen("profile")}
  onGoLogin={() => setScreen("login")}
  onSearchCatalog={(text: string) => {
    setInitialSelectedGame(null);
    setCatalogSearch(text);
    setScreen("catalog");
  }}
  onViewDetails={handleViewDetails}
/>

      <main>
        <HeroBanner onGoCatalog={goToCatalog} />
        <OffersStrip onClaimsClick={() => setScreen("claims")} />

       

        <ConsoleCategories onFilter={setActivePlatform} activePlatform={activePlatform} />

        <ProductGrid
  games={allGames}
  onAddToCart={addToCart}
  platform={activePlatform}
  onGoCatalog={goToCatalog}
  onViewDetails={handleViewDetails}
/>

      </main>

      <Footer />

      <CartDrawer
  open={cartOpen}
  items={cartItems}
  onClose={() => setCartOpen(false)}
  onRemove={removeFromCart}
  onCheckout={() => {
    setCartOpen(false);
    setScreen("checkout");
  }}
/>
    </div>
  );
}
