import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import type { Product } from "../data/productsData";
import { ChartCard } from "./ChartCard";

interface CategoryChartProps {
  products: Product[];
}

export function CategoryChart({ products }: CategoryChartProps) {
  const data = Object.values(
    products.reduce<Record<string, { category: string; total: number }>>(
      (acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = {
            category: product.category,
            total: 0,
          };
        }

        acc[product.category].total += product.stock;
        return acc;
      },
      {}
    )
  );

  return (
    <ChartCard title="Unidades por categoría">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
            <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
            />
          <XAxis
            dataKey="category"
            angle={-20}
            textAnchor="end"
            height={60}
          />
          <YAxis />
          <Tooltip
            formatter={(value) => [`${value} unidades`, "Stock"]}
            labelFormatter={(label) => `Categoría: ${label}`}
          />
          <Bar
            dataKey="total"
            fill="#3b82f6"
            radius={[8, 8, 0, 0]}
            isAnimationActive
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}