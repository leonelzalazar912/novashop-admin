import { useEffect, useState } from "react";
import type { Order } from "./data/ordersData";

import { useOrders } from "./hooks/useOrders";
import { OrderForm } from "./components/OrderForm";
import { OrdersTable } from "./components/OrdersTable";

import { Message } from "../components/common/Message";
import { Toolbar } from "../components/common/Toolbar";
import { Pagination } from "../components/common/Pagination";

export function OrdersPage() {
  const {
    orders,
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
  } = useOrders();

  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  function handleAddOrder(order: Omit<Order, "id">) {
    addOrder(order);
    setMessage("Pedido creado correctamente.");
  }

  function handleUpdateOrder(order: Order) {
    updateOrder(order);
    setEditingOrder(null);
    setMessage("Pedido actualizado correctamente.");
  }

  function handleDeleteOrder(id: number) {
    deleteOrder(id);
    setMessage("Pedido eliminado correctamente.");
  }

  return (
    <div>
      <div className="products-header">
        <div>
          <h1>Pedidos</h1>
          <p>Administrá los pedidos de NovaShop.</p>
        </div>
      </div>

      <Message message={message} />

      <Toolbar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        searchPlaceholder="Buscar pedido..."
      />

      <OrderForm
        editingOrder={editingOrder}
        onAddOrder={handleAddOrder}
        onUpdateOrder={handleUpdateOrder}
        onCancelEdit={() => setEditingOrder(null)}
      />

      <OrdersTable
        orders={orders}
        onEditOrder={setEditingOrder}
        onDeleteOrder={handleDeleteOrder}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={() => setCurrentPage(currentPage - 1)}
        onNext={() => setCurrentPage(currentPage + 1)}
      />
    </div>
  );
}