import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import type { Product } from "../data/productsData";
import { ChartCard } from "./ChartCard";

interface InventoryPieChartProps {
  products: Product[];
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

export function InventoryPieChart({
  products,
}: InventoryPieChartProps) {
  const data = Object.values(
    products.reduce<Record<string, { name: string; value: number }>>(
      (acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = {
            name: product.category,
            value: 0,
          };
        }

        acc[product.category].value += product.stock;

        return acc;
      },
      {}
    )
  );

  return (
    <ChartCard title="Inventario por categoría">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            isAnimationActive
            animationDuration={800}            
          >
        
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}