import type { Client } from "../data/clientsData";
import { EmptyState } from "../../components/common/EmptyState";

type ClientsTableProps = {
  clients: Client[];
  onEditClient: (client: Client) => void;
  onDeleteClient: (id: number) => void;
  onToggleClientStatus: (id: number) => void;
};

export function ClientsTable({
  clients,
  onEditClient,
  onDeleteClient,
  onToggleClientStatus,
}: ClientsTableProps) {
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
              {client.active ? "🟢 Activo" : "🔴 Inactivo"}
            </td>

            <td>
              <button
                className="action-button"
                onClick={() => onEditClient(client)}
              >
                ✏️
              </button>

              <button
                className="action-button"
                onClick={() => {
                  const confirmed = window.confirm(
                    `¿Eliminar el cliente "${client.name}"?`
                  );

                  if (confirmed) {
                    onDeleteClient(client.id);
                  }
                }}
              >
                🗑️
              </button>

              <button
                className="action-button"
                onClick={() =>
                  onToggleClientStatus(client.id)
                }
              >
                {client.active ? "Desactivar" : "Activar"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}