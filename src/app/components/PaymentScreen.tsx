import { useState } from "react";

import type { Game } from "./ProductCard";

interface CartItem extends Game {
  qty: number;
}

interface PaymentScreenProps {
  items: CartItem[];
  onBack: () => void;
  onComplete: () => void;
}

export function PaymentScreen({ items, onBack, onComplete }: PaymentScreenProps) {
  const total = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalItems = items.reduce((acc, item) => acc + item.qty, 0);
  const [paymentMethod, setPaymentMethod] = useState("Tarjeta de crédito");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dni, setDni] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [error, setError] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const inputStyle = {
    background: "#1E1F2E",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#E8E9F0",
    padding: "13px 14px",
    borderRadius: 10,
    outline: "none",
};
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
    background: "#161720",
    color: "#E8EAF0",
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
  ← Volver a la entrega
</button>

        <div style={{ display: "flex", gap: 10, marginBottom: 34 }}>
  <span style={{ color: "#777A90" }}>1 CARRITO</span>
  <span style={{ color: "#6A3CE6" }}>›</span>
  <span style={{ color: "#777A90" }}>2 ENTREGA</span>
  <span style={{ color: "#6A3CE6" }}>›</span>
  <span style={{ color: "#fff", fontWeight: 800 }}>
    3 DETALLES DEL PAGO
  </span>
  <span style={{ color: "#6A3CE6" }}>›</span>
  <span style={{ color: "#777A90" }}>4 PEDIDO COMPLETADO</span>
</div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: 28,
            alignItems: "start",
          }}
        >
          <section
            style={{
              background: "#161720",
              border: "1px solid rgba(106,60,230,0.25)",
              borderRadius: 18,
              padding: 24,
            }}
          >
            <h1 style={{ fontSize: "1.8rem", marginBottom: 8 }}>
              Detalles del pago
            </h1>

            <p style={{ color: "#A0A3B8", marginBottom: 24 }}>
              Completá tus datos para finalizar la compra.
            </p>

            <h3 style={{ marginBottom: 14 }}>Información personal</h3>

<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
    marginBottom: 24,
  }}
>
  {["Nombre", "Apellido", "Email", "Teléfono", "DNI", "Código postal"].map(
    (label) => (
  <input
  key={label}
  placeholder={label}
  value={
    label === "Nombre" ? name :
    label === "Apellido" ? lastName :
    label === "Email" ? email :
    label === "Teléfono" ? phone :
    label === "DNI" ? dni :
    postalCode
  }
  onChange={(e) => {
    if (label === "Nombre") setName(e.target.value);
    if (label === "Apellido") setLastName(e.target.value);
    if (label === "Email") setEmail(e.target.value);
    if (label === "Teléfono") setPhone(e.target.value);
    if (label === "DNI") setDni(e.target.value);
    if (label === "Código postal") setPostalCode(e.target.value);
  }}
  style={{
    background: "#1E1F2E",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#E8E9F0",
    padding: "13px 14px",
    borderRadius: 10,
    outline: "none",
  }}
/>
    )
  )}
</div>

<h3 style={{ marginBottom: 14 }}>Método de pago</h3>

<div style={{ display: "grid", gap: 12 }}>
  {[
    ["💳", "Tarjeta de crédito", "Visa · Mastercard"],
    ["💜", "Mercado Pago", "Pago inmediato"],
    ["🏦", "Transferencia bancaria", "CBU / Alias"],
  ].map(([icon, title, desc]) => {
    const selected = paymentMethod === title;

    return (
      <button
        key={title}
        onClick={() => {
  setPaymentMethod(title);
  setError("");
}}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          textAlign: "left",
          background: selected ? "rgba(106,60,230,0.18)" : "#1E1F2E",
          border: selected
            ? "2px solid #6A3CE6"
            : "1px solid rgba(106,60,230,0.35)",
          color: "#E8E9F0",
          padding: 14,
          borderRadius: 12,
          cursor: "pointer",
          transition: "all .2s ease",
        }}
      >
        <span style={{ fontSize: 24 }}>{icon}</span>

        <div>
          <strong>{title}</strong>
          <p style={{ color: "#8F92A8", fontSize: 13, margin: 0 }}>
            {desc}
          </p>
        </div>
      </button>
    );
  })}
</div>

{paymentMethod === "Tarjeta de crédito" && (
  <div style={{ marginTop: 22 }}>
    <h3 style={{ marginBottom: 14 }}>Datos de la tarjeta</h3>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 14,
      }}
    >
      <input placeholder="Número de tarjeta" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} style={inputStyle} />
      <input placeholder="Nombre del titular" value={cardName} onChange={(e) => setCardName(e.target.value)} style={inputStyle} />
      <input placeholder="Vencimiento MM/AA" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} style={inputStyle} />
      <input placeholder="CVV" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} style={inputStyle} />
    </div>
  </div>
)}

