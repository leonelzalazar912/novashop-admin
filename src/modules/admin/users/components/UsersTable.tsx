import type { User } from "../data/usersData";
import type { UserValidationResult } from "../hooks/useUsers";
import { EmptyState } from "../../components/common/EmptyState";

type UsersTableProps = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => UserValidationResult;
  onToggleStatus: (
    id: string
  ) => UserValidationResult;
};

export function UsersTable({
  users,
  onEdit,
  onDelete,
  onToggleStatus,
}: UsersTableProps) {
  function handleDelete(user: User) {
    const confirmed = window.confirm(
      `¿Eliminar el usuario "${user.name}"?`
    );

    if (!confirmed) return;

    const result = onDelete(user.id);

    if (!result.success) {
      alert(result.message);
    }
  }

  function handleToggleStatus(user: User) {
    const result = onToggleStatus(user.id);

    if (!result.success) {
      alert(result.message);
    }
  }

  return (
    <table className="products-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {users.length === 0 ? (
          <EmptyState
            message="No se encontraron usuarios."
            colSpan={5}
          />
        ) : (
          users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>

              <td>
                {user.active
                  ? "🟢 Activo"
                  : "🔴 Inactivo"}
              </td>

              <td>
                <button
                  type="button"
                  className="action-button"
                  onClick={() => onEdit(user)}
                  title="Editar"
                >
                  ✏️
                </button>

                <button
                  type="button"
                  className="action-button"
                  onClick={() =>
                    handleDelete(user)
                  }
                  title="Eliminar"
                >
                  🗑️
                </button>

                <button
                  type="button"
                  className="action-button"
                  onClick={() =>
                    handleToggleStatus(user)
                  }
                  title={
                    user.active
                      ? "Desactivar"
                      : "Activar"
                  }
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