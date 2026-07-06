import type { Product } from "../data/productsData";
import { ProductRow } from "./ProductRow";
import { EmptyState } from "../../components/common/EmptyState";
import { useDataIntegrity } from "../../hooks/useDataIntegrity";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export function ProductsTable({
  products,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  const { hasOrdersByProduct } = useDataIntegrity();

  function handleDelete(product: Product) {
    if (hasOrdersByProduct(product.id)) {
      alert(
        `No se puede eliminar el producto "${product.name}" porque está asociado a uno o más pedidos. Podés marcarlo como inactivo en su lugar.`
      );
      return;
    }

    onDelete(product.id);
  }

  return (
    <table className="products-table">
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {products.length === 0 && (
          <EmptyState
            message="No se encontraron productos."
            colSpan={6}
          />
        )}

        {products.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            onEdit={onEdit}
            onDelete={() => handleDelete(product)}
          />
        ))}
      </tbody>
    </table>
  );
}