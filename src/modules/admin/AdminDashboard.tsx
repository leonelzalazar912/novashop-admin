import { useEffect, useState } from "react";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminHeader } from "./components/AdminHeader";
import { StatCard } from "./components/StatCard";
import { RecentOrders } from "./components/RecentOrders";
import { LowStockProducts } from "./components/LowStockProducts";
import { ProductsPage } from "./ProductsPage";
import { useProducts } from "./hooks/useProducts";
import { useDashboard } from "./hooks/useDashboard";
import "./styles/admin.css";
import { CategoryChart } from "./components/CategoryChart";
import { InventoryPieChart } from "./components/InventoryPieChart";
import { NotificationPanel } from "./components/NotificationPanel";

type AdminSection = "dashboard" | "products";

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
  localStorage.setItem("visibleDashboardCards", JSON.stringify(visibleCards));
}, [visibleCards]);
  const [showDashboardSettings, setShowDashboardSettings] = useState(false);
  const dashboardCards = [
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

            <button
              className="primary-button"
              onClick={() => setShowDashboardSettings(true)}
            >
              ⚙️ Personalizar dashboard
            </button>

            <NotificationPanel
              alerts={dashboard.alerts}
              onActionClick={() => setSection("products")}
            />

            {showDashboardSettings && (
              <div className="modal-overlay" onClick={() => setShowDashboardSettings(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Personalizar dashboard</h2>

            {dashboardCards.map((card) => (
              <label key={card.id} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={visibleCards.includes(card.id)}
                  onChange={() => {
                setVisibleCards((prev) =>
                  prev.includes(card.id)
                    ? prev.filter((id) => id !== card.id)
                    : [...prev, card.id]
                );
              }}
            />
              {card.icon} {card.title}
          </label>
      ))}

      <button
        className="primary-button"
        onClick={() => setShowDashboardSettings(false)}
      >
        Listo
      </button>
    </div>
  </div>
)}

            <div className="stats-grid">
              {dashboardCards
                .filter((card) => visibleCards.includes(card.id))
                .map((card) => (
            <StatCard
              key={card.id}
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
            />
            ))}
            </div>

            <div className="dashboard-sections">
              <div className="charts-grid">
                <CategoryChart products={productsManager.products} />
                <InventoryPieChart products={productsManager.products} />
            </div>

            <div className="widgets-grid">
              <RecentOrders products={productsManager.products} />
              <LowStockProducts products={productsManager.products} />
            </div>
          </div>
        </>
      )}

            {section === "products" && (
              <ProductsPage productsManager={productsManager} />
      )}
      </main>
    </div>
  );
}