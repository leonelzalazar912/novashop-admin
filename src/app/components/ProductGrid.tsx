import { useState } from "react";
import { ProductCard } from "./ProductCard";
import type { Product } from "../../types/product";
import { theme } from "../../config/theme";

interface ProductGridProps {
  games: Product[];
  onAddToCart: (game: Product) => void;
  category: string;
  onGoCatalog?: () => void;
  onViewDetails?: (game: Product) => void;
}

export function ProductGrid({ games, onAddToCart, category, onGoCatalog, onViewDetails }: ProductGridProps) {

  const filtered =
  category === "Todos"
    ? games
    : games.filter((g) => g.category === category);

  const sorted = [...filtered].sort((a, b) => a.id - b.id);

  return (
    <section className="w-full py-8" style={{ backgroundColor: "#0d0e12" }}>
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                color: theme.colors.text,
                fontWeight: 700,
                fontSize: "1.4rem",
                letterSpacing: "0.04em",
              }}
            >
              {category === "Todos" ? "TODOS LOS JUEGOS" : `JUEGOS ${category.toUpperCase()}`}
            </h2>
            <p style={{ color: theme.colors.textSoft, fontSize: "0.8rem", fontFamily: "'Inter', sans-serif" }}>
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
            style={{ color: theme.colors.textSoft, fontFamily: "'Inter', sans-serif" }}
          >
            No se encontraron juegos para esta categoría.
          </div>
        )}
      </div>
    </section>
  );
}
