import { ShoppingCart, Heart } from "lucide-react";

export interface Product {
  id: number;
  title: string;
  platform: string;
  platformColor: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  badge?: string;

  genre?: string;
  stock?: number;
  rating?: number;
  reviews?: number;
  description?: string;
  developer?: string;
  releaseYear?: number;
}

const platformLogos: Record<string, string> = {
  PS5: "PS5",
  PS4: "PS4",
  Xbox: "XBOX",
  Nintendo: "NSW",
  Sega: "SEGA",
};

interface ProductCardProps {
  game: Product;
  onAddToCart: (game: Product) => void;
  onViewDetails?: (game: Product) => void;
}

export function ProductCard({ game, onAddToCart, onViewDetails }: ProductCardProps) {
  return (
    <div
  onClick={() => onViewDetails?.(game)}
  className="group relative flex flex-col rounded overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
      style={{
        backgroundColor: "#161720",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Discount badge */}
      {game.discount && (
        <div
          className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded text-xs"
          style={{
            backgroundColor: "#e8003d",
            color: "#fff",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: "0.8rem",
          }}
        >
          -{game.discount}%
        </div>
      )}

      {/* Wishlist */}
      <button
  className="hidden"
  style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
  onClick={(e) => e.stopPropagation()}
>
  <Heart size={14} color="#e8eaf0" />
</button>

      {/* Platform label */}
      <div
        className="absolute top-2 left-0 right-0 flex justify-center z-10 pointer-events-none"
        style={{ marginTop: game.discount ? "0" : "0" }}
      >
        <span
          className="px-2 py-0.5 rounded"
          style={{
            backgroundColor: game.platformColor,
            color: "#fff",
            fontSize: "0.62rem",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            letterSpacing: "0.06em",
            marginLeft: game.discount ? "60px" : "0",
          }}
        >
          {platformLogos[game.platform] ?? game.platform}
        </span>
      </div>

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
    src={game.image}
    alt={game.title}
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
        <span
          className="text-xs uppercase"
          style={{
            color: "#7a7d99",
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "0.05em",
            fontSize: "0.65rem",
          }}
        >
          {game.genre ?? "Acción"}
        </span>
        
<p
  style={{
    color:
      (game.stock ?? 0) === 0
        ? "#ef4444"
        : (game.stock ?? 0) <= 5
        ? "#facc15"
        : "#22c55e",
    fontSize: "0.75rem",
    margin: "0 0 6px 0",
    fontWeight: 600,
  }}
>
  {(game.stock ?? 0) === 0
    ? "🔴 Sin stock"
    : (game.stock ?? 0) <= 5
    ? "⚠️ Últimas unidades"
    : "🟢 En stock"}
</p>
        <h3
          className="leading-tight"
          style={{
            color: "#e8eaf0",
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 600,
            fontSize: "0.92rem",
          }}
        >
          {game.title}
        </h3>

        <div className="flex items-center gap-2 mt-auto pt-2">
          {game.originalPrice && (
            <span
              style={{
                color: "#7a7d99",
                textDecoration: "line-through",
                fontSize: "0.72rem",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              ${game.originalPrice.toLocaleString("es-AR")} ARS
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-1">
          <span
            style={{
              color: "#e8eaf0",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            Desde ${game.price.toLocaleString("es-AR")} ARS
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(game);
          }}
          className="mt-2 w-full flex items-center justify-center gap-2 py-2 rounded text-sm transition-all hover:opacity-90 active:scale-95"
          style={{
            backgroundColor: (game.stock ?? 0) === 0 ? "#3a3a46" : "#6A3CE6",
            cursor: (game.stock ?? 0) === 0 ? "not-allowed" : "pointer",
            opacity: (game.stock ?? 0) === 0 ? 0.55 : 1,
            color: "#ffffff",
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 700,
            fontSize: "0.85rem",
            letterSpacing: "0.04em",
            transition: "all 0.2s ease",
          }}
        >
          <ShoppingCart size={14} strokeWidth={2.5} />
          {(game.stock ?? 0) === 0 ? "SIN STOCK" : "AGREGAR"}
        </button>
      </div>
    </div>
  );
}
