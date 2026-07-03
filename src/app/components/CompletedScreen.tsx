import { useState } from "react";
import { theme } from "../../config/theme";
import type { CartItem } from "../../core/cart/cartTypes";


interface CompletedScreenProps {
  items: CartItem[];
  onBackHome: () => void;
  onBackPayment: () => void;
}

export function CompletedScreen({ items, onBackHome, onBackPayment }: CompletedScreenProps) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const orderNumber = "NP-2026-000184";
  const date = new Date().toLocaleDateString("es-AR");
  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const summaryBoxStyle = {
  background: "rgba(24,24,34,0.88)",
  borderRadius: 16,
  padding: 22,
  border: "1px solid rgba(128,86,255,0.28)",
  boxShadow: "0 0 30px rgba(106,60,230,0.12)",
};
  const shipping = 0;
  const total = subtotal + shipping;

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
        fontFamily: "'Inter', sans-serif",
        padding: "32px 24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "1180px", margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 34 }}>
          <span style={{ color: "#777A90" }}>1 CARRITO</span>
          <span style={{ color: "#6A3CE6" }}>›</span>
          <span style={{ color: "#777A90" }}>2 ENTREGA</span>
          <span style={{ color: "#6A3CE6" }}>›</span>
          <span style={{ color: "#777A90" }}>3 DETALLES DEL PAGO</span>
          <span style={{ color: "#6A3CE6" }}>›</span>
          <span style={{ color: "#fff", fontWeight: 800 }}>
            4 RESUMEN
          </span>
        </div>

        <div
          style={{
            width: "100%",
            margin: "0 auto",
            background: "#161720",
            borderRadius: 22,
            border: "1px solid rgba(106,60,230,0.35)",
            padding: "28px",
            boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
          }}
        >
          <div style={{ display: "none" }}>
            <div
              style={{
                width: 92,
                height: 92,
                margin: "0 auto 22px",
                borderRadius: "50%",
                background: "rgba(106,60,230,0.16)",
                border: "2px solid #6A3CE6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.5rem",
                color: "#6A3CE6",
                fontWeight: 900,
              }}
            >
              ✓
            </div>

            <h1 style={{ fontSize: "2rem", marginBottom: 10 }}>
              Pedido completado
            </h1>

            <p style={{ color: "#A0A3B8", lineHeight: 1.6 }}>
              Tu compra fue procesada correctamente.
            </p>
          </div>

  <div
  style={{
    display: "grid",
    gridTemplateColumns: "1.4fr 0.9fr",
    gap: 22,
    marginBottom: 28,
  }}
>
  <div style={{ display: "grid", gap: 18 }}>
    {/* Productos */}
    <div style={summaryBoxStyle}>
      <h3>📦 Productos</h3>

      {items.map((item) => (
        <div key={item.id} style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 16 }}>
          <img
            src={item.image}
            alt={item.name}
            style={{ width: 58, height: 76, objectFit: "cover", borderRadius: 10 }}
          />

          <div style={{ flex: 1 }}>
            <strong>{item.name}</strong>
            <p style={{ color: "#A0A3B8", margin: "4px 0" }}>
              {item.category} · Cantidad: {item.qty}
            </p>
          </div>

          <strong>${(item.price * item.qty).toLocaleString("es-AR")}</strong>
        </div>
      ))}
    </div>

    {/* Datos de entrega */}
    <div style={summaryBoxStyle}>
      <h3 style={{ color: "#9B7CFF", letterSpacing: 3 }}>📍 DATOS DE ENTREGA</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <p>Nombre completo:<br /><strong>Alejandro Fernández</strong></p>
        <p>Teléfono:<br /><strong>+54 381 456-7890</strong></p>
        <p>Dirección:<br /><strong>Av. Belgrano 1245, 3°B</strong></p>
        <p>Ciudad / CP:<br /><strong>San Miguel de Tucumán, 4000</strong></p>
      </div>
    </div>

    {/* Forma de pago */}
    <div style={summaryBoxStyle}>
      <h3 style={{ color: "#9B7CFF", letterSpacing: 3 }}>💳 FORMA DE PAGO</h3>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ background: "#1A5FD0", padding: "8px 14px", borderRadius: 10, fontWeight: 900 }}>
          VISA
        </div>

        <div>
          <strong>Tarjeta de crédito •••• 1234</strong>
          <p style={{ color: "#A0A3B8", margin: "4px 0" }}>Vence 08/2028</p>
        </div>
      </div>
    </div>
  </div>

 {/* Resumen derecho */}
