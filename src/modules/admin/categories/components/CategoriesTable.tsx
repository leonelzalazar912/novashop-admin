import type { Category } from "../data/categoriesData";
import { EmptyState } from "../../components/common/EmptyState";
import { useDataIntegrity } from "../../hooks/useDataIntegrity";

type CategoriesTableProps = {
  categories: Category[];
  onDeleteCategory: (id: string) => void;
  onEditCategory: (category: Category) => void;
  onToggleCategoryStatus: (id: string) => void;
};

export function CategoriesTable({
  categories,
  onDeleteCategory,
  onEditCategory,
  onToggleCategoryStatus,
}: CategoriesTableProps) {
  const { hasProductsByCategory } =
    useDataIntegrity();

  async function handleDelete(
    category: Category
  ) {
    try {
      const hasProducts =
        await hasProductsByCategory(category.id);

      if (hasProducts) {
        alert(
          `No se puede eliminar la categoría "${category.name}" porque tiene productos asociados. Podés marcarla como inactiva en su lugar.`
        );
        return;
      }

      const confirmed = window.confirm(
        `¿Eliminar la categoría "${category.name}"?`
      );

      if (confirmed) {
        onDeleteCategory(category.id);
      }
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "No se pudo comprobar la categoría."
      );
    }
  }

  return (
    <table className="products-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {categories.length === 0 && (
          <EmptyState
            message="No se encontraron categorías."
            colSpan={4}
          />
        )}

        {categories.map((category) => (
          <tr key={category.id}>
            <td>{category.name}</td>
            <td>{category.description}</td>
            <td>
              {category.active
                ? "Activa"
                : "Inactiva"}
            </td>

            <td>
              <button
                type="button"
                className="action-button"
                onClick={() =>
                  onEditCategory(category)
                }
              >
                ✏️
              </button>

              <button
                type="button"
                className="action-button"
                onClick={() =>
                  onToggleCategoryStatus(
                    category.id
                  )
                }
              >
                {category.active ? "⏸️" : "▶️"}
              </button>

              <button
                type="button"
                className="action-button"
                onClick={() => {
                  void handleDelete(category);
                }}
              >
                🗑️
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}