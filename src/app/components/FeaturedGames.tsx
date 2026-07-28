import { Star, ShoppingCart } from "lucide-react";
import type { Product } from "../../types/product";
import { theme } from "../../config/theme";

interface FeaturedGamesProps {
  games: Product[];
  onAddToCart: (game: Product) => void;
}

export function FeaturedGames({ games, onAddToCart }: FeaturedGamesProps) {
  return (
    <section className="w-full py-10" style={{ backgroundColor: "#0f1018" }}>
      <div className="container mx-auto max-w-7xl px-4">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Star size={20} fill="#fbbf24" color="#fbbf24" />
            <h2
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                color: theme.colors.text,
                fontWeight: 700,
                fontSize: "1.4rem",
                letterSpacing: "0.04em",
              }}
            >
              JUEGOS DESTACADOS
            </h2>
          </div>
          <a
            href="#"
            style={{
              color: "#00c8d7",
              fontSize: "0.82rem",
              fontFamily: "'Inter', sans-serif",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            ver todos →
          </a>
        </div>

        {/* Featured list — wide horizontal cards */}
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {games.map((game) => (
            <div
              key={game.id}
              className="flex gap-3 rounded overflow-hidden transition-colors hover:brightness-110 cursor-pointer"
              style={{
                backgroundColor: theme.colors.surface,
                border: "1px solid rgba(255,255,255,0.07)",
                padding: "12px",
              }}
            >
              {/* Thumbnail */}
              <div
                className="shrink-0 rounded overflow-hidden"
                style={{ width: "80px", height: "106px", backgroundColor: "#1a1b25" }}
              >
                <img
                  src={(game.images.find((image) => image.isPrimary) ?? game.images[0])?.url ?? "/logo.png"}
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col justify-between flex-1 min-w-0">
                <div>
                  {/* Category badge */}
                  {game.category && (
                    <span
                      className="inline-block px-2 py-0.5 rounded text-xs mb-1"
                      style={{
                        backgroundColor: "rgba(106,60,230,0.18)",
                        color: "#00c8d7",
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.65rem",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {game.category.name.toUpperCase()}
                    </span>
                  )}
                  <h3
                    className="leading-tight truncate"
                    style={{
                      color: theme.colors.text,
                      fontFamily: "'Rajdhani', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    }}
                  >
                    {game.name}
                  </h3>
                </div>

                <div className="flex items-end justify-between mt-2">
                  <div
                    style={{
                      color: theme.colors.text,
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                    }}
                  >
                    ${game.price.toLocaleString("es-AR")} {game.currency}
                  </div>

                  <button
                    onClick={() => {
                      if (game.stock <= 0) return;
                        onAddToCart(game);
                        }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded transition-all hover:opacity-90 active:scale-95"
                    style={{
                      backgroundColor: "#00c8d7",
                      color: "#0d0e12",
                      fontFamily: "'Rajdhani', sans-serif",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      letterSpacing: "0.04em",
                    }}
                  >
                    <ShoppingCart size={12} strokeWidth={2.5} />
                    AGREGAR
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
