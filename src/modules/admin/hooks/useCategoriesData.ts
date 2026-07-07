import { useMemo } from "react";
import { initialCategories, type Category } from "../categories/data/categoriesData";

export function useCategoriesData() {
  const categories = useMemo<Category[]>(() => {
    const stored = localStorage.getItem("categories");

    if (!stored) return initialCategories;

    try {
      return JSON.parse(stored);
    } catch {
      return initialCategories;
    }
  }, []);

  return categories.filter((category) => category.active);
}