<div
  style={{
    ...summaryBoxStyle,
    padding: 26,
  }}
>
  <h3
    style={{
      color: "#fff",
      fontSize: "1.25rem",
      fontWeight: 800,
      textTransform: "uppercase",
      letterSpacing: 2,
      marginBottom: 20,
    }}
  >
    RESUMEN DEL PEDIDO
  </h3>

  <p>
    Número: <strong>{orderNumber}</strong>
  </p>

  <p>
    Fecha: <strong>{date}</strong>
  </p>

  <hr
    style={{
      borderColor: "rgba(255,255,255,0.08)",
      margin: "18px 0",
    }}
  />

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 10,
    }}
  >
    <span>Subtotal</span>
    <strong>${subtotal.toLocaleString("es-AR")}</strong>
  </div>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 20,
    }}
  >
    <span>Envío</span>
    <strong>Gratis</strong>
  </div>

  <hr
    style={{
      borderColor: "rgba(255,255,255,0.08)",
      marginBottom: 20,
    }}
  />

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    }}
  >
    <span
      style={{
        fontSize: "1.1rem",
        fontWeight: 800,
        letterSpacing: 1,
      }}
    >
      TOTAL
    </span>

    <span
      style={{
        color: "#A66BFF",
        fontSize: "2rem",
        fontWeight: 900,
      }}
    >
      ${total.toLocaleString("es-AR")}
    </span>
  </div>

  <button
    onClick={() => setShowSuccessModal(true)}
    style={{
      width: "100%",
      background: "linear-gradient(135deg, #6A3CE6, #8F6BFF)",
      color: "#fff",
      border: "none",
      padding: "16px",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: 900,
      fontSize: "1rem",
      boxShadow: "0 8px 24px rgba(106,60,230,.35)",
    }}
  >
    CONFIRMAR COMPRA
  </button>
<div
  style={{
    marginTop: "18px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    color: theme.colors.textSoft,
    fontSize: "0.82rem",
    letterSpacing: "0.5px",
  }}
>
  <span>🔒</span>
  <span>PAGO 100% SEGURO</span>
</div>
</div>
</div>

<div style={{ marginTop: 28 }}>
  <button
    onClick={onBackPayment}
    style={{
      background: "transparent",
      color: "#A66BFF",
      border: "1px solid rgba(128,86,255,0.35)",
      padding: "14px 26px",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: 800,
      fontSize: "1rem",
    }}
  >
    ← VOLVER A DETALLES DEL PAGO
  </button>
</div>

  {showSuccessModal && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.65)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999,
    }}
  >
    <div
      style={{
        width: "min(520px, 90%)",
        background: "rgba(18,9,31,0.96)",
        border: "1px solid rgba(128,86,255,0.35)",
        borderRadius: 18,
        padding: 34,
        textAlign: "center",
        boxShadow: "0 0 60px rgba(106,60,230,0.35)",
      }}
    >
      <div style={{ fontSize: "3.5rem", color: "#16f28b", marginBottom: 18 }}>
        ✓
      </div>

      <h2>¡Compra realizada con éxito!</h2>

      <p style={{ color: "#A0A3B8" }}>
        Tu compra fue registrada con éxito. En breve validaremos el pago para comenzar su preparación.
      </p>

      <div style={{ ...summaryBoxStyle, textAlign: "left", marginTop: 24 }}>
        <p>Número de pedido: <strong style={{ color: "#A66BFF" }}>{orderNumber}</strong></p>
        <p>Fecha: <strong>{date}</strong></p>
        <p>Total pagado: <strong>${total.toLocaleString("es-AR")}</strong></p>
      </div>

      <button
        onClick={onBackHome}
        style={{
          width: "100%",
          marginTop: 26,
          background: "linear-gradient(135deg, #6A3CE6, #8F6BFF)",
          color: "#fff",
          border: "none",
          padding: "16px",
          borderRadius: "12px",
          cursor: "pointer",
          fontWeight: 900,
          fontSize: "1rem",
        }}
      >
        IR A LA TIENDA
      </button>
    </div>
  </div>
)}
      </div>
    </div>
    </div>
  );
}