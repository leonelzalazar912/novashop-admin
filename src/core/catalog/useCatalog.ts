import { useEffect, useState } from "react";
import { fetchCatalogCategories, fetchCatalogProducts } from "./catalogService";
import type { Product, ProductCategory } from "../../types/product";

export function useCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCatalog() {
      setLoading(true);
      setError("");

      try {
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          fetchCatalogProducts(),
          fetchCatalogCategories(),
        ]);

        setProducts(fetchedProducts);
        setCategories(fetchedCategories);
      } catch (caughtError) {
        console.error(caughtError);

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "No se pudo cargar el catálogo."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadCatalog();
  }, []);

  return { products, categories, loading, error };
}
