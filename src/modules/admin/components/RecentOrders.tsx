import { recentOrders } from "../data/dashboardData";

export function RecentOrders() {
  return (
    <section className="recent-orders">
      <h2>Últimos pedidos</h2>

      {recentOrders.map((order) => (
        <div key={order.id} className="order-item">
          <div>
            <strong>{order.id}</strong>
            <p>{order.customer}</p>
          </div>

          <span>{order.total}</span>
        </div>
      ))}
    </section>
  );
}