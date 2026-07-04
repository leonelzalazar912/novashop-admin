import { useState } from "react";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminHeader } from "./components/AdminHeader";
import { StatCard } from "./components/StatCard";
import { RecentOrders } from "./components/RecentOrders";
import { LowStockProducts } from "./components/LowStockProducts";
import { ProductsPage } from "./ProductsPage";
import { useProducts } from "./hooks/useProducts";
import { useDashboard } from "./hooks/useDashboard";
import "./styles/admin.css";

type AdminSection = "dashboard" | "products";

export function AdminDashboard() {
  const [section, setSection] = useState<AdminSection>("dashboard");
  const productsManager = useProducts();
  const dashboard = useDashboard(productsManager.products);

  return (
    <div className="admin-layout">
      <AdminSidebar onNavigate={setSection} />

      <main className="admin-content">
        {section === "dashboard" && (
          <>
            <AdminHeader />

            <div className="stats-grid">
              <StatCard title="Productos" value={dashboard.totalProducts.toString()} icon="📦" color="blue" />

              <StatCard title="Stock bajo" value={dashboard.lowStockProducts.toString()} icon="⚠️" color="orange" />

              <StatCard
                title="Inventario"
                value={`$${dashboard.totalInventoryValue.toLocaleString("es-AR")}`}
                icon="💰"
                color="green"
              />

              <StatCard title="Categorías" value={dashboard.totalCategories.toString()} icon="🏷️" color="purple" />
            </div>

            <div className="dashboard-sections">
              <RecentOrders products={productsManager.products} />
              <LowStockProducts products={productsManager.products} />
            </div>
          </>
        )}

        {section === "products" && <ProductsPage productsManager={productsManager} />}
      </main>
    </div>
  );
}