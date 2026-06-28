import { useState } from "react";
import { ProductCard } from "./ProductCard";
import type { Game } from "./ProductCard";
import { SlidersHorizontal } from "lucide-react";

interface ProductGridProps {
  games: Game[];
  onAddToCart: (game: Game) => void;
  platform: string;
  onGoCatalog?: () => void;
  onViewDetails?: (game: Game) => void;
}

export function ProductGrid({ games, onAddToCart, platform, onGoCatalog, onViewDetails }: ProductGridProps) {
  const [sort, setSort] = useState("newest");

  const filtered = platform === "Todos" ? games : games.filter((g) => {
    if (platform === "PS5" || platform === "PlayStation") return g.platform === "PS5" || g.platform === "PS4";
    return g.platform === platform;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "discount") return (b.discount ?? 0) - (a.discount ?? 0);
    return a.id - b.id;
  });

  return (
    <section className="w-full py-8" style={{ backgroundColor: "#0d0e12" }}>
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                color: "#e8eaf0",
                fontWeight: 700,
                fontSize: "1.4rem",
                letterSpacing: "0.04em",
              }}
            >
              {platform === "Todos" ? "TODOS LOS JUEGOS" : `JUEGOS ${platform.toUpperCase()}`}
            </h2>
            <p style={{ color: "#7a7d99", fontSize: "0.8rem", fontFamily: "'Inter', sans-serif" }}>
              Mostrando {sorted.length} resultados
            </p>
          </div>

          <div className="flex items-center gap-2">

            {onGoCatalog && (
    <button
      onClick={onGoCatalog}
      className="px-4 py-2 rounded text-sm"
      style={{
        backgroundColor: "#6A3CE6",
        color: "#ffffff",
        fontFamily: "'Rajdhani', sans-serif",
        fontWeight: 700,
        transition: "all 0.2s ease",
      }}
    >
      VER CATÁLOGO COMPLETO
    </button>
  )}
            <SlidersHorizontal size={16} style={{ color: "#7a7d99" }} />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 rounded outline-none text-sm cursor-pointer"
              style={{
                backgroundColor: "#161720",
                color: "#e8eaf0",
                border: "1px solid rgba(255,255,255,0.1)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <option value="newest">Ordenar por los últimos</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="discount">Mayor descuento</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))" }}>
          {sorted.map((game) => (
            <ProductCard
  key={game.id}
  game={game}
  onAddToCart={onAddToCart}
  onViewDetails={onViewDetails}
/>
          ))}
        </div>

        {sorted.length === 0 && (
          <div
            className="text-center py-16"
            style={{ color: "#7a7d99", fontFamily: "'Inter', sans-serif" }}
          >
            No se encontraron juegos para esta categoría.
          </div>
        )}
      </div>
    </section>
  );
}
