import { useState } from "react";
import type { User } from "../data/usersData";
import type { UserValidationResult } from "../hooks/useUsers";
import { EmptyState } from "../../components/common/EmptyState";

type UserActionResult =
  | UserValidationResult
  | Promise<UserValidationResult>;

type PendingAction = {
  userId: string;
  type: "delete" | "toggle";
};

type UsersTableProps = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => UserActionResult;
  onToggleStatus: (
    id: string
  ) => UserActionResult;
};

export function UsersTable({
  users,
  onEdit,
  onDelete,
  onToggleStatus,
}: UsersTableProps) {
  const [pendingAction, setPendingAction] =
    useState<PendingAction | null>(null);

  const hasPendingAction =
    pendingAction !== null;

  function isPending(
    userId: string,
    type: PendingAction["type"]
  ) {
    return (
      pendingAction?.userId === userId &&
      pendingAction.type === type
    );
  }

  async function handleDelete(
    user: User
  ) {
    if (hasPendingAction) {
      return;
    }

    const confirmed = window.confirm(
      `¿Quitar de la tienda a "${user.name}"? La cuenta de acceso no será eliminada.`
    );

    if (!confirmed) {
      return;
    }

    setPendingAction({
      userId: user.id,
      type: "delete",
    });

    try {
      const result = await onDelete(
        user.id
      );

      if (!result.success) {
        alert(result.message);
      }
    } catch (caughtError) {
      console.error(caughtError);

      alert(
        "Ocurrió un error inesperado al quitar el usuario."
      );
    } finally {
      setPendingAction(null);
    }
  }

  async function handleToggleStatus(
    user: User
  ) {
    if (hasPendingAction) {
      return;
    }

    setPendingAction({
      userId: user.id,
      type: "toggle",
    });

    try {
      const result =
        await onToggleStatus(user.id);

      if (!result.success) {
        alert(result.message);
      }
    } catch (caughtError) {
      console.error(caughtError);

      alert(
        user.active
          ? "Ocurrió un error inesperado al desactivar el usuario."
          : "Ocurrió un error inesperado al activar el usuario."
      );
    } finally {
      setPendingAction(null);
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
          users.map((user) => {
            const deletingUser =
              isPending(
                user.id,
                "delete"
              );

            const togglingUser =
              isPending(
                user.id,
                "toggle"
              );

            return (
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
                    onClick={() =>
                      onEdit(user)
                    }
                    title="Editar"
                    disabled={
                      hasPendingAction
                    }
                  >
                    ✏️
                  </button>

                  <button
                    type="button"
                    className="action-button"
                    onClick={() =>
                      void handleDelete(
                        user
                      )
                    }
                    title="Quitar de la tienda"
                    disabled={
                      hasPendingAction
                    }
                  >
                    {deletingUser
                      ? "⏳"
                      : "🗑️"}
                  </button>

                  <button
                    type="button"
                    className="action-button"
                    onClick={() =>
                      void handleToggleStatus(
                        user
                      )
                    }
                    title={
                      user.active
                        ? "Desactivar"
                        : "Activar"
                    }
                    disabled={
                      hasPendingAction
                    }
                  >
                    {togglingUser
                      ? "⏳"
                      : user.active
                        ? "🚫"
                        : "✅"}
                  </button>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}