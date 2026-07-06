import { useEffect, useState } from "react";
import type { Brand } from "../data/brandsData";

type BrandFormProps = {
  editingBrand: Brand | null;
  onAddBrand: (brand: Omit<Brand, "id" | "active">) => void;
  onUpdateBrand: (brand: Brand) => void;
  onCancelEdit: () => void;
};

export function BrandForm({
  editingBrand,
  onAddBrand,
  onUpdateBrand,
  onCancelEdit,
}: BrandFormProps) {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingBrand) {
      setName(editingBrand.name);
      setCountry(editingBrand.country);
      setWebsite(editingBrand.website);
      setDescription(editingBrand.description);
    } else {
      clearForm();
    }
  }, [editingBrand]);

  function clearForm() {
    setName("");
    setCountry("");
    setWebsite("");
    setDescription("");
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const brand = {
      name: name.trim(),
      country: country.trim(),
      website: website.trim(),
      description: description.trim(),
    };

    if (!brand.name || !brand.country) {
      setError("Nombre y país son obligatorios.");
      return;
    }

    if (editingBrand) {
      onUpdateBrand({
        ...editingBrand,
        ...brand,
      });
    } else {
      onAddBrand(brand);
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
        placeholder="Nombre de la marca"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="País"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />

      <input
        placeholder="Sitio web"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />

      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      />

      <div className="form-actions">
        <button className="primary-button" type="submit">
          {editingBrand ? "Guardar cambios" : "Agregar marca"}
        </button>

        {editingBrand && (
          <button type="button" onClick={handleCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}