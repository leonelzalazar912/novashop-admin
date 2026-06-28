import { useState } from "react";

interface ClaimsScreenProps {
  onBack: () => void;
  onFinish: () => void;
}

export function ClaimsScreen({ onBack, onFinish }: ClaimsScreenProps) {
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [claimSent, setClaimSent] = useState(false);

  const canSend =
    name.trim() !== "" &&
    reason.trim() !== "" &&
    description.trim() !== "";

    const handleSubmit = () => {
  if (!canSend) return;

  setClaimSent(true);

  setName("");
  setReason("");
  setDescription("");
};

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(106,60,230,0.45), transparent 35%), linear-gradient(180deg, #0d0e12 0%, #07080c 100%)",
        color: "#fff",
        padding: "40px 24px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <button
          onClick={onBack}
          style={{
            background: "rgba(24,24,34,0.88)",
            color: "#E8EAF0",
            border: "1px solid rgba(128,86,255,0.35)",
            borderRadius: 12,
            padding: "12px 18px",
            cursor: "pointer",
            fontWeight: 700,
            marginBottom: 28,
          }}
        >
          ← Volver a la tienda
        </button>

        <h1 style={{ fontSize: 38, marginBottom: 10 }}>Enviar Reclamo</h1>

        <p style={{ color: "#A0A3B8", marginBottom: 36 }}>
          Complete el formulario para enviar su reclamo o queja
        </p>

        <div
          style={{
            background: "rgba(24,24,34,0.72)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(128,86,255,0.35)",
            borderRadius: 18,
            padding: 34,
            boxShadow:
              "0 18px 50px rgba(0,0,0,0.35), 0 0 35px rgba(106,60,230,0.18)",
          }}
        >
          <label style={{ fontWeight: 800 }}>Nombre del Cliente</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ingrese su nombre completo"
            style={inputStyle}
          />

          <label style={{ fontWeight: 800 }}>Motivo del Reclamo</label>
          <select
  value={reason}
  onChange={(e) => setReason(e.target.value)}
  style={{
    ...inputStyle,
    backgroundColor: "#242432",
    color: "#ffffff",
  }}
>
            <option value="" style={{ backgroundColor: "#242432", color: "#fff" }}>
  Seleccione un motivo
</option>
<option value="producto" style={{ backgroundColor: "#242432", color: "#fff" }}>
  Problema con un producto
</option>
<option value="pago" style={{ backgroundColor: "#242432", color: "#fff" }}>
  Problema con el pago
</option>
<option value="envio" style={{ backgroundColor: "#242432", color: "#fff" }}>
  Problema con el envío
</option>
<option value="otro" style={{ backgroundColor: "#242432", color: "#fff" }}>
  Otro
</option>
          </select>

          <label style={{ fontWeight: 800 }}>Descripción de la Queja</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describa detalladamente su reclamo o queja..."
            style={{
              ...inputStyle,
              height: 170,
              resize: "none",
            }}
          />

          <button
            onClick={handleSubmit}
            disabled={!canSend}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: 12,
              border: "none",
              background: canSend
                ? "linear-gradient(135deg, #6A3CE6, #8F6BFF)"
                : "rgba(255,255,255,0.12)",
              color: "#fff",
              fontWeight: 900,
              fontSize: "1rem",
              cursor: canSend ? "pointer" : "not-allowed",
              opacity: canSend ? 1 : 0.55,
            }}
          >
            Enviar Reclamo
          </button>

          {claimSent && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.55)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999,
    }}
  >
    <div
      style={{
        width: "min(620px, 90%)",
        background: "#260045",
        border: "1px solid rgba(143,107,255,0.45)",
        borderRadius: "16px",
        padding: "48px",
        textAlign: "center",
        boxShadow: "0 0 50px rgba(106,60,230,0.35)",
      }}
    >
      <div style={{ fontSize: "4rem", marginBottom: "24px" }}>✅</div>

      <h2 style={{ fontSize: "1.7rem", marginBottom: "18px" }}>
        ¡Tu reclamo ha sido enviado con éxito!
      </h2>

      <p style={{ color: "#c7c9d9", lineHeight: 1.6, marginBottom: "34px" }}>
        Hemos recibido tu reclamo y será procesado a la brevedad.
        Te contactaremos pronto.
      </p>

      <button
  onClick={() => {
    setClaimSent(false);
    onFinish();
  }}
        style={{
          background: "linear-gradient(135deg, #6A3CE6, #A66BFF)",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          padding: "14px 34px",
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        Entendido
      </button>
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );
}



const inputStyle = {
  width: "100%",
  marginTop: 10,
  marginBottom: 26,
  padding: "16px",
  borderRadius: 8,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(180,150,255,0.35)",
  color: "#fff",
  outline: "none",
  fontSize: "1rem",
};