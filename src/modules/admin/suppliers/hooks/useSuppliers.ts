import { useEffect, useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { initialSuppliers, type Supplier } from "../data/suppliersData";

export function useSuppliers() {
  const [suppliers, setSuppliers] = useLocalStorage<Supplier[]>(
    "suppliers",
    initialSuppliers
  );

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "status">("name");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy]);

  function addSupplier(supplier: Omit<Supplier, "id" | "active">): boolean {
    const exists = suppliers.some(
      (item) =>
        item.company.toLowerCase() === supplier.company.trim().toLowerCase()
    );

    if (exists) return false;

    const newSupplier: Supplier = {
      id: Date.now(),
      ...supplier,
      company: supplier.company.trim(),
      contact: supplier.contact.trim(),
      email: supplier.email.trim(),
      phone: supplier.phone.trim(),
      address: supplier.address.trim(),
      city: supplier.city.trim(),
      province: supplier.province.trim(),
      cuit: supplier.cuit.trim(),
      website: supplier.website.trim(),
      notes: supplier.notes.trim(),
      active: true,
    };

    setSuppliers((prev) => [...prev, newSupplier]);
    return true;
  }

  function updateSupplier(updatedSupplier: Supplier): boolean {
    const exists = suppliers.some(
      (supplier) =>
        supplier.id !== updatedSupplier.id &&
        supplier.company.toLowerCase() ===
          updatedSupplier.company.trim().toLowerCase()
    );

    if (exists) return false;

    setSuppliers((prev) =>
      prev.map((supplier) =>
        supplier.id === updatedSupplier.id
          ? {
              ...updatedSupplier,
              company: updatedSupplier.company.trim(),
              contact: updatedSupplier.contact.trim(),
              email: updatedSupplier.email.trim(),
              phone: updatedSupplier.phone.trim(),
              address: updatedSupplier.address.trim(),
              city: updatedSupplier.city.trim(),
              province: updatedSupplier.province.trim(),
              cuit: updatedSupplier.cuit.trim(),
              website: updatedSupplier.website.trim(),
              notes: updatedSupplier.notes.trim(),
            }
          : supplier
      )
    );

    return true;
  }

  function deleteSupplier(id: number) {
    setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
  }

  function toggleSupplierStatus(id: number) {
    setSuppliers((prev) =>
      prev.map((supplier) =>
        supplier.id === id
          ? { ...supplier, active: !supplier.active }
          : supplier
      )
    );
  }

  const filteredSuppliers = [...suppliers]
    .filter((supplier) =>
      supplier.company.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.company.localeCompare(b.company);
      }

      return Number(b.active) - Number(a.active);
    });

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeSuppliers = suppliers.filter(
    (supplier) => supplier.active
  );

  return {
    suppliers: paginatedSuppliers,
    activeSuppliers,
    search,
    setSearch,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    toggleSupplierStatus,
  };
}