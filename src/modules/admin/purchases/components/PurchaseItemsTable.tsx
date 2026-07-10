import type { PurchaseItem } from "../data/purchasesData";

type PurchaseItemsTableProps = {
  items: PurchaseItem[];
  onUpdateItem: (
    index: number,
    quantity: number,
    unitCost: number
  ) => void;
  onRemoveItem: (index: number) => void;
};

export function PurchaseItemsTable({
  items,
  onUpdateItem,
  onRemoveItem,
}: PurchaseItemsTableProps) {
  if (items.length === 0) return null;

  return (
    <div className="purchase-items">
      <h3>Productos agregados</h3>

      <table className="products-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Costo</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => (
            <tr key={`${item.productId}-${index}`}>
              <td>{item.productName}</td>

              <td>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(event) =>
                    onUpdateItem(
                      index,
                      Number(event.target.value),
                      item.unitCost
                    )
                  }
                />
              </td>

              <td>
                <input
                  type="number"
                  min={0}
                  value={item.unitCost}
                  onChange={(event) =>
                    onUpdateItem(
                      index,
                      item.quantity,
                      Number(event.target.value)
                    )
                  }
                />
              </td>

              <td>
                $
                {(item.quantity * item.unitCost).toLocaleString("es-AR")}
              </td>

              <td>
                <button
                  type="button"
                  className="action-button"
                  onClick={() => onRemoveItem(index)}
                  title="Quitar producto"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}