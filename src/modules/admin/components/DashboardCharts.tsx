import type { AdminProduct } from "../../../types/product";
import { CategoryChart } from "./CategoryChart";
import { InventoryPieChart } from "./InventoryPieChart";

interface DashboardChartsProps {
  products: AdminProduct[];
}

export function DashboardCharts({ products }: DashboardChartsProps) {
  return (
    <div className="charts-grid">
      <CategoryChart products={products} />
      <InventoryPieChart products={products} />
    </div>
  );
}