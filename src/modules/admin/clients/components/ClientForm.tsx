import { useEffect, useState } from "react";
import type { Client } from "../data/clientsData";

type ClientFormProps = {
  editingClient: Client | null;
  onAddClient: (
    name: string,
    email: string,
    phone: string,
    street: string,
    city: string
  ) => void;
  onUpdateClient: (
    id: string,
    name: string,
    email: string,
    phone: string,
    street: string,
    city: string
  ) => void;
  onCancelEdit: () => void;
};

export function ClientForm({
  editingClient,
  onAddClient,
  onUpdateClient,
  onCancelEdit,
}: ClientFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    if (editingClient) {
      setName(editingClient.name);
      setEmail(editingClient.email);
      setPhone(editingClient.phone);
      setStreet(editingClient.street);
      setCity(editingClient.city);
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setStreet("");
      setCity("");
    }
  }, [editingClient]);

  function clearForm() {
    setName("");
    setEmail("");
    setPhone("");
    setStreet("");
    setCity("");
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedStreet = street.trim();
    const trimmedCity = city.trim();

    if (
      !trimmedName ||
      !trimmedEmail ||
      !trimmedPhone ||
      !trimmedStreet ||
      !trimmedCity
    ) {
      return;
    }

    if (editingClient) {
      onUpdateClient(
        editingClient.id,
        trimmedName,
        trimmedEmail,
        trimmedPhone,
        trimmedStreet,
        trimmedCity
      );
    } else {
      onAddClient(
        trimmedName,
        trimmedEmail,
        trimmedPhone,
        trimmedStreet,
        trimmedCity
      );
    }

    clearForm();
  }

  function handleCancel() {
    clearForm();
    onCancelEdit();
  }

  return (
    <form
      className="product-form"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(event) =>
          setName(event.target.value)
        }
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) =>
          setEmail(event.target.value)
        }
      />

      <input
        type="text"
        placeholder="Teléfono"
        value={phone}
        onChange={(event) =>
          setPhone(event.target.value)
        }
      />

      <input
        type="text"
        placeholder="Calle / Dirección"
        value={street}
        onChange={(event) =>
          setStreet(event.target.value)
        }
      />

      <input
        type="text"
        placeholder="Ciudad"
        value={city}
        onChange={(event) =>
          setCity(event.target.value)
        }
      />

      <div className="form-actions">
        <button
          className="primary-button"
          type="submit"
        >
          {editingClient
            ? "Guardar cambios"
            : "Agregar cliente"}
        </button>

        {editingClient && (
          <button
            type="button"
            onClick={handleCancel}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}