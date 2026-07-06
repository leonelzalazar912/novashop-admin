import { useEffect, useState } from "react";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminHeader } from "./components/AdminHeader";
import { DashboardStats } from "./components/DashboardStats";
import { DashboardWidgets } from "./components/DashboardWidgets";
import { ProductsPage } from "./products/ProductsPage";
import { useProducts } from "./products/hooks/useProducts";
import { useDashboard } from "./hooks/useDashboard";
import "./styles/admin.css";
import { DashboardCharts } from "./components/DashboardCharts";
import { NotificationPanel } from "./components/NotificationPanel";
import { DashboardSettingsModal } from "./components/DashboardSettingsModal";
import { DashboardToolbar } from "./components/DashboardToolbar";
import type { DashboardCard } from "./types/dashboard";
import { CategoriesPage } from "./categories/CategoriesPage";
import { ClientsPage } from "./clients/ClientsPage";
import { SuppliersPage } from "./suppliers/SuppliersPage";

type AdminSection =
  | "dashboard"
  | "products"
  | "categories"
  | "clients"
  | "suppliers";

export function AdminDashboard() {
  const [section, setSection] = useState<AdminSection>("dashboard");
  const productsManager = useProducts();
  const dashboard = useDashboard(productsManager.products);

  const [visibleCards, setVisibleCards] = useState<string[]>(() => {
    const savedCards = localStorage.getItem("visibleDashboardCards");

    if (savedCards) {
      return JSON.parse(savedCards);
    }

    return [
      "products",
      "lowStock",
      "inventory",
      "categories",
      "units",
      "averagePrice",
      "highestStock",
      "mostExpensive",
    ];
  });

  useEffect(() => {
    localStorage.setItem(
      "visibleDashboardCards",
      JSON.stringify(visibleCards)
    );
  }, [visibleCards]);

  const [showDashboardSettings, setShowDashboardSettings] = useState(false);

  const dashboardCards: DashboardCard[] = [
    { id: "products", title: "Productos", value: dashboard.totalProducts.toString(), icon: "📦", color: "blue" },
    { id: "lowStock", title: "Stock bajo", value: dashboard.lowStockProducts.toString(), icon: "⚠️", color: "orange" },
    { id: "inventory", title: "Inventario", value: `$${dashboard.totalInventoryValue.toLocaleString("es-AR")}`, icon: "💰", color: "green" },
    { id: "categories", title: "Categorías", value: dashboard.totalCategories.toString(), icon: "🏷️", color: "purple" },
    { id: "units", title: "Unidades", value: dashboard.totalUnits.toString(), icon: "📦", color: "blue" },
    { id: "averagePrice", title: "Precio promedio", value: `$${dashboard.averagePrice.toLocaleString("es-AR")}`, icon: "💲", color: "green" },
    { id: "highestStock", title: "Mayor stock", value: dashboard.highestStockProduct?.name ?? "Sin datos", icon: "🏆", color: "purple" },
    { id: "mostExpensive", title: "Producto más caro", value: dashboard.mostExpensiveProduct?.name ?? "Sin datos", icon: "💎", color: "orange" },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar onNavigate={setSection} />

      <main className="admin-content">
        {section === "dashboard" && (
          <>
            <AdminHeader />

            <DashboardToolbar
              onCustomize={() => setShowDashboardSettings(true)}
            />

            <NotificationPanel
              alerts={dashboard.alerts}
              onActionClick={() => setSection("products")}
            />

            {showDashboardSettings && (
              <DashboardSettingsModal
                cards={dashboardCards}
                visibleCards={visibleCards}
                onToggleCard={(id) =>
                  setVisibleCards((prev) =>
                    prev.includes(id)
                      ? prev.filter((cardId) => cardId !== id)
                      : [...prev, id]
                  )
                }
                onClose={() => setShowDashboardSettings(false)}
              />
            )}

            <DashboardStats
              cards={dashboardCards}
              visibleCards={visibleCards}
            />

            <div className="dashboard-sections">
              <DashboardCharts products={productsManager.products} />
              <DashboardWidgets products={productsManager.products} />
            </div>
          </>
        )}

        {section === "products" && (
          <ProductsPage productsManager={productsManager} />
        )}

        {section === "categories" && <CategoriesPage />}

        {section === "clients" && <ClientsPage />}

        {section === "suppliers" && <SuppliersPage />}
      </main>
    </div>
  );
}