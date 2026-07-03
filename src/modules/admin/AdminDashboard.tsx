import { AdminSidebar } from "./components/AdminSidebar";
import "./styles/admin.css";
import { StatCard } from "./components/StatCard";

export function AdminDashboard() {
  return (
  <div className="admin-layout">
    <AdminSidebar />

    <main className="admin-content">
      <h1>Dashboard</h1>
      <p>Bienvenida al panel de administración de NovaShop.</p>
      <div className="stats-grid">
        <StatCard title="Productos" value={245} />
        <StatCard title="Pedidos" value={12} />
        <StatCard title="Clientes" value={98} />
      </div>
    </main>
  </div>
);
}