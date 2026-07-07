import { useMemo } from "react";
import { initialBrands, type Brand } from "../brands/data/brandsData";

export function useBrandsData() {
  const brands = useMemo<Brand[]>(() => {
    const stored = localStorage.getItem("brands");

    if (!stored) return initialBrands;

    try {
      return JSON.parse(stored);
    } catch {
      return initialBrands;
    }
  }, []);

  return brands.filter((brand) => brand.active);
}