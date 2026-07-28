export type AdminSection =
  | "dashboard"
  | "products"
  | "categories"
  | "clients"
  | "suppliers"
  | "brands"
  | "orders"
  | "users"
  | "purchases";

type AdminSidebarProps = {
  onNavigate: (
    section: AdminSection
  ) => void;
  canManageUsers?: boolean;
  onGoStore?: () => void;
};

const menuItems: Array<{
  label: string;
  section: AdminSection;
}> = [
  {
    label: "Dashboard",
    section: "dashboard",
  },
  {
    label: "Productos",
    section: "products",
  },
  {
    label: "Categorías",
    section: "categories",
  },
  {
    label: "Clientes",
    section: "clients",
  },
  {
    label: "Proveedores",
    section: "suppliers",
  },
  {
    label: "Marcas",
    section: "brands",
  },
  {
    label: "Pedidos",
    section: "orders",
  },
  {
    label: "Usuarios",
    section: "users",
  },
  {
    label: "Compras",
    section: "purchases",
  },
];

export function AdminSidebar({
  onNavigate,
  canManageUsers = true,
  onGoStore,
}: AdminSidebarProps) {
  const visibleMenuItems =
    menuItems.filter(
      (item) =>
        item.section !== "users" ||
        canManageUsers
    );

  return (
    <aside className="admin-sidebar">
      <h2>NovaShop Admin</h2>

      <nav>
        {visibleMenuItems.map(
          (item) => (
            <button
              key={item.section}
              type="button"
              onClick={() =>
                onNavigate(
                  item.section
                )
              }
            >
              {item.label}
            </button>
          )
        )}
      </nav>

      {onGoStore && (
        <button
          type="button"
          className="admin-sidebar-store-link"
          onClick={onGoStore}
        >
          🛍️ Ver tienda
        </button>
      )}
    </aside>
  );
}