import { theme } from "../../config/theme";
import type { CartItem } from "../../core/cart/cartTypes";
import type {
  CheckoutCustomer,
  CheckoutDelivery,
  PaymentMethodLabel,
} from "../../core/checkout/checkoutTypes";

interface CompletedOrder {
  orderNumber: string;
  items: CartItem[];
  customer: CheckoutCustomer;
  delivery: CheckoutDelivery;
  paymentMethod: PaymentMethodLabel;
}

interface CompletedScreenProps {
  order: CompletedOrder;
  onBackHome: () => void;
}

export function CompletedScreen({ order, onBackHome }: CompletedScreenProps) {
  const { items, orderNumber, customer, delivery, paymentMethod } = order;
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
  const customerName = `${customer.firstName} ${customer.lastName}`.trim();

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
          <div style={{ textAlign: "center", marginBottom: 28 }}>
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
              Tu compra fue registrada con éxito. En breve validaremos el pago para comenzar su preparación.
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
            src={(item.images.find((image) => image.isPrimary) ?? item.images[0])?.url ?? "/logo.png"}
            alt={item.name}
            style={{ width: 58, height: 76, objectFit: "cover", borderRadius: 10 }}
          />

          <div style={{ flex: 1 }}>
            <strong>{item.name}</strong>
            <p style={{ color: "#A0A3B8", margin: "4px 0" }}>
              {item.category?.name} · Cantidad: {item.qty}
            </p>
          </div>

          <strong>${(item.price * item.qty).toLocaleString("es-AR")}</strong>
        </div>
      ))}
    </div>

    {/* Datos de entrega */}
    <div style={summaryBoxStyle}>
      <h3 style={{ color: "#9B7CFF", letterSpacing: 3 }}>📍 DATOS DE ENTREGA</h3>

      {delivery.method === "shipping" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <p>Nombre completo:<br /><strong>{customerName}</strong></p>
          <p>Teléfono:<br /><strong>{customer.phone}</strong></p>
          <p>Dirección:<br /><strong>{delivery.address} {delivery.number}</strong></p>
          <p>Ciudad / CP:<br /><strong>{delivery.city}, {delivery.postalCode}</strong></p>
        </div>
      ) : (
        <p style={{ color: "#E8E9F0" }}>
          Retiro en el local · <strong>{customerName}</strong>
        </p>
      )}
    </div>

    {/* Forma de pago */}
    <div style={summaryBoxStyle}>
      <h3 style={{ color: "#9B7CFF", letterSpacing: 3 }}>💳 FORMA DE PAGO</h3>

      <p style={{ color: "#E8E9F0" }}>
        <strong>{paymentMethod}</strong>
      </p>
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
    onClick={onBackHome}
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
    IR A LA TIENDA
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
        </div>
      </div>
    </div>
  );
}
