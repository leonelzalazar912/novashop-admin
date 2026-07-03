import { useEffect, useRef, useState } from "react";
import { Search, ShoppingCart, ChevronDown, Menu, X, Store } from "lucide-react";import { products } from "./data";
import type { Product } from "../../types/product";
import { storeConfig } from "../../config/storeConfig";
import { theme } from "../../config/theme";
import { texts } from "../../config/texts";


const navLinks = [
  { label: "TIENDA", href: "#" },
  { label: "OFERTAS", href: "#ofertas" },
  {
    label: "JUEGOS PS5",
    href: "#",
    sub: ["Acción", "RPG", "Deportes", "Aventura"],
  },
  {
    label: "JUEGOS PS4",
    href: "#",
    sub: ["Acción", "RPG", "Deportes", "Aventura"],
  },
  {
    label: "JUEGOS XBOX",
    href: "#",
    sub: ["Xbox Series X", "Xbox One", "Game Pass"],
  },
  {
    label: "NINTENDO",
    href: "#",
    sub: ["Switch", "Switch Lite", "Clásicos"],
  },
  { label: "SEGA", href: "#" },
];


interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onProfileClick: () => void;
  onGoLogin: () => void;
  onSearchCatalog: (text: string) => void;
  onViewDetails: (game: Product) => void;
}

