import { useEffect, useState } from "react";
import type {
  User,
  UserRole,
} from "../data/usersData";

type UserFormProps = {
  onCancel: () => void;
  onSave: (user: Omit<User, "id">) => void;
  initialUser?: User;
};

export function UserForm({
  onCancel,
  onSave,
  initialUser,
}: UserFormProps) {
  const [name, setName] = useState(
    initialUser?.name ?? ""
  );
  const [email, setEmail] = useState(
    initialUser?.email ?? ""
  );
  const [role, setRole] = useState<UserRole>(
    initialUser?.role ?? "Empleado"
  );
  const [active, setActive] = useState(
    initialUser?.active ?? true
  );

  const isFormValid =
    name.trim() !== "" &&
    email.trim() !== "";

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCancel();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onCancel]);

  return (
    <div
      className="modal-overlay"
      onClick={onCancel}
    >
      <div
        className="modal-content"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="product-form">
          <h2>
            {initialUser
              ? "Editar usuario"
              : "Nuevo usuario"}
          </h2>

          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
          />

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
          />

          <select
            value={role}
            onChange={(event) =>
              setRole(
                event.target.value as UserRole
              )
            }
          >
            <option value="Propietario">
              Propietario
            </option>
            <option value="Administrador">
              Administrador
            </option>
            <option value="Empleado">
              Empleado
            </option>
            <option value="Vendedor">
              Vendedor
            </option>
          </select>

          <label>
            <input
              type="checkbox"
              checked={active}
              onChange={(event) =>
                setActive(event.target.checked)
              }
            />
            Usuario activo
          </label>

          <div className="form-actions">
            <button
              type="button"
              className="primary-button"
              disabled={!isFormValid}
              onClick={() => {
                if (!isFormValid) return;

                onSave({
                  name: name.trim(),
                  email: email.trim(),
                  role,
                  active,
                });
              }}
            >
              {initialUser
                ? "Guardar cambios"
                : "Guardar"}
            </button>

            <button
              type="button"
              onClick={onCancel}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}