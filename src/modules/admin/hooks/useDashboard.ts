import { useMemo } from "react";
import type { AdminProduct } from "../../../types/product";
import type { DashboardAlert } from "../types/dashboard";


interface DashboardData {
  totalProducts: number;
  lowStockProducts: number;
  totalInventoryValue: number;
  totalCategories: number;
  totalUnits: number;
  averagePrice: number;
  mostExpensiveProduct: AdminProduct | null;
  highestStockProduct: AdminProduct | null;
  alerts: DashboardAlert[];
}

export function useDashboard(products: AdminProduct[]): DashboardData {

  // KPIs
  return useMemo(() => {
  const totalProducts = products.length;

  const lowStockProducts = products.filter(
    (product) => product.stock > 0 && product.stock <= 5
  ).length;

  const totalInventoryValue = products.reduce(
    (total, product) => total + product.price * product.stock,
    0
  );

  // Estadísticas
  // Dedupe por id de categoría: product.category es un objeto {id, name}
  // distinto por cada producto (viene de un join separado), así que un
  // Set de objetos nunca colapsaría duplicados por más que compartan
  // la misma categoría — hay que dedupear por su id.
  const totalCategories = new Set(
    products
      .map((product) => product.category?.id)
      .filter((id): id is string => Boolean(id))
  ).size;

  const totalUnits = products.reduce(
    (total, product) => total + product.stock,
    0
  );

  const averagePrice =
    totalUnits > 0 ? totalInventoryValue / totalUnits : 0;

  // Productos destacados  
  const mostExpensiveProduct =
    products.length > 0
      ? [...products].sort((a, b) => b.price - a.price)[0]
      : null;

  const highestStockProduct =
    products.length > 0
      ? [...products].sort((a, b) => b.stock - a.stock)[0]
      : null;

  // Alertas    
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