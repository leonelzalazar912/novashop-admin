import { useProducts } from "../products/hooks/useProducts";

export function useProductsData() {
  const { products } = useProducts();

  return products;
}