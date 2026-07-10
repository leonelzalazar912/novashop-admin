import type { Purchase } from "../data/purchasesData";
import { EmptyState } from "../../components/common/EmptyState";

type PurchasesTableProps = {
  purchases: Purchase[];
  onDelete: (id: number) => void;
  onView: (purchase: Purchase) => void;
};

export function PurchasesTable({
  purchases,
  onDelete,
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
          purchases.map((purchase) => (
            <tr key={purchase.id}>
              <td>{purchase.number}</td>
              <td>{purchase.date}</td>

              <td>{purchase.supplier}</td>

              <td>
                {purchase.items.map((item) => (
                  <div key={`${purchase.id}-${item.productId}`}>
                    {item.productName} × {item.quantity}
                  </div>
                ))}
              </td>

              <td>
                ${purchase.total.toLocaleString("es-AR")}
              </td>

              <td>
                {purchase.status === "Completada"
                  ? "🟢 Completada"
                  : "🔴 Cancelada"}
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
                  title="Eliminar"
                  onClick={() => {
                    const confirmed = window.confirm(
                      `¿Eliminar la compra al proveedor "${purchase.supplier}"?`
                    );

                    if (confirmed) {
                      onDelete(purchase.id);
                    }
                  }}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}