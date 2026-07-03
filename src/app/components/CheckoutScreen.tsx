import { theme } from "../../config/theme";
import type { CartItem } from "../../core/cart/cartTypes";


interface CheckoutScreenProps {
  items: CartItem[];  
  onBack: () => void;
  onContinue: () => void;
  onRemoveItem: (id: number) => void;
  onIncreaseItem: (id: number) => void;
  onDecreaseItem: (id: number) => void;
}


export function CheckoutScreen({
  items,
  onBack,
  onContinue,
  onRemoveItem,
  onIncreaseItem,
  onDecreaseItem,
}: CheckoutScreenProps) {
  const total = items.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div
      style={{
        background: `
          radial-gradient(circle at 0% 0%, rgba(120,60,255,0.50) 0%, transparent 35%),
          radial-gradient(circle at 45% -10%, rgba(106,60,230,0.22) 0%, transparent 32%),
          radial-gradient(circle at 100% 0%, rgba(90,40,220,0.12) 0%, transparent 28%),
          linear-gradient(180deg, #12091F 0%, #090A0F 55%, #07080C 100%)
`,
        minHeight: "100vh",
        color: "#fff",
        padding: "32px 24px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
    <button
  onClick={onBack}
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(24,24,34,0.88)",
    backdropFilter: "blur(12px)",
    color: theme.colors.text,
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "12px 18px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "0.95rem",
    marginBottom: "30px",
    transition: "all 0.2s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#222433";
    e.currentTarget.style.borderColor = "#6A3CE6";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "#161720";
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
  }}
>
  ← Volver a la tienda
</button>

<div style={{ display: "flex", gap: 10, marginBottom: 34 }}>
  <span style={{ color: "#fff", fontWeight: 800 }}>1 CARRITO</span>
  <span style={{ color: "#6A3CE6" }}>›</span>
  <span style={{ color: "#777A90" }}>2 ENTREGA</span>
  <span style={{ color: "#6A3CE6" }}>›</span>
  <span style={{ color: "#777A90" }}>3 DETALLES DEL PAGO</span>
  <span style={{ color: "#6A3CE6" }}>›</span>
  <span style={{ color: "#777A90" }}>4 PEDIDO COMPLETADO</span>
</div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: 28,
            alignItems: "start",
          }}
        >
          <section
  style={{
    background: "rgba(24,24,34,0.88)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(128,86,255,0.35)",
    borderRadius: 18,
    padding: 22,
    boxShadow: "0 18px 50px rgba(0,0,0,0.35), 0 0 35px rgba(106,60,230,0.18)",
  }}
>
            <h1 style={{ fontSize: "1.8rem", marginBottom: 22 }}>
              Carrito de compras
            </h1>

            {items.map((item) => (
<div
  key={item.id}
  style={{
    display: "grid",
    gridTemplateColumns: "90px 1fr auto",
    gap: 20,
    padding: "20px",
    marginBottom: "14px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(128,86,255,0.08)",
    boxShadow: "0 0 20px rgba(106,60,230,0.06)",
    alignItems: "center",
    transition: "all .25s ease",
  }}
>
    <img
  src={item.image}
  alt={item.name}
  style={{
    width: 90,
    height: 120,
    objectFit: "cover",
    borderRadius: 14,
    border: "1px solid rgba(128,86,255,0.25)",
    boxShadow: "0 0 20px rgba(106,60,230,0.18)",
  }}
/>

    <div
  style={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  }}
>
  <div>
    <h3
      style={{
        color: "#E8E9F0",
        fontSize: "1.15rem",
        fontWeight: 700,
        marginBottom: 8,
      }}
    >
      {item.name}
    </h3>

    <p
      style={{
        color: "#8F92A8",
        fontSize: 14,
      }}
    >
      {item.category}
    </p>
  </div>

  <button
    onClick={() => onRemoveItem(item.id)}
    style={{
      alignSelf: "flex-start",
      background: "transparent",
      border: "1px solid rgba(106,60,230,0.45)",
      color: "#8F6BFF",
      borderRadius: "10px",
      padding: "8px 14px",
      cursor: "pointer",
      fontWeight: 700,
      marginTop: "18px",
    }}
  >
    🗑 Eliminar
  </button>
</div>

    <div
  style={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: "100%",
  }}
>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "10px",
      marginBottom: "12px",
    }}
  >
    <button
      onClick={() => onDecreaseItem(item.id)}
      style={{
        width: "32px",
        height: "32px",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.12)",
        background: "#1E1F2E",
        color: "#fff",
        cursor: "pointer",
        fontWeight: 700,
      }}
    >
      −
    </button>

    <span
      style={{
        minWidth: "20px",
        textAlign: "center",
        fontWeight: 700,
      }}
    >
      {item.qty}
    </span>

    <button
      onClick={() => onIncreaseItem(item.id)}
      style={{
        width: "32px",
        height: "32px",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.12)",
        background: "#1E1F2E",
        color: "#fff",
        cursor: "pointer",
        fontWeight: 700,
      }}
    >
      +
    </button>
  </div>

  <strong style={{ color: "#E8E9F0", fontSize: "1.05rem" }}>
    ${(item.price * item.qty).toLocaleString("es-AR")} ARS
  </strong>
