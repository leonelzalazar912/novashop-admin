import { ShoppingCart, Heart } from "lucide-react";
import { theme } from "../../config/theme";
import type { Product } from "../../types/product";

interface ProductCardProps {
  game: Product;
  onAddToCart: (game: Product) => void;
  onViewDetails?: (game: Product) => void;
}

export function ProductCard({ game, onAddToCart, onViewDetails }: ProductCardProps) {
  const primaryImage = game.images.find((image) => image.isPrimary) ?? game.images[0];

  return (
    <div
  onClick={() => onViewDetails?.(game)}
  className="group relative flex flex-col rounded overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
      style={{
        backgroundColor: theme.colors.surface,
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Wishlist */}
      <button
  className="hidden"
  style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
  onClick={(e) => e.stopPropagation()}
>
  <Heart size={14} color="#e8eaf0" />
</button>

      {/* Category label */}
      {game.category && (
        <div
          className="absolute top-2 left-0 right-0 flex justify-center z-10 pointer-events-none"
        >
          <span
            className="px-2 py-0.5 rounded"
            style={{
              backgroundColor: "rgba(106,60,230,0.85)",
              color: "#fff",
              fontSize: "0.62rem",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              letterSpacing: "0.06em",
            }}
          >
            {game.category.name}
          </span>
        </div>
      )}

      {/* Image */}
<div
  className="relative overflow-hidden"
  style={{
    aspectRatio: "2 / 3",
    backgroundColor: "#1a1b25",
    width: "100%",
  }}
>
  <img
    src={primaryImage?.url ?? "/logo.png"}
    alt={primaryImage?.alt ?? game.name}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center top",
      display: "block",
      transition: "transform .3s ease",
    }}
    className="group-hover:scale-110"
  />
</div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-3 flex-1">
        <p
  style={{
    color:
      game.stock === 0
        ? "#ef4444"
        : game.stock <= 5
        ? "#facc15"
        : "#22c55e",
    fontSize: "0.75rem",
    margin: "0 0 6px 0",
    fontWeight: 600,
  }}
>
  {game.stock === 0
    ? "🔴 Sin stock"
    : game.stock <= 5
    ? "⚠️ Últimas unidades"
    : "🟢 En stock"}
</p>
        <h3
          className="leading-tight"
          style={{
            color: theme.colors.text,
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 600,
            fontSize: "0.92rem",
          }}
        >
          {game.name}
        </h3>

        <div className="flex items-center justify-between mt-auto pt-2">
          <span
            style={{
              color: theme.colors.text,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            Desde ${game.price.toLocaleString("es-AR")} {game.currency}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(game);
          }}
          className="mt-2 w-full flex items-center justify-center gap-2 py-2 rounded text-sm transition-all hover:opacity-90 active:scale-95"
          style={{
            backgroundColor: game.stock === 0 ? "#3a3a46" : "#6A3CE6",
            cursor: game.stock === 0 ? "not-allowed" : "pointer",
            opacity: game.stock === 0 ? 0.55 : 1,
            color: "#ffffff",
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 700,
            fontSize: "0.85rem",
            letterSpacing: "0.04em",
            transition: "all 0.2s ease",
          }}
        >
          <ShoppingCart size={14} strokeWidth={2.5} />
          {game.stock === 0 ? "SIN STOCK" : "AGREGAR"}
        </button>
      </div>
    </div>
  );
}
