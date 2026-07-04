import type { Product } from "../data/productsData";
import { CategoryChart } from "./CategoryChart";
import { InventoryPieChart } from "./InventoryPieChart";

interface DashboardChartsProps {
  products: Product[];
}

export function DashboardCharts({ products }: DashboardChartsProps) {
  return (
    <div className="charts-grid">
      <CategoryChart products={products} />
      <InventoryPieChart products={products} />
    </div>
  );
}