import type { AdminProduct } from "../../../../types/product";

type ProductInfoCardProps = {
  product: AdminProduct;
};

export function ProductInfoCard({
  product,
}: ProductInfoCardProps) {
  return (
    <div className="product-info-card">
      <p>
        <strong>📦 Stock actual:</strong> {product.stock}
      </p>

      <p>
        <strong>💲 Precio de venta:</strong>{" "}
        ${product.price.toLocaleString("es-AR")}
      </p>

      <p>
        <strong>🏢 Proveedor habitual:</strong>{" "}
        {product.supplier?.name ?? "—"}
      </p>

      <p>
        <strong>🏷️ Marca:</strong> {product.brand?.name ?? "—"}
      </p>
    </div>
  );
}