import { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import type { Product } from "../../types/product";
import { theme } from "../../config/theme";

interface CatalogScreenProps {
  games: Product[];
  initialSearch: string;
  onAddToCart: (game: Product) => void;
  onBack: () => void;
  initialSelectedGame?: Product | null;
}

export function CatalogScreen({
  games,
  initialSearch,
  onAddToCart,
  onBack,
  initialSelectedGame,
}: CatalogScreenProps) {
  const [selectedPlatform, setSelectedPlatform] = useState("Todos");
  const [selectedGenre, setSelectedGenre] = useState("Todos");
  const [selectedEra, setSelectedEra] = useState("");
  const [onlyStock, setOnlyStock] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [search, setSearch] = useState(initialSearch);
  useEffect(() => {
  setSearch(initialSearch);
}, [initialSearch]);

  const [selectedGame, setSelectedGame] = useState<Product | null>(null);
  useEffect(() => {
  if (initialSelectedGame) {
    setSelectedGame(initialSelectedGame);
  }
}, [initialSelectedGame]);
  const [activeTab, setActiveTab] = useState("description");
  const clearFilters = () => {  
  setSearch("");
  setSelectedPlatform("Todos");
  setSelectedGenre("Todos");
  setSelectedEra("");
  setOnlyStock(false);
  setSortBy("default");
};

  if (selectedGame) {
  return (
    <div style={{ background: "#0d0e12", minHeight: "100vh", color: "#fff", padding: "32px" }}>
  <button
    onClick={() => setSelectedGame(null)}
    style={{
      marginBottom: "24px",
      padding: "8px 12px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      background: "#161720",
      color: theme.colors.text,
    }}
  >
    ← Volver al catálogo
  </button>

  <div
  style={{
    display: "grid",
    gridTemplateColumns: "520px 1fr",
    gap: "44px",
    alignItems: "start",
  }}
>
    <div style={{ position: "relative" }}>
    <img
      src={selectedGame.image}
      alt={selectedGame.name}
      style={{
        width: "100%",
        height: "520px",
        objectFit: "contain",
        backgroundColor: theme.colors.surface,
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    />
    <span
    style={{
        position: "absolute",
        bottom: "16px",
        left: "16px",
        background: "#123f8c",
        color: "#fff",
        padding: "6px 10px",
        borderRadius: "6px",
        fontSize: "0.8rem",
        fontWeight: 600,
  }}
>
  {selectedGame.category}
</span>
</div>

    <div>
      <h1
  style={{
    marginBottom: "16px",
    fontSize: "3rem",
    fontWeight: 700,
  }}
>
  {selectedGame.name}
</h1>


      <p style={{ color: theme.colors.textSoft, marginBottom: "20px" }}>
        {selectedGame.genre} · {selectedGame.category} · {selectedGame.releaseYear}
      </p>

      <div
  style={{
    marginBottom: "20px",
    padding: "22px",
    borderRadius: "14px",
    background: "#111827",
    border: "1px solid rgba(0, 200, 215, 0.35)",
  }}
>
  {selectedGame.originalPrice && (
    <p
      style={{
        color: theme.colors.textSoft,
        textDecoration: "line-through",
        marginBottom: "6px",
      }}
    >
      ${selectedGame.originalPrice.toLocaleString("es-AR")} ARS
    </p>
  )}

  <p
    style={{
      fontSize: "2.4rem",
      fontWeight: "bold",
      margin: 0,
      color: "#00f5d4",
    }}
  >
    ${selectedGame.price.toLocaleString("es-AR")} ARS
  </p>

  {selectedGame.discount && (
    <p style={{ color: "#6A3CE6", fontWeight: "bold", marginTop: "8px" }}>
      {selectedGame.discount}% OFF
    </p>
  )}
</div>

      <div
  style={{
    marginBottom: "16px",
    padding: "12px 14px",
    borderRadius: "10px",
    background: (selectedGame.stock ?? 0) > 0 ? "#003f35" : "#3a1111",
    color: (selectedGame.stock ?? 0) > 0 ? "#00ffd0" : "#ff6b6b",
    fontWeight: 600,
    border: "1px solid rgba(0, 255, 208, 0.25)",
  }}
>
  {(selectedGame.stock ?? 0) > 0
    ? `🟢 ${selectedGame.stock} unidades en stock`
    : "🔴 Sin stock"}
</div>

<div style={{ marginTop: "24px", marginBottom: "20px" }}>
  <div
  style={{
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
    background: "#161720",
    padding: "8px",
    borderRadius: "14px",
    border: "1px solid rgba(106,60,230,0.25)",
    width: "fit-content",
  }}
>
  <button
    onClick={() => setActiveTab("description")}
    style={{
      padding: "10px 16px",
      borderRadius: "10px",
      border: "none",
      background: activeTab === "description" ? "#6A3CE6" : "transparent",
      color: activeTab === "description" ? "#ffffff" : "#9da0b8",
      fontWeight: 700,
      cursor: "pointer",
    }}
  >
    Descripción
  </button>

  <button
    onClick={() => setActiveTab("specs")}
    style={{
      padding: "10px 16px",
      borderRadius: "10px",
      border: "none",
      background: activeTab === "specs" ? "#6A3CE6" : "transparent",
      color: activeTab === "specs" ? "#ffffff" : "#9da0b8",
      fontWeight: 700,
      cursor: "pointer",
    }}
  >
    Especificaciones
  </button>
</div>

  {activeTab === "description" && (
    <p style={{ lineHeight: 1.6 }}>{selectedGame.description}</p>
  )}

  {activeTab === "specs" && (
  <div
    style={{
      background: "#161720",
      border: "1px solid rgba(106,60,230,0.25)",
      borderRadius: "14px",
      overflow: "hidden",
      maxWidth: "520px",
    }}
  >
    {[
      ["Desarrollador", selectedGame.developer],
      ["Plataforma", selectedGame.category],
      ["Género", selectedGame.genre],
      ["Año", selectedGame.releaseYear],
    ].map(([label, value]) => (
      <div
        key={label}
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
          padding: "14px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <span style={{ color: "#9da0b8", fontWeight: 600 }}>
          {label}
        </span>
        <span style={{ color: "#E8E9F0", fontWeight: 700 }}>
          {value}
        </span>
      </div>
    ))}
  </div>
)}

  
</div>

      <button
        disabled={(selectedGame.stock ?? 0) <= 0}
        onClick={() => onAddToCart(selectedGame)}
        style={{
          marginTop: "24px",
          padding: "12px 18px",
          border: "none",
          borderRadius: "10px",
          background: (selectedGame.stock ?? 0) <= 0 ? "#555" : "#6A3CE6",
          color: "#0d0e12",
          fontWeight: "bold",
          cursor: (selectedGame.stock ?? 0) <= 0 ? "not-allowed" : "pointer",
        }}
      >
        {(selectedGame.stock ?? 0) <= 0 ? "Sin stock" : "Agregar al carrito"}
      </button>
      <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
    marginTop: "22px",
  }}
>
  <div
    style={{
      padding: "18px 14px",
      borderRadius: "12px",
      background: "#111827",
      border: "1px solid rgba(0, 200, 215, 0.25)",
      textAlign: "center",
      color: "#8b90aa",
      fontSize: "0.85rem",
    }}
  >
    🚚
    <div style={{ marginTop: "8px" }}>Envío 24h</div>
  </div>

  <div
    style={{
      padding: "18px 14px",
      borderRadius: "12px",
      background: "#111827",
      border: "1px solid rgba(0, 200, 215, 0.25)",
      textAlign: "center",
      color: "#8b90aa",
      fontSize: "0.85rem",
    }}
  >
    🔄
    <div style={{ marginTop: "8px" }}>30 días devolución</div>
  </div>

  <div
    style={{
      padding: "18px 14px",
      borderRadius: "12px",
      background: "#111827",
      border: "1px solid rgba(0, 200, 215, 0.25)",
      textAlign: "center",
      color: "#8b90aa",
      fontSize: "0.85rem",
    }}
  >
    🛡️
    <div style={{ marginTop: "8px" }}>Garantía oficial</div>
  </div>
</div>
    </div>
  </div>
</div>
  );
}

const platforms = ["Todos", ...Array.from(new Set(games.map((game) => game.category)))];
const genres = ["Todos", ...Array.from(new Set(games.map((game) => game.genre ?? "Acción")))];
const eras = ["Retro", "Actuales"];

const filteredGames = games
  .filter((game) => {
    if (search && !game.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedPlatform !== "Todos" && game.category !== selectedPlatform) return false;
    if (selectedGenre !== "Todos" && (game.genre ?? "Acción") !== selectedGenre) return false;
    if (selectedEra === "Retro" && (game.releaseYear ?? 9999) > 2013) return false;
    if (selectedEra === "Actuales" && (game.releaseYear ?? 0) <= 2013) return false;
    if (onlyStock && (game.stock ?? 0) <= 0) return false;
    return true;
  })
  .sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "discount") return (b.discount ?? 0) - (a.discount ?? 0);
    return 0;
  });
    return (
    <div style={{ background: "#0d0e12", minHeight: "calc(100vh - 120px)", color: "#fff", padding: "12px 24px 24px 24px" }}>
      <button
  onClick={onBack}
  className="flex items-center gap-2 px-5 py-3 rounded-lg transition-all duration-200 hover:scale-105"
  style={{
    background: "#161720",
    color: theme.colors.text,
    border: "1px solid rgba(106,60,230,0.35)",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 600,
    marginBottom: "18px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
  }}
>
  ← Volver
</button>

      <div style={{ marginBottom: 28 }}>
  <h1
    style={{
      fontFamily: "'Rajdhani', sans-serif",
      color: "#E8E9F0",
      fontSize: "2rem",
      fontWeight: 700,
      letterSpacing: "0.05em",
      marginBottom: 8,
    }}
  >
    🎮 CATÁLOGO DE JUEGOS
  </h1>

  <p
    style={{
      color: "#B0B3C6",
      fontSize: 15,
      marginBottom: 14,
      maxWidth: 520,
    }}
  >
    Explorá todos los títulos disponibles y encontrá tu próximo juego favorito.
  </p>

  <span
    style={{
      display: "inline-block",
      backgroundColor: "rgba(106, 60, 230, 0.15)",
      color: "#B0B3C6",
      border: "1px solid rgba(106, 60, 230, 0.45)",
      padding: "8px 14px",
      borderRadius: 999,
      fontSize: 13,
      fontWeight: 600,
    }}
  >
    {filteredGames.length} juegos disponibles
  </span>
</div>
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "24px", alignItems: "start" }}>
        <aside
  style={{
    position: "sticky",
    top: "90px",
    maxHeight: "calc(100vh - 110px)",
    overflowY: "auto",
    background: "linear-gradient(180deg, #11131d 0%, #0d0e12 100%)",
    border: "1px solid rgba(106,60,230,0.35)",
    borderRadius: "18px",
    padding: "16px",
    boxShadow: "0 12px 35px rgba(0,0,0,0.45)",
  }}
