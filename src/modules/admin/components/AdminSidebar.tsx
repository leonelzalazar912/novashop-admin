type AdminSidebarProps = {
  onNavigate: (section: "dashboard" | "products") => void;
};

const menuItems = [
  { label: "Dashboard", section: "dashboard" },
  { label: "Productos", section: "products" },
] as const;

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  return (
    <aside className="admin-sidebar">
      <h2>NovaShop Admin</h2>

      <nav>
        {menuItems.map((item) => (
          <button key={item.section} onClick={() => onNavigate(item.section)}>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}