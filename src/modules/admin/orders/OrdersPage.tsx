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
    error,
  } = useOrders();

  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  async function handleAddOrder(
    order: Omit<Order, "id">
  ): Promise<boolean> {
    const success = await addOrder(order);

    if (success) {
      setMessage("Pedido creado correctamente.");
    }

    return success;
  }

  async function handleUpdateOrder(
    order: Order
  ): Promise<boolean> {
    const success = await updateOrder(order);

    if (success) {
      setEditingOrder(null);
      setMessage("Pedido actualizado correctamente.");
    }

    return success;
  }

  async function handleDeleteOrder(id: string) {
    const success = await deleteOrder(id);

    if (success) {
      setMessage("Pedido eliminado correctamente.");
    }
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
      <Message message={error} />

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