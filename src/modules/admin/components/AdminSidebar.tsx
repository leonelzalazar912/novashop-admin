const menuItems = [
  "Dashboard",
  "Productos",
  "Categorías",
  "Pedidos",
  "Clientes",
  "Configuración",
];

export function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <h2>NovaShop Admin</h2>

      <nav>
        {menuItems.map((item) => (
          <button key={item}>
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}