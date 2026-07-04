import { DashboardSection } from "./DashboardSection";
import type { Product } from "../data/productsData";

interface LowStockProductsProps {
  products: Product[];
}

export function LowStockProducts({ products }: LowStockProductsProps) {
  const lowStockProducts = products.filter(
    (product) => product.stock > 0 && product.stock <= 5
  );

  return (
    <DashboardSection title="Productos con poco stock">
      {lowStockProducts.map((product) => (
        <div key={product.id} className="order-item">
          <div>
            <strong>{product.name}</strong>
            <p>Stock disponible</p>
          </div>

          <span>{product.stock} unidades</span>
        </div>
      ))}
    </DashboardSection>
  );
}