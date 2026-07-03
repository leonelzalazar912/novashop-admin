import { AdminSidebar } from "./components/AdminSidebar";
import "./styles/admin.css";

export function AdminDashboard() {
  return (
  <div className="admin-layout">
    <AdminSidebar />

    <main className="admin-content">
      <h1>Dashboard</h1>
      <p>Bienvenida al panel de administración de NovaShop.</p>
    </main>
  </div>
);
}