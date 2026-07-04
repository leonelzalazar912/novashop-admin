import { useMemo } from "react";
import type { Product } from "../data/productsData";

interface DashboardData {
  totalProducts: number;
  lowStockProducts: number;
  totalInventoryValue: number;
  totalCategories: number;
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

    return {
      totalProducts,
      lowStockProducts,
      totalInventoryValue,
      totalCategories,
    };
  }, [products]);
}