import { theme } from "../../config/theme";

interface ConsoleCategoryProps {
  onFilter: (platform: string) => void;
  activePlatform: string;
}

const consoles = [
  {
    name: "Todos",
    color: "#00c8d7",
    bg: "#00c8d714",
    icon: "🎮",
  },
  {
    name: "PlayStation",
    color: "#4a9eff",
    bg: "#003791",
    icon: "🟦",
    logo: "PS",
    description: "PS4 / PS5",
  },
  {
    name: "Xbox",
    color: "#5cd65c",
    bg: "#107c10",
    icon: "🟩",
    logo: "XB",
    description: "Series X / One",
  },
  {
    name: "Nintendo",
    color: "#ff6b6b",
    bg: "#e4000f",
    icon: "🔴",
    logo: "N",
    description: "Switch / Lite",
  },
  {
    name: "Sega",
    color: "#6699ff",
    bg: "#1e4eea",
    icon: "🔵",
    logo: "S",
    description: "Genesis / Dreamcast",
  },
];

export function ConsoleCategories({ onFilter, activePlatform }: ConsoleCategoryProps) {
  return (
    <section className="w-full py-12" style={{ backgroundColor: "#0d0e12" }}>
      <div className="container mx-auto max-w-7xl px-4">
        <h2
          className="mb-6"
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            color: theme.colors.text,
            fontWeight: 700,
            fontSize: "1.8rem",
            letterSpacing: "0.04em",
          }}
        >
          CATEGORÍAS POR CONSOLA
        </h2>

        <div className="flex flex-wrap gap-3">
          {consoles.map((c) => {
            const isActive = activePlatform === c.name;

            return (
              <button
                key={c.name}
                onClick={() =>
  onFilter(
    c.name === "Todos"
      ? "Todos"
      : c.name
  )
}
                className="flex items-center gap-3 px-6 py-4 rounded transition-all hover:scale-105 active:scale-95"
                style={{
                  backgroundColor:
  isActive ? c.bg : "#161720",
                  border: `1px solid ${isActive ? c.color : "rgba(255,255,255,0.08)"}`,
                  color: isActive ? "#ffffff" : "#a0a3b8",
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{c.icon}</span>
                <div className="text-left">
                  <div
                    style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontWeight: 700,
                      fontSize: "1.05rem",
                      color: isActive ? "#fff" : "#e8eaf0",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {c.name}
                  </div>
                  {c.description && (
                    <div
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.65rem",
                        color: isActive ? "rgba(255,255,255,0.8)" : "#7a7d99",
                      }}
                    >
                      {c.description}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