>
  <h3 style={{ color: "#6A3CE6", fontSize: "0.9rem", letterSpacing: "0.08em", marginBottom: "14px" }}>
    FILTROS
  </h3>
<div style={{ display: "none" }}>
  <input
    type="text"
    placeholder="Buscar juego..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      padding: "12px",
      borderRadius: "10px",
      background: "#161720",
      color: theme.colors.text,
      border: "1px solid rgba(255,255,255,0.08)",
      marginBottom: "20px",
      width: "100%",
    }}
  />
  </div>

  <p style={{ color: theme.colors.textSoft, fontSize: "0.75rem", fontWeight: 700 }}>PLATAFORMA</p>
  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
    {platforms.map((platform) => (
      <button
        key={platform}
        onClick={() => setSelectedPlatform(platform)}
        style={{
          padding: "7px 10px",
borderRadius: "999px",
fontSize: "0.78rem",
fontWeight: 700,
          border: "1px solid rgba(255,255,255,0.08)",
          cursor: "pointer",
          background: selectedPlatform === platform ? "#6A3CE6" : "#161720",
          color: selectedPlatform === platform ? "#ffffff" : "#e8eaf0",
          
        }}
      >
        {platform}
      </button>
    ))}
  </div>

  <p style={{ color: theme.colors.textSoft, fontSize: "0.75rem", fontWeight: 700 }}>GÉNERO</p>
  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
    {genres.map((genre) => (
      <button
        key={genre}
        onClick={() => setSelectedGenre(genre)}
        style={{
          padding: "7px 10px",
borderRadius: "999px",
fontSize: "0.78rem",
fontWeight: 700,
          border: "1px solid rgba(255,255,255,0.08)",
          cursor: "pointer",
          background: selectedGenre === genre ? "#7b2fff" : "#161720",
          color: "#fff",
          
        }}
      >
        {genre}
      </button>
    ))}
  </div>

  <p style={{ color: theme.colors.textSoft, fontSize: "0.75rem", fontWeight: 700 }}>ÉPOCA</p>
  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
    {eras.map((era) => (
      <button
        key={era}
        onClick={() => setSelectedEra(era)}
        style={{
          padding: "7px 10px",
borderRadius: "999px",
fontSize: "0.78rem",
fontWeight: 700,
          border: "1px solid rgba(255,255,255,0.08)",
          cursor: "pointer",
          background: selectedEra === era ? "#ff8c00" : "#161720",
          color: "#fff",
          
        }}
      >
        {era}
      </button>
    ))}
  </div>


  <button
    onClick={() => setOnlyStock(!onlyStock)}
    style={{
      width: "100%",
      padding: "11px 12px",
      borderRadius: "10px",
      border: "1px solid rgba(255,255,255,0.08)",
      cursor: "pointer",
      background: onlyStock ? "#6A3CE6" : "#161720",
      color: onlyStock ? "#0d0e12" : "#e8eaf0",
      fontWeight: 700,
      marginBottom: "14px",
    }}
  >
    {onlyStock ? "✓ Solo en stock" : "Solo en stock"}
  </button>

  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    style={{
      width: "100%",
      padding: "11px 12px",
      borderRadius: "10px",
      background: "#161720",
      color: theme.colors.text,
      border: "1px solid rgba(255,255,255,0.08)",
      marginBottom: "14px",
    }}
  >
    <option value="default">Ordenar</option>
    <option value="price-asc">Precio: menor a mayor</option>
    <option value="price-desc">Precio: mayor a menor</option>
    <option value="discount">Mayor descuento</option>
  </select>

  <button
    onClick={clearFilters}
    style={{
      width: "100%",
      padding: "11px 12px",
      borderRadius: "10px",
      border: "none",
      cursor: "pointer",
      background: "#a02020",
      color: "#fff",
      fontWeight: 700,
    }}
  >
    Limpiar filtros
  </button>
</aside>
<div>
      <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
    gap: "16px",
    marginTop: "20px",
  }}
>
  {filteredGames.map((game) => (
    <ProductCard
      key={game.id}
      game={game}
      onAddToCart={onAddToCart}
      onViewDetails={setSelectedGame}
    />
  ))}
</div>
    </div>
    </div>
    </div>
  );
}