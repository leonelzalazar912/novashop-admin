import { useEffect } from "react";
import type { Purchase } from "../data/purchasesData";

type PurchaseDetailModalProps = {
  purchase: Purchase;
  onClose: () => void;
};

export function PurchaseDetailModal({
  purchase,
  onClose,
}: PurchaseDetailModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="product-form">
          <h2>Detalle de compra</h2>

          <p>
            <strong>Número:</strong> {purchase.number}
          </p>

          <p>
            <strong>Proveedor:</strong> {purchase.supplier}
          </p>

          <p>
            <strong>Fecha:</strong> {purchase.date}
          </p>

          <p>
            <strong>Estado:</strong>{" "}
            {purchase.status === "Completada"
              ? "🟢 Completada"
              : "🔴 Cancelada"}
          </p>

          <table className="products-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Costo</th>
                <th>Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {purchase.items.map((item) => (
                <tr key={item.productId}>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>
                    ${item.unitCost.toLocaleString("es-AR")}
                  </td>
                  <td>
                    $
                    {(
                      item.quantity * item.unitCost
                    ).toLocaleString("es-AR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <PurchaseTotal total={purchase.total} />

          <div className="form-actions">
            <button onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type PurchaseTotalProps = {
  total: number;
};

function PurchaseTotal({
  total,
}: PurchaseTotalProps) {
  return (
    <p>
      <strong>Total:</strong> $
      {total.toLocaleString("es-AR")}
    </p>
  );
}