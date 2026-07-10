import { useEffect, useMemo, useState } from "react";
import type { Product } from "../../products/data/productsData";
import type { Supplier } from "../../suppliers/data/suppliersData";
import type {
  Purchase,
  PurchaseItem,
} from "../data/purchasesData";

type PurchaseFormProps = {
  products: Product[];
  suppliers: Supplier[];
  onCancel: () => void;
  onSave: (purchase: Omit<Purchase, "id">) => void;
};

export function PurchaseForm({
  products,
  suppliers,
  onCancel,
  onSave,
}: PurchaseFormProps) {
  const [supplierId, setSupplierId] = useState(
    suppliers[0]?.id ?? 0
  );

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [productId, setProductId] = useState(
    products[0]?.id ?? 0
  );

  const [quantity, setQuantity] = useState(1);
  const [unitCost, setUnitCost] = useState(0);
  const [items, setItems] = useState<PurchaseItem[]>([]);

  const selectedSupplier = useMemo(
    () =>
      suppliers.find(
        (supplier) => supplier.id === supplierId
      ),
    [suppliers, supplierId]
  );

  const selectedProduct = useMemo(
    () =>
      products.find(
        (product) => product.id === productId
      ),
    [products, productId]
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCancel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel]);

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.unitCost,
    0
    );

    function handleAddItem() {
        if (!selectedProduct) return;

        setItems((prev) => [
            ...prev,
            {
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            quantity,
            unitCost,
            },
        ]);

        setQuantity(1);
        setUnitCost(0);
        }

    function handleRemoveItem(indexToRemove: number) {
        setItems((prev) =>
            prev.filter((_, index) => index !== indexToRemove)
        );
        }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-content"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="product-form">
          <h2>Nueva compra</h2>

          <select
            value={supplierId}
            onChange={(event) =>
                setSupplierId(Number(event.target.value))
            }
            >
                {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                    {supplier.company}
                    </option>
                ))}
                </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <select
            value={productId}
            onChange={(event) =>
                setProductId(Number(event.target.value))
            }
            >
            {products.map((product) => (
                <option key={product.id} value={product.id}>
                {product.name}
                </option>
            ))}
            </select>

          <input
            type="number"
            min={1}
            placeholder="Cantidad"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />

          <input
            type="number"
            min={0}
            placeholder="Costo unitario"
            value={unitCost}
            onChange={(e) => setUnitCost(Number(e.target.value))}
          />

          <button
            type="button"
            className="secondary-button"
            onClick={handleAddItem}
            disabled={!selectedProduct || quantity <= 0 || unitCost <= 0}
            >
            + Agregar producto
            </button>

            {items.length > 0 && (
                <div className="purchase-items">
                    <h3>Productos agregados</h3>

                    {items.map((item, index) => (
                    <div
                        key={`${item.productId}-${index}`}
                        className="purchase-item"
                    >
                        <strong>{item.productName}</strong>

                        <span>
                        {item.quantity} × $
                        {item.unitCost.toLocaleString("es-AR")}
                        </span>

                        <span>
                        = $
                        {(item.quantity * item.unitCost).toLocaleString("es-AR")}
                        </span>

                        <button
                            type="button"
                            className="action-button"
                            onClick={() => handleRemoveItem(index)}
                            title="Quitar producto"
                            >
                            🗑️
                            </button>
                    </div>
                    ))}
                </div>
                )}

          <p>
            <strong>Total:</strong> ${total.toLocaleString("es-AR")}
          </p>

          <div className="form-actions">
            <button
              className="primary-button"
                disabled={
                    !selectedSupplier ||
                    items.length === 0
                }
              onClick={() =>
                onSave({
                  supplier: selectedSupplier?.company ?? "",
                  date,
                  items,
                  total,
                  status: "Completada",
                })
              }
            >
              Guardar
            </button>

            <button onClick={onCancel}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}