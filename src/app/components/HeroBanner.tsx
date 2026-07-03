import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { theme } from "../../config/theme";

const slides = [
  {
  id: 1,
  tag: "JUEGOS PLAYSTATION",
  title: "Los mejores títulos de PlayStation",
  subtitle: "Explorá juegos para PS4 y PS5 en un solo lugar.",
  cta: "VER TODOS LOS JUEGOS",
  discount: "",
  bg: "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=1400&h=480&fit=crop&auto=format",
  accent: "#0070D1",
  category: "PlayStation",
  categoryColor: "#003791",
},
  {
  id: 2,
  tag: "JUEGOS XBOX",
  title: "Los mejores títulos de Xbox",
  subtitle: "Descubrí juegos para Xbox One y Xbox Series X/S.",
  cta: "VER TODOS LOS JUEGOS",
  discount: "",
  bg: "https://images.unsplash.com/photo-1626218174358-7769486c4b79?w=1400&h=480&fit=crop&auto=format",
  accent: "#107c10",
  category: "Xbox",
  categoryColor: "#107c10",
},
 {
  id: 3,
  tag: "JUEGOS NINTENDO",
  title: "Los mejores títulos de Nintendo",
  subtitle: "Encontrá juegos para Nintendo Switch en un solo lugar.",
  cta: "VER TODOS LOS JUEGOS",
  discount: "",
  bg: "https://images.unsplash.com/photo-1614179924047-e1ab49a0a0cf?w=1400&h=480&fit=crop&auto=format",
  accent: "#e4000f",
  category: "Nintendo",
  categoryColor: "#e4000f",
},
];

interface HeroBannerProps {
  onGoCatalog: () => void;
}

export function HeroBanner({ onGoCatalog }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  const slide = slides[current];

  return (
    <div className="w-full relative overflow-hidden" style={{ height: "420px" }}>
      {/* Background */}
      <div className="absolute inset-0 transition-all duration-700">
        <img
          src={slide.bg}
          alt={slide.title}
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.35) saturate(1.2)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(105deg, rgba(13,14,18,0.98) 0%, rgba(13,14,18,0.7) 50%, transparent 100%)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto max-w-7xl px-6 md:px-10 flex items-center justify-between gap-6">
          <div className="max-w-xl">
            {/* Platform badge */}
            <span
              className="inline-block px-3 py-1 rounded text-xs mb-3"
              style={{
                backgroundColor: slide.categoryColor + "22",
                color: slide.categoryColor === "#003791" ? "#4a9eff" : slide.categoryColor,
                border: `1px solid ${slide.categoryColor}44`,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                letterSpacing: "0.1em",
              }}
            >
              {slide.tag}
            </span>

            <h1
              className="mb-3"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
              }}
            >
              {slide.title}
            </h1>
            <p
              className="mb-6"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "#a0a3b8",
                fontSize: "1rem",
                lineHeight: 1.6,
              }}
            >
              {slide.subtitle}
            </p>

            <div className="hidden">
              <button
                onClick={onGoCatalog}
                className="px-6 py-3 rounded transition-all hover:opacity-90 active:scale-95"
                style={{
                  backgroundColor: slide.accent,
                  color: "#0d0e12",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  letterSpacing: "0.06em",
                }}
              >
                {slide.cta}
              </button>

              <span
                className="px-4 py-3 rounded"
                style={{
                  backgroundColor: "#e8003d",
                  color: "#ffffff",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  letterSpacing: "0.04em",
                }}
              >
                {slide.discount}
              </span>
            </div>

            <div style={{ marginTop: "20px" }}>
  <button
    onClick={onGoCatalog}
    className="px-6 py-3 rounded transition-all hover:opacity-90 active:scale-95"
  style={{
  backgroundColor: slide.accent,
  color: "#0d0e12",
  border: `2px solid ${slide.accent}`,
  fontFamily: "'Rajdhani', sans-serif",
  fontWeight: 700,
  fontSize: "1.05rem",
  letterSpacing: "0.08em",
  padding: "16px 36px",
  boxShadow: `0 6px 20px ${slide.accent}55`,
}}
  >
    VER TODOS LOS JUEGOS
  </button>
</div>

            
          </div>

          {/* Right decorative panel — mini promo cards */}
          <div className="hidden lg:flex flex-col gap-3 shrink-0">
            {[
              { label: "Playstation", badge: "-40%", color: "#003791" },
              { label: "Xbox", badge: "NUEVO", color: "#107c10" },
              { label: "Nintendo Switch", badge: "-25%", color: "#e4000f" },
              { label: "Sega Classics", badge: "RETRO", color: "#ff6b00" },
            ].map((p) => (
              <div
                key={p.label}
                className="flex items-center gap-3 px-4 py-2.5 rounded cursor-pointer transition-colors hover:brightness-110"
                style={{
                  backgroundColor: theme.colors.surface,
                  border: "1px solid rgba(255,255,255,0.07)",
                  width: "200px",
                }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: p.color }}
                />
                <span
                  style={{
                    color: "#c8cbdf",
                    fontSize: "0.82rem",
                    fontFamily: "'Inter', sans-serif",
                    flex: 1,
                  }}
                >
                  {p.label}
                </span>
                
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
        style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "#e8eaf0" }}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
        style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "#e8eaf0" }}
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="rounded-full transition-all"
            style={{
              width: i === current ? "24px" : "8px",
              height: "8px",
              backgroundColor: i === current ? "#6A3CE6" : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
