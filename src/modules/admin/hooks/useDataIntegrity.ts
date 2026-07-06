import type { Order } from "../orders/data/ordersData";

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

  function hasOrdersByClient(clientId: number) {
    return getOrders().some((order) => order.clientId === clientId);
  }

  function hasOrdersByProduct(productId: number) {
    return getOrders().some((order) =>
      order.items.some((item) => item.productId === productId)
    );
  }

  return {
    hasOrdersByClient,
    hasOrdersByProduct,
  };
}