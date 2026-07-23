import {
  useEffect,
  useState,
} from "react";
import type {
  User,
  UserRole,
} from "../data/usersData";

type UserFormProps = {
  onCancel: () => void;
  onSave: (
    user: Omit<User, "id">
  ) => void;
  initialUser?: User;
};

export function UserForm({
  onCancel,
  onSave,
  initialUser,
}: UserFormProps) {
  const isEditing =
    initialUser !== undefined;

  const [name, setName] =
    useState(
      initialUser?.name ?? ""
    );

  const [email, setEmail] =
    useState(
      initialUser?.email ?? ""
    );

  const [role, setRole] =
    useState<UserRole>(
      initialUser?.role ?? "Empleado"
    );

  const [active, setActive] =
    useState(
      initialUser?.active ?? true
    );

  const isFormValid =
    name.trim() !== "" &&
    email.trim() !== "";

  useEffect(() => {
    setName(initialUser?.name ?? "");
    setEmail(initialUser?.email ?? "");
    setRole(
      initialUser?.role ?? "Empleado"
    );
    setActive(
      initialUser?.active ?? true
    );
  }, [initialUser]);

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent
    ) {
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

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!isFormValid) {
      return;
    }

    onSave({
      name: name.trim(),
      email: email
        .trim()
        .toLowerCase(),
      role,
      active,
    });
  }

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
        <form
          className="product-form"
          onSubmit={handleSubmit}
        >
          <h2>
            {isEditing
              ? "Editar usuario"
              : "Invitar usuario"}
          </h2>

          {!isEditing && (
            <p>
              El usuario recibirá un correo
              para configurar su contraseña.
            </p>
          )}

          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            autoComplete="name"
            onChange={(event) =>
              setName(
                event.target.value
              )
            }
          />

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            autoComplete="email"
            readOnly={isEditing}
            aria-readonly={isEditing}
            title={
              isEditing
                ? "El correo todavía no puede modificarse desde esta pantalla."
                : undefined
            }
            style={
              isEditing
                ? {
                    opacity: 0.7,
                    cursor: "not-allowed",
                  }
                : undefined
            }
            onChange={(event) => {
              if (!isEditing) {
                setEmail(
                  event.target.value
                );
              }
            }}
          />

          {isEditing && (
            <small>
              El correo electrónico no puede
              modificarse por el momento.
            </small>
          )}

          <select
            value={role}
            onChange={(event) =>
              setRole(
                event.target
                  .value as UserRole
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
                setActive(
                  event.target.checked
                )
              }
            />

            Usuario activo
          </label>

          <div className="form-actions">
            <button
              type="submit"
              className="primary-button"
              disabled={!isFormValid}
            >
              {isEditing
                ? "Guardar cambios"
                : "Enviar invitación"}
            </button>

            <button
              type="button"
              onClick={onCancel}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}