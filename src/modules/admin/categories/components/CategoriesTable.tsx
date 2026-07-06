import type { Category } from "../data/categoriesData";
import { EmptyState } from "../../components/common/EmptyState";

type CategoriesTableProps = {
  categories: Category[];
  onDeleteCategory: (id: number) => void;
  onEditCategory: (category: Category) => void;
  onToggleCategoryStatus: (id: number) => void;
};

export function CategoriesTable({
  categories,
  onDeleteCategory,
  onEditCategory,
  onToggleCategoryStatus,
}: CategoriesTableProps) {
    
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
            <td>{category.active ? "Activa" : "Inactiva"}</td>

            <td>
                <button
                    className="action-button"
                    onClick={() => onEditCategory(category)}
                >
                    ✏️
                </button>

                <button
                    className="action-button"
                    onClick={() => onToggleCategoryStatus(category.id)}
                >
                    {category.active ? "⏸️" : "▶️"}
                </button>

                <button
                    className="action-button"
                    onClick={() => {
                        const confirmed = window.confirm(
                            `¿Eliminar la categoría "${category.name}"?`
                        );

                        if (confirmed) {
                            onDeleteCategory(category.id);
                        }
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