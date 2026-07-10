import type { Product } from "../../products/data/productsData";

type ProductInfoCardProps = {
  product: Product;
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
        {product.supplier}
      </p>

      <p>
        <strong>🏷️ Marca:</strong> {product.brand}
      </p>
    </div>
  );
}