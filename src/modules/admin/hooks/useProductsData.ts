import { useMemo } from "react";
import type { Product } from "../products/data/productsData";

export function useProductsData() {
  const products = useMemo<Product[]>(() => {
    const stored = localStorage.getItem("products");

    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }, []);

  return products;
}