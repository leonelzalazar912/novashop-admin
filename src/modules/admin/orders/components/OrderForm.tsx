import { useEffect, useState } from "react";
import type {
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
} from "../data/ordersData";
import { useClientsData } from "../../hooks/useClientsData";
import { useProductsData } from "../../hooks/useProductsData";

type OrderFormProps = {
  editingOrder: Order | null;
  onAddOrder: (order: Omit<Order, "id">) => void;
  onUpdateOrder: (order: Order) => void;
  onCancelEdit: () => void;
};

const orderStatuses: OrderStatus[] = [
  "Pendiente",
  "En preparación",
  "Enviado",
  "Entregado",
  "Cancelado",
];

const paymentStatuses: PaymentStatus[] = [
  "Pendiente",
  "Pagado",
  "Rechazado",
];

export function OrderForm({
  editingOrder,
  onAddOrder,
  onUpdateOrder,
  onCancelEdit,
}: OrderFormProps) {
  const clients = useClientsData();
  const products = useProductsData();

  const [clientId, setClientId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [status, setStatus] = useState<OrderStatus>("Pendiente");
  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatus>("Pendiente");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingOrder) {
      setClientId(String(editingOrder.clientId));
      setItems(editingOrder.items);
      setStatus(editingOrder.status);
      setPaymentStatus(editingOrder.paymentStatus);
      setNotes(editingOrder.notes);
      setError("");
    }
  }, [editingOrder]);

  const selectedProduct = products.find(
    (product) => product.id === productId
  );

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function getProductName(id: string) {
    return products.find((product) => product.id === id)?.name ?? "Producto";
  }

  function getPaymentLabel(status: PaymentStatus) {
    if (status === "Pendiente") return "Pago pendiente";
    if (status === "Pagado") return "Pagado";
    return "Pago rechazado";
  }

  function addItem() {
    if (!selectedProduct || quantity <= 0) {
      setError("Seleccioná un producto y una cantidad válida.");
      return;
    }

    const exists = items.find(
      (item) => item.productId === selectedProduct.id
    );

    if (exists) {
      setItems((prev) =>
        prev.map((item) =>
          item.productId === selectedProduct.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setItems((prev) => [
        ...prev,
        {
          productId: selectedProduct.id,
          quantity,
          price: selectedProduct.price,
        },
      ]);
    }

    setProductId("");
    setQuantity(1);
    setError("");
  }

  function removeItem(productId: string) {
    setItems((prev) =>
      prev.filter((item) => item.productId !== productId)
    );
  }

  function clearForm() {
    setClientId("");
    setProductId("");
    setQuantity(1);
    setItems([]);
    setStatus("Pendiente");
    setPaymentStatus("Pendiente");
    setNotes("");
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!clientId || items.length === 0) {
      setError("Seleccioná un cliente y agregá al menos un producto.");
      return;
    }

    if (editingOrder) {
      onUpdateOrder({
        ...editingOrder,
        status,
        paymentStatus,
        notes: notes.trim(),
      });
    } else {
      onAddOrder({
        clientId,
        items,
        status,
        paymentStatus,
        date: new Date().toISOString().split("T")[0],
        total,
        notes: notes.trim(),
      });
    }

    clearForm();
  }

  function handleCancel() {
    clearForm();
    onCancelEdit();
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      {error && <p className="error-message">{error}</p>}

      <select
        value={clientId}
        onChange={(e) => setClientId(e.target.value)}
        disabled={!!editingOrder}
      >
        <option value="">Seleccionar cliente</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>

      {!editingOrder && (
        <>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            <option value="">Seleccionar producto</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />

          <button type="button" onClick={addItem}>
            Agregar producto
          </button>
        </>
      )}

      {items.length > 0 && (
        <div>
          <h3>Productos del pedido</h3>

          {items.map((item) => (
            <div key={item.productId}>
              {getProductName(item.productId)} x{item.quantity} - $
              {item.price * item.quantity}

              {!editingOrder && (
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                >
                  Quitar
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <input value={`Total: $${total}`} readOnly />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as OrderStatus)}
      >
        {orderStatuses.map((item) => (
          <option key={item} value={item}>
            Estado del pedido: {item}
          </option>
        ))}
      </select>

      <select
        value={paymentStatus}
        onChange={(e) =>
          setPaymentStatus(e.target.value as PaymentStatus)
        }
      >
        {paymentStatuses.map((item) => (
          <option key={item} value={item}>
            {getPaymentLabel(item)}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Observaciones"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
      />

      <div className="form-actions">
        <button className="primary-button" type="submit">
          {editingOrder ? "Guardar cambios" : "Crear pedido"}
        </button>

        {editingOrder && (
          <button type="button" onClick={handleCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}