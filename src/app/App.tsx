import {
  useEffect,
  useState,
} from "react";
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
import { SetPasswordScreen } from "./components/SetPasswordScreen";
import {
  products,
  featuredGames,
} from "./components/data";
import { CatalogScreen } from "./components/CatalogScreen";
import { CheckoutScreen } from "./components/CheckoutScreen";
import { PaymentScreen } from "./components/PaymentScreen";
import { CompletedScreen } from "./components/CompletedScreen";
import { DeliveryScreen } from "./components/DeliveryScreen";
import { ClaimsScreen } from "./components/ClaimsScreen";
import { storeConfig } from "../config/storeConfig";
import type { Product } from "../types/product";
import { useCart } from "../core/cart/useCart";
import { AdminDashboard } from "../modules/admin/AdminDashboard";

type AppScreen =
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
  | "admin"
  | "admin-login"
  | "set-password";

function getAuthFlowType(): string | null {
  const searchParameters =
    new URLSearchParams(
      window.location.search
    );

  const hashParameters =
    new URLSearchParams(
      window.location.hash.replace(
        /^#/,
        ""
      )
    );

  return (
    searchParameters.get("type") ??
    hashParameters.get("type")
  );
}

function clearAuthUrl() {
  window.history.replaceState(
    {},
    document.title,
    window.location.pathname
  );
}

export default function App() {
  const [
    initialSelectedGame,
    setInitialSelectedGame,
  ] = useState<Product | null>(null);

  const [cartOpen, setCartOpen] =
    useState(false);

  const {
    cartItems,
    setCartItems,
    addToCart: contextAddToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCart();

  const [
    activeCategory,
    setActiveCategory,
  ] = useState("Todos");

  const [screen, setScreen] =
    useState<AppScreen>("admin-login");

  const [
    catalogSearch,
    setCatalogSearch,
  ] = useState("");

  useEffect(() => {
    const authFlowType =
      getAuthFlowType();

    if (
      authFlowType === "invite" ||
      authFlowType === "recovery"
    ) {
      setScreen("set-password");
    }
  }, []);

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

  const handleViewDetails = (
    game: Product
  ) => {
    setInitialSelectedGame(game);
    setScreen("catalog");
  };

  const addToCart = (
    game: Product
  ) => {
    if ((game.stock ?? 0) <= 0) {
      return;
    }

    contextAddToCart(game);
    setCartOpen(true);
  };

  const cartCount = cartItems.reduce(
    (total, item) =>
      total + item.qty,
    0
  );

  const ps5Games = products
    .filter(
      (game) =>
        game.category === "PS5"
    )
    .slice(0, 5);

  const xboxGames = products
    .filter(
      (game) =>
        game.category === "Xbox"
    )
    .slice(0, 5);

  if (screen === "set-password") {
    return (
      <SetPasswordScreen
        onCompleted={() => {
          clearAuthUrl();
          setScreen("admin");
        }}
        onGoLogin={() => {
          clearAuthUrl();
          setScreen("admin-login");
        }}
      />
    );
  }

  if (
    screen === "login" ||
    screen === "admin-login"
  ) {
    return (
      <LoginScreen
        onGoRegister={() =>
          setScreen("register")
        }
        onGoProfile={() =>
          setScreen("admin")
        }
      />
    );
  }

  if (screen === "register") {
    return (
      <RegisterScreen
        onGoLogin={() =>
          setScreen("login")
        }
        onGoProfile={() =>
          setScreen("home")
        }
      />
    );
  }

  if (screen === "profile") {
    return (
      <ProfileScreen
        onGoLogin={() =>
          setScreen("login")
        }
        onGoHome={() =>
          setScreen("home")
        }
      />
    );
  }

  if (screen === "catalog") {
    return (
      <div
        className="min-h-screen w-full"
        style={{
          backgroundColor: "#0d0e12",
          fontFamily:
            "'Inter', sans-serif",
        }}
      >
        <Header
          cartCount={cartCount}
          onCartClick={() =>
            setCartOpen(true)
          }
          onProfileClick={() =>
            setScreen("profile")
          }
          onGoLogin={() =>
            setScreen("login")
          }
          onSearchCatalog={(
            text: string
          ) => {
            setInitialSelectedGame(null);
            setCatalogSearch(text);
            setScreen("catalog");
          }}
          onViewDetails={
            handleViewDetails
          }
        />

        <CatalogScreen
          games={products}
          initialSearch={catalogSearch}
          onAddToCart={addToCart}
          onBack={() =>
            setScreen("home")
          }
          initialSelectedGame={
            initialSelectedGame
          }
        />

        <CartDrawer
          open={cartOpen}
          items={cartItems}
          onClose={() =>
            setCartOpen(false)
          }
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
        onBack={() =>
          setScreen("checkout")
        }
        onContinue={() =>
          setScreen("payment")
        }
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
        onContinue={() =>
          setScreen("delivery")
        }
        onRemoveItem={(id) => {
          removeFromCart(id);
        }}
        onIncreaseItem={(id) => {
          increaseQuantity(id);
        }}
        onDecreaseItem={(id) => {
          decreaseQuantity(id);
        }}
      />
    );
  }

  if (screen === "payment") {
    return (
      <PaymentScreen
        items={cartItems}
        onBack={() =>
          setScreen("delivery")
        }
        onComplete={() =>
          setScreen("completed")
        }
      />
    );
  }

  if (screen === "completed") {
    return (
      <CompletedScreen
        items={cartItems}
        onBackPayment={() =>
          setScreen("payment")
        }
        onBackHome={() => {
          clearCart();
          setScreen("home");
        }}
      />
    );
  }

  if (screen === "claims") {
    return (
      <ClaimsScreen
        onBack={() =>
          setScreen("home")
        }
        onFinish={() =>
          setScreen("home")
        }
      />
    );
  }

  if (screen === "admin") {
    return <AdminDashboard />;
  }

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundColor: "#0d0e12",
        fontFamily:
          "'Inter', sans-serif",
      }}
    >
      <Header
        cartCount={cartCount}
        onCartClick={() =>
          setCartOpen(true)
        }
        onProfileClick={() =>
          setScreen("profile")
        }
        onGoLogin={() =>
          setScreen("login")
        }
        onSearchCatalog={(
          text: string
        ) => {
          setInitialSelectedGame(null);
          setCatalogSearch(text);
          setScreen("catalog");
        }}
        onViewDetails={
          handleViewDetails
        }
      />

      <main>
        <HeroBanner
          onGoCatalog={goToCatalog}
        />

        <OffersStrip
          onClaimsClick={() =>
            setScreen("claims")
          }
        />

        <ConsoleCategories
          onFilter={
            setActiveCategory
          }
          activeCategory={
            activeCategory
          }
        />

        <ProductGrid
          games={products}
          onAddToCart={addToCart}
          category={activeCategory}
          onGoCatalog={goToCatalog}
          onViewDetails={
            handleViewDetails
          }
        />
      </main>

      <Footer />

      <CartDrawer
        open={cartOpen}
        items={cartItems}
        onClose={() =>
          setCartOpen(false)
        }
        onRemove={removeFromCart}
        onCheckout={() => {
          setCartOpen(false);
          setScreen("checkout");
        }}
      />
    </div>
  );
}