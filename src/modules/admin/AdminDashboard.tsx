import {
  useEffect,
  useState,
} from "react";
import {
  AdminSidebar,
  type AdminSection,
} from "./components/AdminSidebar";
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
import { BrandsPage } from "./brands/BrandsPage";
import { OrdersPage } from "./orders/OrdersPage";
import { UsersPage } from "./users/UsersPage";
import { PurchasesPage } from "./purchases/PurchasesPage";
import { loadUsers } from "./users/services/usersService";

export function AdminDashboard() {
  const [section, setSection] =
    useState<AdminSection>("dashboard");

  const [
    canManageUsers,
    setCanManageUsers,
  ] = useState(false);

  const [
    usersPermissionResolved,
    setUsersPermissionResolved,
  ] = useState(false);

  const productsManager = useProducts();

  const dashboard = useDashboard(
    productsManager.products
  );

  const [
    visibleCards,
    setVisibleCards,
  ] = useState<string[]>(() => {
    const savedCards =
      localStorage.getItem(
        "visibleDashboardCards"
      );

    if (savedCards) {
      try {
        return JSON.parse(
          savedCards
        ) as string[];
      } catch {
        // Se utilizará la configuración predeterminada.
      }
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

  const [
    showDashboardSettings,
    setShowDashboardSettings,
  ] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkUsersPermission() {
      const result = await loadUsers();

      if (cancelled) {
        return;
      }

      setCanManageUsers(
        result.success
      );

      setUsersPermissionResolved(
        true
      );
    }

    void checkUsersPermission();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "visibleDashboardCards",
      JSON.stringify(visibleCards)
    );
  }, [visibleCards]);

  useEffect(() => {
    if (
      usersPermissionResolved &&
      !canManageUsers &&
      section === "users"
    ) {
      setSection("dashboard");
    }
  }, [
    canManageUsers,
    usersPermissionResolved,
    section,
  ]);

  function handleNavigate(
    nextSection: AdminSection
  ) {
    if (
      nextSection === "users" &&
      !canManageUsers
    ) {
      setSection("dashboard");
      return;
    }

    setSection(nextSection);
  }

  const dashboardCards: DashboardCard[] = [
    {
      id: "products",
      title: "Productos",
      value:
        dashboard.totalProducts.toString(),
      icon: "📦",
      color: "blue",
    },
    {
      id: "lowStock",
      title: "Stock bajo",
      value:
        dashboard.lowStockProducts.toString(),
      icon: "⚠️",
      color: "orange",
    },
    {
      id: "inventory",
      title: "Inventario",
      value: `$${dashboard.totalInventoryValue.toLocaleString(
        "es-AR"
      )}`,
      icon: "💰",
      color: "green",
    },
    {
      id: "categories",
      title: "Categorías",
      value:
        dashboard.totalCategories.toString(),
      icon: "🏷️",
      color: "purple",
    },
    {
      id: "units",
      title: "Unidades",
      value:
        dashboard.totalUnits.toString(),
      icon: "📦",
      color: "blue",
    },
    {
      id: "averagePrice",
      title: "Precio promedio",
      value: `$${dashboard.averagePrice.toLocaleString(
        "es-AR"
      )}`,
      icon: "💲",
      color: "green",
    },
    {
      id: "highestStock",
      title: "Mayor stock",
      value:
        dashboard.highestStockProduct
          ?.name ?? "Sin datos",
      icon: "🏆",
      color: "purple",
    },
    {
      id: "mostExpensive",
      title: "Producto más caro",
      value:
        dashboard.mostExpensiveProduct
          ?.name ?? "Sin datos",
      icon: "💎",
      color: "orange",
    },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar
        onNavigate={handleNavigate}
        canManageUsers={
          canManageUsers
        }
      />

      <main className="admin-content">
        {section === "dashboard" && (
          <>
            <AdminHeader />

            <DashboardToolbar
              onCustomize={() =>
                setShowDashboardSettings(
                  true
                )
              }
            />

            <NotificationPanel
              alerts={dashboard.alerts}
              onActionClick={() =>
                setSection("products")
              }
            />

            {showDashboardSettings && (
              <DashboardSettingsModal
                cards={dashboardCards}
                visibleCards={
                  visibleCards
                }
                onToggleCard={(id) =>
                  setVisibleCards(
                    (previousCards) =>
                      previousCards.includes(
                        id
                      )
                        ? previousCards.filter(
                            (cardId) =>
                              cardId !== id
                          )
                        : [
                            ...previousCards,
                            id,
                          ]
                  )
                }
                onClose={() =>
                  setShowDashboardSettings(
                    false
                  )
                }
              />
            )}

            <DashboardStats
              cards={dashboardCards}
              visibleCards={
                visibleCards
              }
            />

            <div className="dashboard-sections">
              <DashboardCharts
                products={
                  productsManager.products
                }
              />

              <DashboardWidgets
                products={
                  productsManager.products
                }
              />
            </div>
          </>
        )}

        {section === "products" && (
          <ProductsPage
            productsManager={
              productsManager
            }
          />
        )}

        {section === "categories" && (
          <CategoriesPage />
        )}

        {section === "clients" && (
          <ClientsPage />
        )}

        {section === "suppliers" && (
          <SuppliersPage />
        )}

        {section === "brands" && (
          <BrandsPage />
        )}

        {section === "orders" && (
          <OrdersPage />
        )}

        {section === "users" &&
          canManageUsers && (
            <UsersPage />
          )}

        {section === "purchases" && (
          <PurchasesPage
            products={
              productsManager.products
            }
            increaseProductStock={
              productsManager
                .increaseProductStock
            }
            decreaseProductStock={
              productsManager
                .decreaseProductStock
            }
          />
        )}
      </main>
    </div>
  );
}