{paymentMethod === "Mercado Pago" && (
  <div
    style={{
      marginTop: 22,
      background: "rgba(0,200,215,0.10)",
      border: "1px solid rgba(0,200,215,0.35)",
      borderRadius: 14,
      padding: 20,
      textAlign: "center",
    }}
  >
    <h3 style={{ marginBottom: 18 }}>Pago con Mercado Pago</h3>

    <div
  style={{
    width: 180,
    height: 180,
    margin: "0 auto 18px",
    background: "#fff",
    borderRadius: 12,
    padding: 14,
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: 4,
  }}
>
  {Array.from({ length: 49 }).map((_, i) => (
    <div
      key={i}
      style={{
        background:
          [0, 1, 2, 7, 14, 8, 16, 6, 13, 20, 28, 35, 42, 43, 44, 36, 48, 46, 40, 32, 24, 10, 18, 25, 30, 38].includes(i)
            ? "#111"
            : "#fff",
        borderRadius: 2,
      }}
    />
  ))}
</div>

    <p style={{ color: "#A0A3B8", margin: 0 }}>
      Escaneá el código QR con la aplicación de Mercado Pago para completar la compra.
    </p>

    <p
      style={{
        color: "#6FCBFF",
        fontSize: "0.85rem",
        marginTop: 12,
      }}
    >
      
    </p>
  </div>
)}

{paymentMethod === "Transferencia bancaria" && (
  <div
    style={{
      marginTop: 22,
      background: "rgba(106,60,230,0.12)",
      border: "1px solid rgba(106,60,230,0.35)",
      borderRadius: 14,
      padding: 18,
    }}
  >
    <h3 style={{ marginBottom: 14 }}>Datos bancarios de NexusPlay</h3>

    <p>Banco: <strong>Banco Nexus Digital</strong></p>
    <p>Tipo de cuenta: <strong>Cuenta corriente</strong></p>
    <p>CBU: <strong>0000003100098765432101</strong></p>
    <p>Alias: <strong>NEXUSPLAY.GAMES</strong></p>

    
  </div>
)}



{error && (
  <div
    style={{
      background: "rgba(220,38,38,0.15)",
      border: "1px solid rgba(220,38,38,0.4)",
      color: "#FCA5A5",
      padding: "12px",
      borderRadius: 10,
      marginTop: 20,
      marginBottom: 20,
      textAlign: "center",
      fontWeight: 600,
    }}
  >
    {error}
  </div>
)}

            <button
  onClick={() => {
  // Validación de datos personales
  if (
    !name ||
    !lastName ||
    !email ||
    !phone ||
    !dni ||
    !postalCode
  ) {
    setError("⚠️ Completá todos los datos personales antes de continuar.");
    return;
  }

  // Si eligió tarjeta, validar también los datos de la tarjeta
  if (
    paymentMethod === "Tarjeta de crédito" &&
    (
      !cardNumber ||
      !cardName ||
      !cardExpiry ||
      !cardCvv
    )
  ) {
    setError("⚠️ Completá todos los datos de la tarjeta.");
    return;
  }

  setError("");
  onComplete();
}}
              style={{
                marginTop: 20,
                width: "100%",
                padding: "14px",
                borderRadius: 12,
                border: "none",
                background: "#6A3CE6",
                color: "#fff",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              CONFIRMAR COMPRA
            </button>
          </section>

          <aside
  style={{
    background: "#161720",
    border: "1px solid rgba(106,60,230,0.35)",
    borderRadius: 18,
    padding: 22,
    position: "sticky",
    top: 30,
  }}
>
  <h2 style={{ fontSize: "1.3rem", marginBottom: 20, color: "#E8E9F0" }}>
    Resumen del pedido
  </h2>

  <div style={{ display: "grid", gap: 14, marginBottom: 18 }}>
    {items.map((item) => (
      <div
        key={item.id}
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          paddingBottom: 12,
        }}
      >
        <div>
          <strong style={{ color: "#E8E9F0", fontSize: 14 }}>
            {item.title}
          </strong>
          <p style={{ color: "#8F92A8", fontSize: 13, margin: "4px 0 0" }}>
            Cantidad: {item.qty}
          </p>
        </div>

        <span style={{ color: "#E8E9F0", fontWeight: 700 }}>
          ${(item.price * item.qty).toLocaleString("es-AR")}
        </span>
      </div>
    ))}
  </div>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 12,
      color: "#A0A3B8",
    }}
  >
    <span>Productos</span>
    <span>{totalItems}</span>
  </div>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 18,
      color: "#A0A3B8",
    }}
  >
    <span>Envío</span>
    <span>Gratis</span>
  </div>

  <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.08)", margin: "18px 0" }} />

  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span style={{ color: "#E8E9F0", fontWeight: 700 }}>Total</span>

    <span style={{ fontSize: "1.4rem", color: "#6A3CE6", fontWeight: 800 }}>
      ${total.toLocaleString("es-AR")}
    </span>
  </div>
</aside>
        </div>
      </div>
    </div>
  );
}