import { useMemo } from "react";
import type { Product } from "../data/productsData";

type DashboardAlert = {
  type: "success" | "warning" | "danger";
  title: string;
  description: string;
  action?: string;
};


interface DashboardData {
  totalProducts: number;
  lowStockProducts: number;
  totalInventoryValue: number;
  totalCategories: number;
  totalUnits: number;
  averagePrice: number;
  mostExpensiveProduct: Product | null;
  highestStockProduct: Product | null;
  alerts: DashboardAlert[];  
}[];

export function useDashboard(products: Product[]): DashboardData {

  
  return useMemo(() => {
  const totalProducts = products.length;

  const lowStockProducts = products.filter(
    (product) => product.stock > 0 && product.stock <= 5
  ).length;

  const totalInventoryValue = products.reduce(
    (total, product) => total + product.price * product.stock,
    0
  );

  const totalCategories = new Set(
    products.map((product) => product.category)
  ).size;

  const totalUnits = products.reduce(
    (total, product) => total + product.stock,
    0
  );

  const averagePrice =
    totalUnits > 0 ? totalInventoryValue / totalUnits : 0;

  const mostExpensiveProduct =
    products.length > 0
      ? [...products].sort((a, b) => b.price - a.price)[0]
      : null;

  const highestStockProduct =
    products.length > 0
      ? [...products].sort((a, b) => b.stock - a.stock)[0]
      : null;

  const alerts: DashboardAlert[] = [];

  const outOfStockProducts = products.filter(
    (product) => product.stock === 0
  ).length;

  if (outOfStockProducts > 0) {
    alerts.push({
      type: "danger",
      title: "Productos sin stock",
      description: `Hay ${outOfStockProducts} productos sin stock.`,
      action: "Ver productos",
    });
  }

  if (lowStockProducts > 0) {
    alerts.push({
      type: "warning",
      title: "Stock bajo",
      description: `Hay ${lowStockProducts} productos con stock crítico.`,
      action: "Revisar inventario",
    });
  }

  if (totalInventoryValue > 1_000_000) {
    alerts.push({
      type: "success",
      title: "Inventario saludable",
      description: "El valor del inventario supera el millón.",
    });
  }    

  return {
    totalProducts,
    lowStockProducts,
    totalInventoryValue,
    totalCategories,
    totalUnits,
    averagePrice,
    mostExpensiveProduct,
    highestStockProduct,
    alerts,
  };
}, [products]);
}