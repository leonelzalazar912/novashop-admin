import { AdminSidebar } from "./components/AdminSidebar";
import { StatCard } from "./components/StatCard";
import { RecentOrders } from "./components/RecentOrders";
import "./styles/admin.css";
import { dashboardStats } from "./data/dashboardData";
import { AdminHeader } from "./components/AdminHeader";

export function AdminDashboard() {
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-content">
        <AdminHeader />

        <div className="stats-grid">
          {dashboardStats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>

        <RecentOrders />
      </main>
    </div>
  );
}