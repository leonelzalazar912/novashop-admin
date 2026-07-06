import { useEffect, useState } from "react";
import { useCategories } from "./hooks/useCategories";
import { CategoriesTable } from "./components/CategoriesTable";
import { CategoryForm } from "./components/CategoryForm";
import type { Category } from "./data/categoriesData";
import { Toolbar } from "./components/common/Toolbar";
import { Message } from "./components/common/Message";
import { Pagination } from "./components/common/Pagination";

export function CategoriesPage() {
  const {
    categories,
    search,
    setSearch,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
    addCategory,
    deleteCategory,
    updateCategory,
    toggleCategoryStatus,
  } = useCategories();

  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  function handleAddCategory(name: string, description: string) {
    addCategory(name, description);
    setMessage("Categoría creada correctamente.");
  }

  function handleDeleteCategory(id: number) {
    deleteCategory(id);
    setMessage("Categoría eliminada correctamente.");
  }

  function handleUpdateCategory(
    id: number,
    name: string,
    description: string
  ) {
    updateCategory(id, name, description);
    setEditingCategory(null);
    setMessage("Categoría actualizada correctamente.");
  }

  return (
    <div>
      <div className="products-header">
        <div>
          <h1>Categorías</h1>
          <p>Administrá las categorías de tus productos.</p>
        </div>
      </div>

      <p>Total de categorías: {categories.length}</p>

      <Message message={message} />

      <Toolbar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        searchPlaceholder="Buscar categoría..."
      />

      <CategoryForm
        editingCategory={editingCategory}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onCancelEdit={() => setEditingCategory(null)}
      />

      <CategoriesTable
        categories={categories}
        onDeleteCategory={handleDeleteCategory}
        onEditCategory={setEditingCategory}
        onToggleCategoryStatus={toggleCategoryStatus}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={() => setCurrentPage(currentPage - 1)}
        onNext={() => setCurrentPage(currentPage + 1)}
      />
    </div>
  );
}