import { useEffect, useState } from "react";
import { SupplierForm } from "./components/SupplierForm";
import { SuppliersTable } from "./components/SuppliersTable";
import { useSuppliers } from "./hooks/useSuppliers";
import type { Supplier } from "./data/suppliersData";

import { Message } from "../components/common/Message";
import { Toolbar } from "../components/common/Toolbar";
import { Pagination } from "../components/common/Pagination";

export function SuppliersPage() {
  const {
    suppliers,
    search,
    setSearch,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
    addSupplier,
    deleteSupplier,
    updateSupplier,
    toggleSupplierStatus,
  } = useSuppliers();

  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  function handleAddSupplier(supplier: Omit<Supplier, "id" | "active">) {
    const success = addSupplier(supplier);

    setMessage(
      success
        ? "Proveedor creado correctamente."
        : "Ya existe un proveedor con ese nombre."
    );
  }

  function handleUpdateSupplier(supplier: Supplier) {
    const success = updateSupplier(supplier);

    if (!success) {
      setMessage("Ya existe un proveedor con ese nombre.");
      return;
    }

    setEditingSupplier(null);
    setMessage("Proveedor actualizado correctamente.");
  }

  function handleDeleteSupplier(id: number) {
    deleteSupplier(id);
    setMessage("Proveedor eliminado correctamente.");
  }

  function handleToggleSupplierStatus(id: number) {
    toggleSupplierStatus(id);
    setMessage("Estado del proveedor actualizado.");
  }

  return (
    <div>
      <div className="products-header">
        <div>
          <h1>Proveedores</h1>
          <p>Administrá los proveedores de NovaShop.</p>
        </div>
      </div>

      <Message message={message} />

      <Toolbar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        searchPlaceholder="Buscar proveedor..."
      />

      <SupplierForm
        editingSupplier={editingSupplier}
        onAddSupplier={handleAddSupplier}
        onUpdateSupplier={handleUpdateSupplier}
        onCancelEdit={() => setEditingSupplier(null)}
      />

      <SuppliersTable
        suppliers={suppliers}
        onEditSupplier={setEditingSupplier}
        onDeleteSupplier={handleDeleteSupplier}
        onToggleSupplierStatus={handleToggleSupplierStatus}
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