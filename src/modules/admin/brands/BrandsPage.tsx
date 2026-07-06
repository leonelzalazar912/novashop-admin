import { useEffect, useState } from "react";
import type { Brand } from "./data/brandsData";
import { useBrands } from "./hooks/useBrands";

import { BrandForm } from "./components/BrandForm";
import { BrandsTable } from "./components/BrandsTable";

import { Message } from "../components/common/Message";
import { Pagination } from "../components/common/Pagination";
import { Toolbar } from "../components/common/Toolbar";

export function BrandsPage() {
  const {
    brands,
    search,
    setSearch,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
    addBrand,
    updateBrand,
    deleteBrand,
    toggleBrandStatus,
  } = useBrands();

  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => setMessage(""), 3000);

    return () => clearTimeout(timer);
  }, [message]);

  function handleAddBrand(brand: Omit<Brand, "id" | "active">) {
    const success = addBrand(brand);

    setMessage(
      success
        ? "Marca agregada correctamente."
        : "Ya existe una marca con ese nombre."
    );
  }

  function handleUpdateBrand(brand: Brand) {
    const success = updateBrand(brand);

    if (!success) {
      setMessage("Ya existe una marca con ese nombre.");
      return;
    }

    setEditingBrand(null);
    setMessage("Marca actualizada correctamente.");
  }

  function handleDeleteBrand(id: number) {
    deleteBrand(id);
    setMessage("Marca eliminada correctamente.");
  }

  function handleToggleBrandStatus(id: number) {
    toggleBrandStatus(id);
    setMessage("Estado actualizado.");
  }

  return (
    <div>
      <div className="products-header">
        <div>
          <h1>Marcas</h1>
          <p>Administrá las marcas de tus productos.</p>
        </div>
      </div>

      <Message message={message} />

      <Toolbar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        searchPlaceholder="Buscar marca..."
      />

      <BrandForm
        editingBrand={editingBrand}
        onAddBrand={handleAddBrand}
        onUpdateBrand={handleUpdateBrand}
        onCancelEdit={() => setEditingBrand(null)}
      />

      <BrandsTable
        brands={brands}
        onEditBrand={setEditingBrand}
        onDeleteBrand={handleDeleteBrand}
        onToggleBrandStatus={handleToggleBrandStatus}
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