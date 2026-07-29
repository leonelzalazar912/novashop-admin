import type { AdminProduct } from "../../../../types/product";
import { ProductRow } from "./ProductRow";
import { EmptyState } from "../../components/common/EmptyState";
import { useDataIntegrity } from "../../hooks/useDataIntegrity";

interface ProductsTableProps {
  products: AdminProduct[];
  onEdit: (product: AdminProduct) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

export function ProductsTable({
  products,
  onEdit,
  onDelete,
  onToggleActive,
}: ProductsTableProps) {
  const {
    hasOrdersByProduct,
    hasStockMovementsByProduct,
    hasPurchaseItemsByProduct,
  } = useDataIntegrity();

  async function handleDelete(product: AdminProduct) {
    try {
      const hasOrders = await hasOrdersByProduct(
        product.id
      );

      if (hasOrders) {
        alert(
          `No se puede eliminar el producto "${product.name}" porque está asociado a uno o más pedidos. Podés marcarlo como inactivo en su lugar.`
        );
        return;
      }

      const hasPurchases = await hasPurchaseItemsByProduct(
        product.id
      );

      if (hasPurchases) {
        alert(
          `No se puede eliminar el producto "${product.name}" porque está asociado a una o más compras. Podés marcarlo como inactivo en su lugar.`
        );
        return;
      }

      const hasStockMovements = await hasStockMovementsByProduct(
        product.id
      );

      if (hasStockMovements) {
        alert(
          `No se puede eliminar el producto "${product.name}" porque tiene movimientos de stock registrados. Podés marcarlo como inactivo en su lugar.`
        );
        return;
      }

      const confirmed = window.confirm(
        `¿Eliminar el producto "${product.name}"?`
      );

      if (confirmed) {
        onDelete(product.id);
      }
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "No se pudo comprobar la integridad del producto."
      );
    }
  }

  return (
    <table className="products-table">
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Marca</th>
          <th>Proveedor</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {products.length === 0 && (
          <EmptyState
            message="No se encontraron productos."
            colSpan={9}
          />
        )}

        {products.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            onEdit={onEdit}
            onDelete={() => {
              void handleDelete(product);
            }}
            onToggleActive={() => onToggleActive(product.id)}
          />
        ))}
      </tbody>
    </table>
  );
}