import type { Order } from "../orders/data/ordersData";
import type { Product } from "../products/data/productsData";

export function useDataIntegrity() {
  function getOrders(): Order[] {
    const stored = localStorage.getItem("orders");
    if (!stored) return [];

    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  function getProducts(): Product[] {
    const stored = localStorage.getItem("products");
    if (!stored) return [];

    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  function hasOrdersByClient(clientId: number) {
    return getOrders().some((order) => order.clientId === clientId);
  }

  function hasOrdersByProduct(productId: number) {
    return getOrders().some((order) =>
      order.items.some((item) => item.productId === productId)
    );
  }

  function hasProductsByCategory(category: string) {
    return getProducts().some(
      (product) => product.category === category
    );
  }

  function hasProductsByBrand(brand: string) {
    return getProducts().some(
      (product) =>
        (product as Product & { brand?: string }).brand === brand
    );
  }

  function hasProductsBySupplier(supplier: string) {
    return getProducts().some(
      (product) =>
        (product as Product & { supplier?: string }).supplier === supplier
    );
  }

  return {
    hasOrdersByClient,
    hasOrdersByProduct,
    hasProductsByCategory,
    hasProductsByBrand,
    hasProductsBySupplier,
  };
}