</div>
  </div>
))}
          </section>

          <aside
            style={{
              background: "rgba(24,24,34,0.88)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(128,86,255,0.35)",
              boxShadow: "0 18px 50px rgba(0,0,0,0.35), 0 0 35px rgba(106,60,230,0.18)",
              borderRadius: 18,
              padding: 22,              
            }}
          >
            <h2 style={{ marginBottom: 22 }}>Resumen del pedido</h2>

            <div style={{ marginBottom: 20 }}>
              {items.length === 0 && (
  <div style={{ textAlign: "center", padding: "50px 20px", color: "#A0A3B8" }}>
    <h2 style={{ color: "#fff" }}>Tu carrito está vacío</h2>
    <p>Agregá productos para continuar con la compra.</p>
  </div>
)}
  {items.map((item) => (
    <div
      key={item.id}
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 12,
        color: "#A0A3B8",
        fontSize: "0.95rem",
      }}
    >
      <span>
        {item.name} x{item.qty}
      </span>

      <strong style={{ color: "#E8EAF0" }}>
        ${(item.price * item.qty).toLocaleString("es-AR")}
      </strong>
    </div>
  ))}

  <div
    style={{
      borderTop: "1px solid rgba(255,255,255,0.12)",
      marginTop: 18,
      paddingTop: 18,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <span
      style={{
        fontSize: "1rem",
        fontWeight: 700,
      }}
    >
      TOTAL
    </span>

    <strong
      style={{
        color: "#8F6BFF",
        fontSize: "1.5rem",
      }}
    >
      ${total.toLocaleString("es-AR")}
    </strong>
  </div>
</div>

            <button
              onClick={onContinue}
              disabled={items.length === 0}  
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 12,
                border: "none",
                background: "#6A3CE6",
                color: "#fff",
                fontWeight: 800,
                cursor: items.length === 0 ? "not-allowed" : "pointer",
                opacity: items.length === 0 ? 0.5 : 1,
                letterSpacing: "0.04em",
              }}
            >
              CONTINUAR A ENTREGA
            </button>
            <div
  style={{
    marginTop: 18,
    paddingTop: 18,
    borderTop: "1px solid rgba(255,255,255,0.08)",
    color: "#A0A3B8",
    fontSize: "0.9rem",
    lineHeight: 1.8,
  }}
>
  <p style={{ margin: 0 }}>✔ Compra segura</p>
  <p style={{ margin: 0 }}>✔ Pago protegido</p>
  <p style={{ margin: 0 }}>✔ Entrega inmediata</p>
</div>
          </aside>
        </div>
      </div>
    </div>
  );
}