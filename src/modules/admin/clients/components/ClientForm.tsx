import { useEffect, useState } from "react";
import type { Client } from "../data/clientsData";

type ClientFormProps = {
  editingClient: Client | null;
  onAddClient: (
    name: string,
    email: string,
    phone: string,
    city: string
  ) => void;
  onUpdateClient: (
    id: number,
    name: string,
    email: string,
    phone: string,
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
  const [city, setCity] = useState("");

  useEffect(() => {
    if (editingClient) {
      setName(editingClient.name);
      setEmail(editingClient.email);
      setPhone(editingClient.phone);
      setCity(editingClient.city);
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setCity("");
    }
  }, [editingClient]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedCity = city.trim();

    if (
      !trimmedName ||
      !trimmedEmail ||
      !trimmedPhone ||
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
        trimmedCity
      );
    } else {
      onAddClient(
        trimmedName,
        trimmedEmail,
        trimmedPhone,
        trimmedCity
      );
    }

    setName("");
    setEmail("");
    setPhone("");
    setCity("");
  }

  function handleCancel() {
    setName("");
    setEmail("");
    setPhone("");
    setCity("");
    onCancelEdit();
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="text"
        placeholder="Teléfono"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        type="text"
        placeholder="Ciudad"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <div className="form-actions">
        <button className="primary-button" type="submit">
          {editingClient
            ? "Guardar cambios"
            : "Agregar cliente"}
        </button>

        {editingClient && (
          <button type="button" onClick={handleCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}