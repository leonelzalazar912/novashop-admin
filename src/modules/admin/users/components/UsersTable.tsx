import type { User } from "../data/usersData";
import { EmptyState } from "../../components/common/EmptyState";

type UsersTableProps = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
};

export function UsersTable({
  users,
  onEdit,
  onDelete,
  onToggleStatus,
}: UsersTableProps) {
  return (
    <table className="products-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Usuario</th>
          <th>Rol</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {users.length === 0 ? (
          <EmptyState
            message="No se encontraron usuarios."
            colSpan={6}
          />
        ) : (
          users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>

              <td>{user.email}</td>

              <td>{user.username}</td>

              <td>{user.role}</td>

              <td>
                {user.active ? "🟢 Activo" : "🔴 Inactivo"}
              </td>

              <td>
                <button
                  className="action-button"
                  onClick={() => onEdit(user)}
                >
                  ✏️
                </button>

                <button
                  className="action-button"
                  onClick={() => {
                    if (
                      window.confirm(
                        `¿Eliminar el usuario "${user.name}"?`
                      )
                    ) {
                      onDelete(user.id);
                    }
                  }}
                >
                  🗑️
                </button>

                <button
                  className="action-button"
                  onClick={() => onToggleStatus(user.id)}
                >
                  {user.active ? "🚫" : "✅"}
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}