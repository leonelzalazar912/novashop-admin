export function AdminHeader() {
  const today = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="admin-header">
      <div>
        <h1>Dashboard</h1>
        <p>Bienvenida al panel de administración de NovaShop.</p>
      </div>

      <div className="admin-user">
        <span>Administrador</span>
        <small>{today}</small>
      </div>
    </header>
  );
}