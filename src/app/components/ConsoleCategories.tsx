import { theme } from "../../config/theme";
import type { ProductCategory } from "../../types/product";

interface ConsoleCategoryProps {
  categories: ProductCategory[];
  onFilter: (category: string) => void;
  activeCategory: string;
}

export function ConsoleCategories({ categories, onFilter, activeCategory }: ConsoleCategoryProps) {
  const options = ["Todos", ...categories.map((category) => category.name)];

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
          CATEGORÍAS
        </h2>

        <div className="flex flex-wrap gap-3">
          {options.map((name) => {
            const isActive = activeCategory === name;

            return (
              <button
                key={name}
                onClick={() => onFilter(name)}
                className="flex items-center gap-3 px-6 py-4 rounded transition-all hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: isActive ? "#6A3CE6" : "#161720",
                  border: `1px solid ${isActive ? "#8F6BFF" : "rgba(255,255,255,0.08)"}`,
                  color: isActive ? "#ffffff" : "#a0a3b8",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    color: isActive ? "#fff" : "#e8eaf0",
                    letterSpacing: "0.04em",
                  }}
                >
                  {name}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
