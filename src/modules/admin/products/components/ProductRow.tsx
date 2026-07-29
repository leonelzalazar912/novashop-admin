import type { AdminProduct } from "../../../../types/product";

interface ProductRowProps {
  product: AdminProduct;
  onEdit: (product: AdminProduct) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

export function ProductRow({
  product,
  onEdit,
  onDelete,
  onToggleActive,
}: ProductRowProps) {
  const imageUrl = product.images[0]?.url;

  return (
    <tr>
      <td>
        {imageUrl ? (
          <img
            className="product-image"
            src={imageUrl}
            alt={product.name}
          />
        ) : (
          "🖼️"
        )}
      </td>

      <td>{product.name}</td>

      <td>{product.category?.name ?? "—"}</td>

      <td>{product.brand?.name ?? "—"}</td>

      <td>{product.supplier?.name ?? "—"}</td>

      <td>${product.price.toLocaleString("es-AR")}</td>

      <td>
        <span
          className={
            product.stock === 0
              ? "stock-badge out"
              : product.stock <= 5
              ? "stock-badge low"
              : "stock-badge ok"
          }
        >
          {product.stock === 0
            ? "Sin stock"
            : product.stock <= 5
            ? `${product.stock} (Bajo)`
            : `${product.stock} (Disponible)`}
        </span>
      </td>

      <td>
        {product.active ? "🟢 Activo" : "🔴 Inactivo"}
      </td>

      <td>
        <button
          className="action-button"
          onClick={() => onEdit(product)}
        >
          ✏️
        </button>

        <button
          className="action-button"
          onClick={() => onDelete(product.id)}
        >
          🗑️
        </button>

        <button
          type="button"
          className="action-button"
          onClick={() => onToggleActive(product.id)}
        >
          {product.active ? "Desactivar" : "Activar"}
        </button>
      </td>
    </tr>
  );
}
