type AdminSection =
  | "dashboard"
  | "products"
  | "categories"
  | "clients"
  | "suppliers"
  | "brands"
  | "orders"
  | "users";


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
  { label: "Pedidos", section: "orders" },
  { label: "Usuarios", section: "users" },

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