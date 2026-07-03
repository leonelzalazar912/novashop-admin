import { Truck, Shield, RefreshCw, Headphones } from "lucide-react";
import { theme } from "../../config/theme";

interface OffersStripProps {
  onClaimsClick: () => void;
}

export function OffersStrip({ onClaimsClick }: OffersStripProps) {
  const perks = [
    { icon: <Truck size={18} />, title: "Envío a todo el país", sub: "En compras desde $15.000", isClaim: false },
    { icon: <Shield size={18} />, title: "Pago 100% seguro", sub: "SSL certificado", isClaim: false },
    { icon: <RefreshCw size={18} />, title: "Cambios y devoluciones", sub: "Hasta 30 días", isClaim: false },
    { icon: <Headphones size={18} />, title: "Centro de Reclamos", sub: "➡ Atención 24/7", isClaim: true },
  ];

  return (
    <div className="w-full py-4" style={{ backgroundColor: theme.colors.surface, borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {perks.map((p) => (
            <div
              key={p.title}
              onClick={p.isClaim ? onClaimsClick : undefined}
              className="flex items-center gap-3"
              style={{
                cursor: p.isClaim ? "pointer" : "default",
                padding: "12px",
                borderRadius: "12px",
                transition: "all .25s ease",
                border: p.isClaim ? "1px solid rgba(106,60,230,0.35)" : "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (p.isClaim) {
                  e.currentTarget.style.background = "rgba(106,60,230,0.12)";
                  e.currentTarget.style.borderColor = "#8F6BFF";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (p.isClaim) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(106,60,230,0.35)";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              <div style={{ color: "#8F6BFF" }}>{p.icon}</div>
              <div>
                <div style={{ color: theme.colors.text, fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.85rem" }}>
                  {p.title}
                </div>
                <div style={{ color: theme.colors.textSoft, fontFamily: "'Inter', sans-serif", fontSize: "0.7rem" }}>
                  {p.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
