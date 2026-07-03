import { X, Trash2, ShoppingBag } from "lucide-react";
import { theme } from "../../config/theme";
import type { CartItem } from "../../core/cart/cartTypes";


interface CartDrawerProps {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
}

export function CartDrawer({ open, items, onClose, onRemove, onCheckout }: CartDrawerProps) {
  const total = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const totalItems = items.reduce((acc, i) => acc + i.qty, 0);

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col transition-transform duration-300"
        style={{
          width: "360px",
          maxWidth: "100vw",
          backgroundColor: theme.colors.surface,
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} style={{ color: "#6A3CE6" }} />
            <span
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 700,
                fontSize: "1.1rem",
                color: theme.colors.text,
                letterSpacing: "0.04em",
              }}
            >
              CARRITO
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-xs"
              style={{
                backgroundColor: "#6A3CE6",
                color: "#ffffff",
                fontWeight: 700,
              }}
            >
              {totalItems}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-white/10 transition-colors"
            style={{ color: "#7a7d99" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-5 flex flex-col gap-4">
          {items.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center h-full gap-4"
              style={{ color: theme.colors.textSoft, fontFamily: "'Inter', sans-serif" }}
            >
              <div
  className="flex items-center justify-center rounded-full"
  style={{
    width: 82,
    height: 82,
    background: "rgba(106,60,230,0.12)",
    border: "1px solid rgba(106,60,230,0.35)",
  }}
>
  <ShoppingBag size={38} strokeWidth={1.5} style={{ color: "#6A3CE6" }} />
</div>

<p style={{ color: "#E8E9F0", fontWeight: 700 }}>
  Tu carrito está vacío
</p>

<span style={{ color: theme.colors.textSoft, fontSize: 13, textAlign: "center" }}>
  Agregá juegos desde la tienda para verlos acá.
</span>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 rounded p-3"
                style={{ backgroundColor: "#1e1f2e" }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-20 object-cover rounded"
                  style={{ backgroundColor: "#0d0e12" }}
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <span
                      className="inline-block px-1.5 py-0.5 rounded text-xs mb-1"
                      style={{
                        backgroundColor: item.categoryColor + "22",
                        color: item.categoryColor === "#003791" ? "#4a9eff" : item.categoryColor,
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.6rem",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {item.category}
                    </span>
                    <p
                      className="leading-tight"
                      style={{
                        color: theme.colors.text,
                        fontFamily: "'Rajdhani', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.88rem",
                      }}
                    >
                      {item.name}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span
                      style={{
                        color: "#C4A3FF",
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 800,
                        fontSize: "0.95rem",
                        textShadow: "0 0 10px rgba(166,107,255,0.55)",
                      }}
                    >
                      ${(item.price * item.qty).toLocaleString("es-AR")} ARS
                    </span>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="p-1 rounded hover:bg-red-500/10 transition-colors"
                      style={{ color: "#e8003d" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="p-5 flex flex-col gap-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center justify-between">
              <span
                style={{
                  color: "#a0a3b8",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.875rem",
                }}
              >

              
                Total
              </span>
              <span
                style={{
                  color: theme.colors.text,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                }}
              >
                ${total.toLocaleString("es-AR")} ARS
              </span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full py-3 rounded transition-all hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: "#6A3CE6",
                color: "#ffffff",
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                letterSpacing: "0.06em",
              }}
            >
              FINALIZAR COMPRA
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 rounded transition-colors hover:bg-white/5"
              style={{
                color: theme.colors.textSoft,
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.8rem",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
}
