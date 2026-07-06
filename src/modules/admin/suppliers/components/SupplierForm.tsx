import { useEffect, useState } from "react";
import type { Supplier, SupplierType } from "../data/suppliersData";

type SupplierFormProps = {
  editingSupplier: Supplier | null;
  onAddSupplier: (supplier: Omit<Supplier, "id" | "active">) => void;
  onUpdateSupplier: (supplier: Supplier) => void;
  onCancelEdit: () => void;
};

const supplierTypes: SupplierType[] = [
  "Mayorista",
  "Distribuidor",
  "Fabricante",
  "Importador",
];

export function SupplierForm({
  editingSupplier,
  onAddSupplier,
  onUpdateSupplier,
  onCancelEdit,
}: SupplierFormProps) {
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [cuit, setCuit] = useState("");
  const [website, setWebsite] = useState("");
  const [notes, setNotes] = useState("");
  const [type, setType] = useState<SupplierType>("Mayorista");

  const [error, setError] = useState("");

  useEffect(() => {
    if (editingSupplier) {
      setCompany(editingSupplier.company);
      setContact(editingSupplier.contact);
      setEmail(editingSupplier.email);
      setPhone(editingSupplier.phone);
      setAddress(editingSupplier.address);
      setCity(editingSupplier.city);
      setProvince(editingSupplier.province);
      setCuit(editingSupplier.cuit);
      setWebsite(editingSupplier.website);
      setNotes(editingSupplier.notes);
      setType(editingSupplier.type);
    } else {
      clearForm();
    }
  }, [editingSupplier]);

  function clearForm() {
    setCompany("");
    setContact("");
    setEmail("");
    setPhone("");
    setAddress("");
    setCity("");
    setProvince("");
    setCuit("");
    setWebsite("");
    setNotes("");
    setType("Mayorista");
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const supplier = {
      company: company.trim(),
      contact: contact.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      province: province.trim(),
      cuit: cuit.trim(),
      website: website.trim(),
      notes: notes.trim(),
      type,
    };

    if (
      !supplier.company ||
      !supplier.contact ||
      !supplier.email ||
      !supplier.phone ||
      !supplier.address
    ) {
      setError("Completá todos los campos obligatorios.");
      return;
    }

    if (!supplier.email.includes("@")) {
      setError("Ingresá un email válido.");
      return;
    }

    if (supplier.phone.length < 6) {
      setError("El teléfono es demasiado corto.");
      return;
    }

    if (editingSupplier) {
      onUpdateSupplier({
        ...editingSupplier,
        ...supplier,
      });
    } else {
      onAddSupplier(supplier);
    }

    clearForm();
  }

  function handleCancel() {
    clearForm();
    onCancelEdit();
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      {error && <p className="error-message">{error}</p>}

      <input
        placeholder="Empresa *"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <input
        placeholder="Contacto *"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email *"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Teléfono *"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        placeholder="Dirección *"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <input
        placeholder="Ciudad"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <input
        placeholder="Provincia"
        value={province}
        onChange={(e) => setProvince(e.target.value)}
      />

      <input
        placeholder="CUIT"
        value={cuit}
        onChange={(e) => setCuit(e.target.value)}
      />

      <input
        placeholder="Sitio web"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value as SupplierType)}
      >
        {supplierTypes.map((supplierType) => (
          <option key={supplierType} value={supplierType}>
            {supplierType}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Escribí observaciones sobre el proveedor..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
      />

      <div className="form-actions">
        <button className="primary-button" type="submit">
          {editingSupplier ? "Guardar cambios" : "Agregar proveedor"}
        </button>

        {editingSupplier && (
          <button type="button" onClick={handleCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}