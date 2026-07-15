import type { Order } from "../data/ordersData";
import { useClientsData } from "../../hooks/useClientsData";
import { useProductsData } from "../../hooks/useProductsData";
import { EmptyState } from "../../components/common/EmptyState";

type OrdersTableProps = {
  orders: Order[];
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (id: string) => void;
};

export function OrdersTable({
  orders,
  onEditOrder,
  onDeleteOrder,
}: OrdersTableProps) {
  const clients = useClientsData();
  const products = useProductsData();

  function getClientName(clientId: string) {
    return (
      clients.find(
        (client) => String(client.id) === clientId
      )?.name ?? "Cliente no encontrado"
    );
  }

  function getProductName(productId: string) {
    return (
      products.find(
        (product) => String(product.id) === productId
      )?.name ?? "Producto no encontrado"
    );
  }

  return (
    <table className="products-table">
      <thead>
        <tr>
          <th>Pedido</th>
          <th>Cliente</th>
          <th>Productos</th>
          <th>Total</th>
          <th>Estado</th>
          <th>Pago</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {orders.length === 0 ? (
          <EmptyState
            message="No se encontraron pedidos."
            colSpan={8}
          />
        ) : (
          orders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>

              <td>{getClientName(order.clientId)}</td>

              <td>
                {order.items.map((item) => (
                  <div key={item.productId}>
                    • {getProductName(item.productId)} x
                    {item.quantity}
                  </div>
                ))}
              </td>

              <td>
                ${order.total.toLocaleString("es-AR")}
              </td>

              <td>{order.status}</td>

              <td>
                {order.paymentStatus === "Pendiente"
                  ? "Pago pendiente"
                  : order.paymentStatus === "Pagado"
                    ? "Pagado"
                    : "Pago rechazado"}
              </td>

              <td>{order.date}</td>

              <td>
                <button
                  type="button"
                  className="action-button"
                  onClick={() => onEditOrder(order)}
                >
                  ✏️
                </button>

                <button
                  type="button"
                  className="action-button"
                  onClick={() => {
                    const confirmed = window.confirm(
                      "¿Eliminar este pedido?"
                    );

                    if (confirmed) {
                      onDeleteOrder(order.id);
                    }
                  }}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}