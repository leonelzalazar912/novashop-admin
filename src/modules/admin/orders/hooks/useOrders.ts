import { useEffect, useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { initialOrders, type Order } from "../data/ordersData";

export function useOrders() {
  const [orders, setOrders] = useLocalStorage<Order[]>(
    "orders",
    initialOrders
  );

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "status">("name");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy]);

  function addOrder(order: Omit<Order, "id">) {
    setOrders((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...order,
      },
    ]);
  }

  function updateOrder(updatedOrder: Order) {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
  }

  function deleteOrder(id: number) {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  }

  const filteredOrders = [...orders]
    .filter((order) =>
      String(order.clientId).includes(search)
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return b.date.localeCompare(a.date);
      }

      return a.status.localeCompare(b.status);
    });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    orders: paginatedOrders,
    search,
    setSearch,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
    addOrder,
    updateOrder,
    deleteOrder,
  };
}