import { DashboardSection } from "./DashboardSection";
import type { Product } from "../data/productsData";

interface RecentOrdersProps {
  products: Product[];
}

export function RecentOrders({ products }: RecentOrdersProps) {
  const latestProducts = [...products].slice(-3).reverse();

  return (
    <DashboardSection title="Últimos productos agregados">
      {latestProducts.map((product) => (
        <div key={product.id} className="order-item">
          <div>
            <strong>{product.name}</strong>
            <p>{product.category}</p>
          </div>

          <span>${product.price.toLocaleString("es-AR")}</span>
        </div>
      ))}
    </DashboardSection>
  );
}