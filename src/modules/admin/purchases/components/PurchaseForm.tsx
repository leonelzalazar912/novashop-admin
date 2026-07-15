import { useEffect, useMemo, useState } from "react";
import type { Product } from "../../products/data/productsData";
import type { Supplier } from "../../suppliers/data/suppliersData";
import type {
  Purchase,
  PurchaseItem,
} from "../data/purchasesData";
import { ProductInfoCard } from "./ProductInfoCard";
import { PurchaseSummary } from "./PurchaseSummary";
import { PurchaseItemsTable } from "./PurchaseItemsTable";
import { PurchaseItemForm } from "./PurchaseItemForm";

type PurchaseFormProps = {
  products: Product[];
  suppliers: Supplier[];
  onCancel: () => void;
  onSave: (
    purchase: Omit<Purchase, "id" | "number">
  ) => void;
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
  const [observations, setObservations] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState("Contado");
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

      const existingItem = items.find(
        (item) => item.productId === selectedProduct.id
      );

      if (existingItem) {
        setItems((prev) =>
          prev.map((item) =>
            item.productId === selectedProduct.id
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  unitCost,
                }
              : item
          )
        );
      } else {
        setItems((prev) => [
          ...prev,
          {
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            quantity,
            unitCost,
          },
        ]);
      }

      setQuantity(1);
      setUnitCost(0);
    }

    function handleRemoveItem(indexToRemove: number) {
        setItems((prev) =>
            prev.filter((_, index) => index !== indexToRemove)
        );
        }

    function handleUpdateItem(
      indexToUpdate: number,
      quantity: number,
      unitCost: number
    ) {
      setItems((prev) =>
        prev.map((item, index) =>
          index === indexToUpdate
            ? {
                ...item,
                quantity,
                unitCost,
              }
            : item
        )
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
                setSupplierId(event.target.value)
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

          <PurchaseItemForm
            products={products}
            productId={productId}
            quantity={quantity}
            unitCost={unitCost}
            onProductChange={setProductId}
            onQuantityChange={setQuantity}
            onUnitCostChange={setUnitCost}
            onAddItem={handleAddItem}
          />

            <PurchaseItemsTable
              items={items}
              onUpdateItem={handleUpdateItem}
              onRemoveItem={handleRemoveItem}
            />

          <PurchaseSummary total={total} />

          <div className="form-group">
            <label htmlFor="purchase-observations">
              Observaciones
            </label>

            <textarea
              id="purchase-observations"
              value={observations}
              onChange={(event) =>
                setObservations(event.target.value)
              }
              rows={4}
              placeholder="Observaciones de la compra (opcional)..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="payment-method">
              Forma de pago
            </label>

            <select
              id="payment-method"
              value={paymentMethod}
              onChange={(event) =>
                setPaymentMethod(event.target.value)
              }
            >
              <option value="Contado">Contado</option>
              <option value="Transferencia">
                Transferencia
              </option>
              <option value="Tarjeta">
                Tarjeta
              </option>
              <option value="Cuenta corriente">
                Cuenta corriente
              </option>
            </select>
          </div>

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
                  observations,
                  paymentMethod,
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