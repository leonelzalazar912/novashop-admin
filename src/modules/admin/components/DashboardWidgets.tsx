import type { Product } from "../data/productsData";
import { RecentOrders } from "./RecentOrders";
import { LowStockProducts } from "./LowStockProducts";

interface DashboardWidgetsProps {
  products: Product[];
}

export function DashboardWidgets({ products }: DashboardWidgetsProps) {
  return (
    <div className="widgets-grid">
      <RecentOrders products={products} />
      <LowStockProducts products={products} />
    </div>
  );
}