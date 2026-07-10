import type { Product } from "../../products/data/productsData";

type PurchaseItemFormProps = {
  products: Product[];
  productId: number;
  quantity: number;
  unitCost: number;
  onProductChange: (id: number) => void;
  onQuantityChange: (quantity: number) => void;
  onUnitCostChange: (cost: number) => void;
  onAddItem: () => void;
};

export function PurchaseItemForm({
  products,
  productId,
  quantity,
  unitCost,
  onProductChange,
  onQuantityChange,
  onUnitCostChange,
  onAddItem,
}: PurchaseItemFormProps) {
  return (
    <>
      <select
        value={productId}
        onChange={(event) =>
          onProductChange(Number(event.target.value))
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
        onChange={(event) =>
          onQuantityChange(Number(event.target.value))
        }
      />

      <input
        type="number"
        min={0}
        placeholder="Costo unitario"
        value={unitCost}
        onChange={(event) =>
          onUnitCostChange(Number(event.target.value))
        }
      />

      <button
        type="button"
        className="secondary-button"
        onClick={onAddItem}
        disabled={quantity <= 0 || unitCost <= 0}
      >
        + Agregar producto
      </button>
    </>
  );
}