export function Header({
  cartCount,
  onCartClick,
  onProfileClick,
  onGoLogin,
  onSearchCatalog,
  onViewDetails
}: HeaderProps) {
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const searchResults = query.trim()
  ? products
      .filter((game) =>
        game.name.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 6)
  : [];

  const searchRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target as Node)
    ) {
      setIsSearchOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  return (
    <header className="sticky top-0 z-50 w-full" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Top bar */}
      <div
        className="w-full px-4 py-3 flex items-center gap-4"
        style={{ backgroundColor: theme.colors.header, borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="container mx-auto flex items-center gap-4 max-w-7xl w-full">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2 shrink-0"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            <div
              className="w-8 h-8 rounded flex items-center justify-center"
              style={{ backgroundColor: storeConfig.primaryColor }}
            >
              <Store size={18} color="#ffffff" strokeWidth={2.5} />
            </div>
            <span
              className="hidden sm:block"
              style={{
                color: storeConfig.primaryColor,
                fontSize: "1.4rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              {storeConfig.appName}
            </span>
          </a>

          {/* Search */}
          <div ref={searchRef} className="flex-1 max-w-xl relative">
            <input
              type="text"
              value={query}
              onChange={(e) => {
  setQuery(e.target.value);
  setIsSearchOpen(true);
}}
              onKeyDown={(e) => {
  if (e.key === "Enter" && query.trim() !== "") {
    onSearchCatalog(query.trim());
  }
}}
              placeholder={texts.app.searchPlaceholder}
              className="w-full px-4 py-2 pr-10 outline-none transition-colors"
              style={{
                backgroundColor: theme.colors.surfaceLight,
                color: theme.colors.text,
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "4px",
                fontSize: "0.875rem",
              }}
              onFocus={(e) => {
  e.currentTarget.style.borderColor = "#6A3CE6";
  setIsSearchOpen(true);
}}
onBlur={(e) =>
  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
}
            />
            <Search
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "#7a7d99" }}
            />
            {isSearchOpen && searchResults.length > 0 && (
  <div
    style={{
      position: "absolute",
      top: "46px",
      left: 0,
      right: 0,
      backgroundColor: theme.colors.surface,
      border: "1px solid rgba(106,60,230,0.45)",
      borderRadius: "10px",
      overflow: "hidden",
      zIndex: 200,
      boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
    }}
  >
    {searchResults.map((game) => (
      <button
        key={game.id}
        onClick={() => {
  onViewDetails(game);
  setQuery("");
}}
onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(106,60,230,0.18)")}
onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "10px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: theme.colors.text,
          textAlign: "left",
        }}
      >
        <img
          src={game.image}
          alt={game.name}
          style={{
            width: "42px",
            height: "56px",
            objectFit: "cover",
            borderRadius: "6px",
          }}
        />

        <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
          {game.name}
        </span>
      </button>
    ))}
  </div>
)}
{isSearchOpen && query.trim() !== "" && searchResults.length === 0 && (
  <div
    style={{
      position: "absolute",
      top: "46px",
      left: 0,
      right: 0,
      backgroundColor: theme.colors.surface,
      border: "1px solid rgba(106,60,230,0.35)",
      borderRadius: "10px",
      padding: "14px",
      zIndex: 200,
      color: "#B0B3C6",
      fontSize: "0.85rem",
      boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
    }}
  >
    {texts.app.noResults}
  </div>
)}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 ml-auto">
            
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded transition-opacity hover:opacity-90 active:scale-95"
                style={{
                  backgroundColor: "transparent",
                  color: "#ff6b6b",
                  border: "1px solid rgba(255,107,107,0.35)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
              }}
>
  CERRAR SESION
</button>

            {/*}
            <button
  onClick={onProfileClick}
  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded transition-opacity hover:opacity-90 active:scale-95"
  style={{
    backgroundColor: theme.colors.surfaceLight,
    color: theme.colors.text,
    border: "1px solid rgba(255,255,255,0.12)",
    fontSize: "0.85rem",
  }}
>
  MI PERFIL
</button>
*/}

            <button
              onClick={onCartClick}
              className="flex items-center gap-2 px-4 py-2 rounded relative transition-opacity hover:opacity-90 active:scale-95"
              style={{
backgroundColor: "#6A3CE6",
color: "#ffffff",
border: "1px solid #6A3CE6",
  fontSize: "0.85rem",
  fontWeight: 700,
}}
            >
              <ShoppingCart size={17} />
              <span className="hidden sm:inline">{texts.app.cart}</span>
              {cartCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white"
                  style={{
  backgroundColor: "#e8003d",
  fontSize: "0.7rem",
  fontWeight: 800,
  color: "#ffffff",
  border: "2px solid #0d0e12",
  boxShadow: "0 0 10px rgba(232,0,61,0.6)",
}}
                >
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="sm:hidden p-2"
              style={{ color: "#e8eaf0" }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Nav bar */}
      <nav
        hidden
        className="hidden sm:block w-full"
        style={{ backgroundColor: "#6A3CE6" }}
      >
        <div className="container mx-auto max-w-7xl px-4">
          <ul className="flex items-center gap-0">
            {navLinks.map((link) => (
              <li
                key={link.label}
                className="relative group"
                onMouseEnter={() => link.sub && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a
                  href={link.href}
                  className="flex items-center gap-1 px-3 py-2.5 text-xs font-semibold transition-colors hover:bg-black/10"
                  style={{
                    color: "#0a0b0e",
                    letterSpacing: "0.04em",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {link.label}
                  {link.sub && <ChevronDown size={12} strokeWidth={2.5} />}
                </a>
                {link.sub && activeDropdown === link.label && (
                  <div
                    className="absolute top-full left-0 min-w-[160px] py-1 z-50"
                    style={{
                      backgroundColor: theme.colors.surface,
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "0 0 6px 6px",
                    }}
                  >
                    {link.sub.map((item) => (
                      <a
                        key={item}
                        href="#"
                        className="block px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                        style={{ color: "#e8eaf0" }}
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="sm:hidden w-full py-2"
          style={{ backgroundColor: theme.colors.header, borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block px-5 py-3 text-sm hover:bg-white/5 transition-colors"
              style={{ color: "#e8eaf0" }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      {showLogoutConfirm && (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center"
    style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
  >
    <div
      style={{
        backgroundColor: theme.colors.surface,
        border: "1px solid rgba(106,60,230,0.35)",
        borderRadius: "16px",
        padding: "24px",
        width: "90%",
        maxWidth: "380px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
      }}
    >
      <h2 style={{ color: "#E8E9F0", fontSize: "1.3rem", fontWeight: 700 }}>
        ¿Cerrar sesión?
      </h2>

      <p style={{ color: "#A0A3B8", marginTop: "10px", lineHeight: 1.5 }}>
        Vas a volver a la pantalla de inicio de sesión.
      </p>

      <div className="flex gap-3 justify-end" style={{ marginTop: "22px" }}>
        <button
          onClick={() => setShowLogoutConfirm(false)}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            background: "transparent",
            color: "#A0A3B8",
            border: "1px solid rgba(255,255,255,0.12)",
            cursor: "pointer",
          }}
        >
          Cancelar
        </button>

        <button
          onClick={() => {
  setShowLogoutConfirm(false);
  onGoLogin();
}}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            background: "#6A3CE6",
            color: "#ffffff",
            border: "none",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  </div>
)}
    </header>
  );
}
