import type { Product } from "../data/productsData";

interface ProductRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export function ProductRow({
  product,
  onEdit,
  onDelete,
}: ProductRowProps) {
  return (
    <tr>
      <td>
        {product.image.startsWith("http") || product.image.startsWith("data:") ? (
          <img
            className="product-image"
            src={product.image}
            alt={product.name}
          />
        ) : (
          product.image
        )}
      </td>

      <td>{product.name}</td>

      <td>{product.category}</td>

      <td>{product.brand}</td>

      <td>{product.supplier}</td>

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
      </td>
    </tr>
  );
}