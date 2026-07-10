import { useMemo, useState } from "react";
import type { User } from "./data/usersData";
import { useUsers } from "./hooks/useUsers";
import { UserForm } from "./components/UserForm";
import { UsersTable } from "./components/UsersTable";

export function UsersPage() {
  const {
    users,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
  } = useUsers();

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return users;

    return users.filter((user) =>
      [user.name, user.email, user.username, user.role].some((value) =>
        value.toLowerCase().includes(normalizedSearch)
      )
    );
  }, [users, search]);

  function handleCreateUser() {
    setEditingUser(undefined);
    setShowForm(true);
  }

  function handleEditUser(user: User) {
    setEditingUser(user);
    setShowForm(true);
  }

  function handleCloseForm() {
    setShowForm(false);
    setEditingUser(undefined);
  }

  return (
    <section className="admin-page">
      <div className="page-header">
        <div>
          <h1>Usuarios</h1>
          <p>Administrá los usuarios y sus roles.</p>
        </div>

        <button
          className="primary-button"
          onClick={handleCreateUser}
        >
          + Nuevo usuario
        </button>
      </div>

      <input
        type="search"
        placeholder="Buscar por nombre, email, usuario o rol..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <UsersTable
        users={filteredUsers}
        onEdit={handleEditUser}
        onDelete={deleteUser}
        onToggleStatus={toggleUserStatus}
      />

      {showForm && (
        <UserForm
          initialUser={editingUser}
          onCancel={handleCloseForm}
          onSave={(userData) => {
            const result = editingUser
              ? updateUser({
                ...userData,
                id: editingUser.id,
              })
            : addUser(userData);

          if (!result.success) {
            alert(result.message);
            return;
          }

          handleCloseForm();
        }}
        />
      )}
    </section>
  );
}