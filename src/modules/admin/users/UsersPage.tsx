import {
  useMemo,
  useState,
} from "react";
import type { User } from "./data/usersData";
import { useUsers } from "./hooks/useUsers";
import { UserForm } from "./components/UserForm";
import { UsersTable } from "./components/UsersTable";

export function UsersPage() {
  const {
    users,
    loading,
    loadError,
    reloadUsers,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
  } = useUsers();

  const [search, setSearch] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [
    editingUser,
    setEditingUser,
  ] = useState<User | undefined>();

  const [savingUser, setSavingUser] =
    useState(false);

  const pageIsBusy =
    loading || savingUser;

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    if (!normalizedSearch) {
      return users;
    }

    return users.filter((user) =>
      [
        user.name,
        user.email,
        user.role,
      ].some((value) =>
        value
          .toLowerCase()
          .includes(normalizedSearch)
      )
    );
  }, [users, search]);

  function handleCreateUser() {
    if (pageIsBusy || loadError) {
      return;
    }

    setEditingUser(undefined);
    setShowForm(true);
  }

  function handleEditUser(
    user: User
  ) {
    if (pageIsBusy) {
      return;
    }

    setEditingUser(user);
    setShowForm(true);
  }

  function handleCloseForm() {
    if (savingUser) {
      return;
    }

    setShowForm(false);
    setEditingUser(undefined);
  }

  async function handleSaveUser(
    userData: Omit<User, "id">
  ) {
    if (savingUser) {
      return;
    }

    setSavingUser(true);

    try {
      const result = editingUser
        ? await updateUser({
            ...userData,
            id: editingUser.id,
          })
        : await addUser(userData);

      if (!result.success) {
        alert(result.message);
        return;
      }

      setShowForm(false);
      setEditingUser(undefined);
    } catch (caughtError) {
      console.error(caughtError);

      alert(
        editingUser
          ? "Ocurrió un error inesperado al actualizar el usuario."
          : "Ocurrió un error inesperado al invitar al usuario."
      );
    } finally {
      setSavingUser(false);
    }
  }

  return (
    <section className="admin-page">
      <div className="page-header">
        <div>
          <h1>Usuarios</h1>

          <p>
            Administrá los usuarios y sus roles.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={handleCreateUser}
          disabled={
            pageIsBusy ||
            Boolean(loadError)
          }
        >
          + Nuevo usuario
        </button>
      </div>

      <input
        type="search"
        placeholder="Buscar por nombre, email o rol..."
        value={search}
        onChange={(event) =>
          setSearch(event.target.value)
        }
        disabled={
          pageIsBusy ||
          Boolean(loadError)
        }
      />

      {loading ? (
        <div
          role="status"
          aria-live="polite"
          style={{
            marginTop: 24,
            padding: 24,
            borderRadius: 12,
            background: "#1e293b",
          }}
        >
          Cargando usuarios...
        </div>
      ) : loadError ? (
        <div
          role="alert"
          style={{
            marginTop: 24,
            padding: 24,
            borderRadius: 12,
            background: "#1e293b",
          }}
        >
          <p
            style={{
              marginTop: 0,
              marginBottom: 16,
            }}
          >
            {loadError}
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={() => {
              void reloadUsers();
            }}
          >
            Reintentar
          </button>
        </div>
      ) : (
        <UsersTable
          users={filteredUsers}
          onEdit={handleEditUser}
          onDelete={deleteUser}
          onToggleStatus={
            toggleUserStatus
          }
        />
      )}

      {showForm && (
        <UserForm
          initialUser={editingUser}
          onCancel={handleCloseForm}
          onSave={(userData) => {
            void handleSaveUser(
              userData
            );
          }}
        />
      )}
    </section>
  );
}