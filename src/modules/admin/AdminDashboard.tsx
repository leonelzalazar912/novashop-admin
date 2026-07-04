import { useState } from "react";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminHeader } from "./components/AdminHeader";
import { StatCard } from "./components/StatCard";
import { RecentOrders } from "./components/RecentOrders";
import { LowStockProducts } from "./components/LowStockProducts";
import { ProductsPage } from "./ProductsPage";
import { dashboardStats } from "./data/dashboardData";
import "./styles/admin.css";

type AdminSection = "dashboard" | "products";

export function AdminDashboard() {
  const [section, setSection] = useState<AdminSection>("dashboard");

  return (
    <div className="admin-layout">
      <AdminSidebar onNavigate={setSection} />

      <main className="admin-content">
        {section === "dashboard" && (
          <>
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

            <div className="dashboard-sections">
              <RecentOrders />
              <LowStockProducts />
            </div>
          </>
        )}

        {section === "products" && <ProductsPage />}
      </main>
    </div>
  );
}