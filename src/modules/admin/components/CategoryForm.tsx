import { useEffect, useState } from "react";
import type { Category } from "../data/categoriesData";

type CategoryFormProps = {
  editingCategory: Category | null;
  onAddCategory: (name: string, description: string) => void;
  onUpdateCategory: (
    id: number,
    name: string,
    description: string
  ) => void;
  onCancelEdit: () => void;
};

export function CategoryForm({
  editingCategory,
  onAddCategory,
  onUpdateCategory,
  onCancelEdit,
}: CategoryFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setDescription(editingCategory.description);
    } else {
      setName("");
      setDescription("");
    }
  }, [editingCategory]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName || !trimmedDescription) return;

    if (editingCategory) {
      onUpdateCategory(
        editingCategory.id,
        trimmedName,
        trimmedDescription
      );
    } else {
      onAddCategory(trimmedName, trimmedDescription);
    }

    setName("");
    setDescription("");
  }

  function handleCancel() {
    setName("");
    setDescription("");
    onCancelEdit();
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre de la categoría"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="form-actions">
        <button className="primary-button" type="submit">
          {editingCategory
            ? "Guardar cambios"
            : "Agregar categoría"}
        </button>

        {editingCategory && (
          <button type="button" onClick={handleCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}