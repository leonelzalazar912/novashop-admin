import type { Client } from "../data/clientsData";
import { EmptyState } from "../../components/common/EmptyState";
import { useDataIntegrity } from "../../hooks/useDataIntegrity";

type ClientsTableProps = {
  clients: Client[];
  onEditClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
  onToggleClientStatus: (id: string) => void;
};

export function ClientsTable({
  clients,
  onEditClient,
  onDeleteClient,
  onToggleClientStatus,
}: ClientsTableProps) {
  const { hasOrdersByClient } = useDataIntegrity();

  async function handleDelete(client: Client) {
    try {
      const hasOrders = await hasOrdersByClient(
        client.id
      );

      if (hasOrders) {
        alert(
          `No se puede eliminar el cliente "${client.name}" porque tiene uno o más pedidos asociados. Podés marcarlo como inactivo en su lugar.`
        );
        return;
      }

      const confirmed = window.confirm(
        `¿Eliminar el cliente "${client.name}"?`
      );

      if (confirmed) {
        onDeleteClient(client.id);
      }
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "No se pudo comprobar la integridad del cliente."
      );
    }
  }

  return (
    <table className="products-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th>Ciudad</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {clients.length === 0 && (
          <EmptyState
            message="No se encontraron clientes."
            colSpan={6}
          />
        )}

        {clients.map((client) => (
          <tr key={client.id}>
            <td>{client.name}</td>
            <td>{client.email}</td>
            <td>{client.phone}</td>
            <td>{client.city}</td>

            <td>
              {client.active
                ? "🟢 Activo"
                : "🔴 Inactivo"}
            </td>

            <td>
              <button
                type="button"
                className="action-button"
                onClick={() => onEditClient(client)}
              >
                ✏️
              </button>

              <button
                type="button"
                className="action-button"
                onClick={() => {
                  void handleDelete(client);
                }}
              >
                🗑️
              </button>

              <button
                type="button"
                className="action-button"
                onClick={() =>
                  onToggleClientStatus(client.id)
                }
              >
                {client.active
                  ? "Desactivar"
                  : "Activar"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}