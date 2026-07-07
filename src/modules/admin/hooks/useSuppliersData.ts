import { useMemo } from "react";
import {
  initialSuppliers,
  type Supplier,
} from "../suppliers/data/suppliersData";

export function useSuppliersData() {
  const suppliers = useMemo<Supplier[]>(() => {
    const stored = localStorage.getItem("suppliers");

    if (!stored) return initialSuppliers;

    try {
      return JSON.parse(stored);
    } catch {
      return initialSuppliers;
    }
  }, []);

  return suppliers.filter((supplier) => supplier.active);
}