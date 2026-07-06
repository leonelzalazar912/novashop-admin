type AdminSection =
  | "dashboard"
  | "products"
  | "categories"
  | "clients"
  | "suppliers"
  | "brands";

type AdminSidebarProps = {
  onNavigate: (section: AdminSection) => void;
};

const menuItems = [
  { label: "Dashboard", section: "dashboard" },
  { label: "Productos", section: "products" },
  { label: "Categorías", section: "categories" },
  { label: "Clientes", section: "clients" },
  { label: "Proveedores", section: "suppliers" },
  { label: "Marcas", section: "brands" },
] as const;

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  return (
    <aside className="admin-sidebar">
      <h2>NovaShop Admin</h2>

      <nav>
        {menuItems.map((item) => (
          <button
            key={item.section}
            onClick={() => onNavigate(item.section)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}