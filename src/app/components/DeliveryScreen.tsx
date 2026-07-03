import { useState } from "react";
import { theme } from "../../config/theme";

interface DeliveryScreenProps {
  onBack: () => void;
  onContinue: () => void;
}

export function DeliveryScreen({ onBack, onContinue }: DeliveryScreenProps) {
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "shipping">("shipping");
  const [formData, setFormData] = useState({
  fullName: "",
  email: "",
  phone: "",
  province: "",
  city: "",
  address: "",
  number: "",
  postalCode: "",
  references: "",
});

const isShippingFormValid =
  formData.province.trim() !== "" &&
  formData.city.trim() !== "" &&
  formData.address.trim() !== "" &&
  formData.number.trim() !== "" &&
  formData.postalCode.trim() !== "";

const canContinue = deliveryMethod === "pickup" || isShippingFormValid;
const showValidationMessage =
  deliveryMethod === "shipping" && !canContinue;
  const inputStyle = {
    padding: "14px",
    borderRadius: "10px",
    background: "#0d0e12",
    color: theme.colors.text,
    border: "1px solid rgba(255,255,255,0.12)",
    outline: "none",
  };

  return (
    <div
      style={{
        background:
          "radial-gradient(circle at top left, rgba(106,60,230,0.30), transparent 34%), linear-gradient(180deg, #0d0e12 0%, #090a0f 100%)",
        minHeight: "100vh",
        color: "#fff",
        padding: "32px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

     <button
  onClick={onBack}
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "#161720",
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
  ← Volver al carrito
</button>

<div style={{ display: "flex", gap: 10, marginBottom: 34 }}>
  <span style={{ color: "#777A90" }}>1 CARRITO</span>
  <span style={{ color: "#6A3CE6" }}>›</span>
  <span style={{ color: "#fff", fontWeight: 800 }}>2 ENTREGA</span>
  <span style={{ color: "#6A3CE6" }}>›</span>
  <span style={{ color: "#777A90" }}>3 DETALLES DEL PAGO</span>
  <span style={{ color: "#6A3CE6" }}>›</span>
  <span style={{ color: "#777A90" }}>4 PEDIDO COMPLETADO</span>
</div>

        <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>
          Entrega del pedido
        </h1>

        <p style={{ color: "#a0a3b8", marginBottom: "28px" }}>
          Elegí cómo querés recibir tu compra.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "18px",
            marginBottom: "28px",
          }}
        >
          <button
            onClick={() => setDeliveryMethod("pickup")}
            style={{
  background:
    deliveryMethod === "pickup"
      ? "linear-gradient(135deg, #6A3CE6, #8F6BFF)"
      : "rgba(24,24,34,0.88)",
  backdropFilter: "blur(12px)",
  color: "#fff",
  border:
    deliveryMethod === "pickup"
      ? "1px solid #8F6BFF"
      : "1px solid rgba(128,86,255,0.25)",
  borderRadius: "16px",
  padding: "24px",
  cursor: "pointer",
  textAlign: "left",
  transition: "all .25s ease",
  boxShadow:
    deliveryMethod === "pickup"
      ? "0 0 25px rgba(106,60,230,.30)"
      : "0 12px 30px rgba(0,0,0,.25)",
}}
          >
            <h3>📍 Retiro en el local</h3>
            <p style={{ color: "#c7c9d9" }}>
              Retirá tu compra personalmente en nuestra sucursal.
            </p>
          </button>

          <button
            onClick={() => setDeliveryMethod("shipping")}
            style={{
  background:
    deliveryMethod === "shipping"
      ? "linear-gradient(135deg, #6A3CE6, #8F6BFF)"
      : "rgba(24,24,34,0.88)",
  backdropFilter: "blur(12px)",
  color: "#fff",
  border:
    deliveryMethod === "pickup"
      ? "1px solid #8F6BFF"
      : "1px solid rgba(128,86,255,0.25)",
  borderRadius: "16px",
  padding: "24px",
  cursor: "pointer",
  textAlign: "left",
  transition: "all .25s ease",
  boxShadow:
    deliveryMethod === "pickup"
      ? "0 0 25px rgba(106,60,230,.30)"
      : "0 12px 30px rgba(0,0,0,.25)",
}}
          >
            <h3>🚚 Envío a domicilio</h3>
            <p style={{ color: "#c7c9d9" }}>
              Recibí tu pedido en la dirección que indiques.
            </p>
          </button>
        </div>

        {deliveryMethod === "shipping" && (
          <div
            style={{
              background: "rgba(24,24,34,0.88)",
backdropFilter: "blur(12px)",
border: "1px solid rgba(128,86,255,0.35)",
borderRadius: "18px",
padding: "28px",
boxShadow: "0 18px 50px rgba(0,0,0,0.35), 0 0 35px rgba(106,60,230,0.18)",
            }}
          >
            <h2 style={{ marginBottom: "8px" }}>Datos de entrega</h2>

            <p style={{ color: "#a0a3b8", marginBottom: "24px" }}>
              Completá la información necesaria para realizar el envío de tu pedido.
            </p>

            

            <h3
              style={{
                marginTop: "26px",
                marginBottom: "18px",
                fontSize: "18px",
              }}
            >
              Dirección de entrega
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <input placeholder="Provincia" style={inputStyle} value={formData.province} onChange={(e) => setFormData({ ...formData, province: e.target.value })} />
              <input placeholder="Ciudad" style={inputStyle} value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
              <input placeholder="Dirección" style={inputStyle} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              <input placeholder="Número" style={inputStyle} value={formData.number} onChange={(e) => setFormData({ ...formData, number: e.target.value })} />
              <input placeholder="Código Postal" style={inputStyle} value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} />
              <input placeholder="Referencias (opcional)" style={inputStyle} value={formData.references} onChange={(e) => setFormData({ ...formData, references: e.target.value })} />
            </div>
          </div>
        )}

        {deliveryMethod === "pickup" && (
          <div
            style={{
              background: "rgba(24,24,34,0.88)",
backdropFilter: "blur(12px)",
border: "1px solid rgba(128,86,255,0.35)",
borderRadius: "18px",
padding: "28px",
boxShadow: "0 18px 50px rgba(0,0,0,0.35), 0 0 35px rgba(106,60,230,0.18)",
            }}
          >
            <h2>Retiro en el local</h2>
            <p style={{ color: "#a0a3b8" }}>
              Podrás retirar tu compra personalmente en el local.
            </p>
          </div>
        )}

        {showValidationMessage && (
  <div
    style={{
      marginTop: "24px",
      padding: "16px 20px",
      borderRadius: "12px",
      background: "rgba(120, 20, 20, 0.25)",
      border: "1px solid rgba(255, 90, 90, 0.35)",
      color: "#ffb4b4",
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      gap: "10px",
    }}
  >
    <span style={{ fontSize: "1.2rem" }}>⚠️</span>
    <span>Completá todos los campos obligatorios para continuar.</span>
  </div>
)}

        <div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "32px",
  }}
>
  <button
  onClick={onContinue}
  disabled={!canContinue}
  style={{
    background: "#6A3CE6",
    color: "#fff",
    border: "none",
    padding: "14px 28px",
    borderRadius: "12px",
    cursor: canContinue ? "pointer" : "not-allowed",
    opacity: canContinue ? 1 : 0.5,
    fontWeight: 800,
    fontSize: "1rem",
  }}
>
  CONTINUAR AL PAGO
</button>
</div>
      </div>
    </div>
  );
}