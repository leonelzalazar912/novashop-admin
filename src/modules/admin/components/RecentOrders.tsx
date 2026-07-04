import { recentOrders } from "../data/dashboardData";
import { DashboardSection } from "./DashboardSection";

export function RecentOrders() {
  return (
    <DashboardSection title="Últimos pedidos">
  {recentOrders.map((order) => (
    <div key={order.id} className="order-item">
      <div>
        <strong>{order.id}</strong>
        <p>{order.customer}</p>
      </div>

      <span>{order.total}</span>
    </div>
    ))}
    </DashboardSection>
  );
}