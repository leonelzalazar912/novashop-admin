import type { Purchase } from "../data/purchasesData";
import { EmptyState } from "../../components/common/EmptyState";

type PurchasesTableProps = {
  purchases: Purchase[];
  onCancel: (purchase: Purchase) => void;
  onView: (purchase: Purchase) => void;
};

export function PurchasesTable({
  purchases,
  onCancel,
  onView,
}: PurchasesTableProps) {
  return (
    <table className="products-table">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Número</th>
          <th>Proveedor</th>
          <th>Productos</th>
          <th>Total</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {purchases.length === 0 ? (
          <EmptyState
            message="No se encontraron compras."
            colSpan={7}
          />
        ) : (
          purchases.map((purchase) => {
            const isCancelled =
              purchase.status === "Cancelada";

            return (
              <tr key={purchase.id}>
                <td>{purchase.date}</td>
                <td>{purchase.number}</td>
                <td>{purchase.supplier}</td>

                <td>
                  {purchase.items.map((item, index) => (
                    <div
                      key={`${purchase.id}-${item.productId}-${index}`}
                    >
                      {item.productName} × {item.quantity}
                    </div>
                  ))}
                </td>

                <td>
                  $
                  {purchase.total.toLocaleString(
                    "es-AR"
                  )}
                </td>

                <td>
                  <span
                    className={
                      isCancelled
                        ? "purchase-status purchase-status-cancelled"
                        : "purchase-status purchase-status-completed"
                    }
                  >
                    {purchase.status}
                  </span>
                </td>

                <td>
                  <button
                    type="button"
                    className="action-button"
                    title="Ver detalle"
                    onClick={() => onView(purchase)}
                  >
                    👁️
                  </button>

                  <button
                    type="button"
                    className="action-button"
                    title={
                      isCancelled
                        ? "Compra ya cancelada"
                        : "Cancelar compra"
                    }
                    disabled={isCancelled}
                    onClick={() => {
                      const confirmed = window.confirm(
                        `¿Cancelar la compra ${purchase.number} del proveedor "${purchase.supplier}"?\n\nEl stock agregado por esta compra será revertido.`
                      );

                      if (confirmed) {
                        onCancel(purchase);
                      }
                    }}
                  >
                    🚫
                  </button>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}