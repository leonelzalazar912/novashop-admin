import { useMemo } from "react";
import type { Product } from "../data/productsData";

interface DashboardData {
  totalProducts: number;
  lowStockProducts: number;
  totalInventoryValue: number;
  totalCategories: number;
  totalUnits: number;
  averagePrice: number;
  mostExpensiveProduct: Product | null;
  highestStockProduct: Product | null;
}

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

  return {
    totalProducts,
    lowStockProducts,
    totalInventoryValue,
    totalCategories,
    totalUnits,
    averagePrice,
    mostExpensiveProduct,
    highestStockProduct,
  };
}, [products]);
}