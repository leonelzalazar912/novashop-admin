import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import type {
  Supplier,
  SupplierType,
} from "../data/suppliersData";

type SupplierRow = {
  id: string;
  company: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  tax_id: string | null;
  website: string | null;
  notes: string | null;
  supplier_type:
    | "wholesaler"
    | "distributor"
    | "manufacturer"
    | "importer"
    | "other"
    | null;
  active: boolean;
};

function supplierTypeToDatabase(
  type: SupplierType
): SupplierRow["supplier_type"] {
  const types: Record<SupplierType, SupplierRow["supplier_type"]> = {
    Mayorista: "wholesaler",
    Distribuidor: "distributor",
    Fabricante: "manufacturer",
    Importador: "importer",
  };

  return types[type];
}

function supplierTypeFromDatabase(
  type: SupplierRow["supplier_type"]
): SupplierType {
  const types: Record<string, SupplierType> = {
    wholesaler: "Mayorista",
    distributor: "Distribuidor",
    manufacturer: "Fabricante",
    importer: "Importador",
    other: "Distribuidor",
  };

  return types[type ?? ""] ?? "Distribuidor";
}

function mapSupplier(row: SupplierRow): Supplier {
  return {
    id: row.id,
    company: row.company,
    contact: row.contact_name ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    address: row.address ?? "",
    city: row.city ?? "",
    province: row.province ?? "",
    cuit: row.tax_id ?? "",
    website: row.website ?? "",
    notes: row.notes ?? "",
    type: supplierTypeFromDatabase(row.supplier_type),
    active: row.active,
  };
}

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] =
    useState<"name" | "status">("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const itemsPerPage = 5;

  useEffect(() => {
    async function loadSuppliers() {
      setLoading(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("No hay una sesión iniciada.");
        setLoading(false);
        return;
      }

      const {
        data: membership,
        error: membershipError,
      } = await supabase
        .from("store_members")
        .select("store_id")
        .eq("user_id", user.id)
        .eq("active", true)
        .limit(1)
        .maybeSingle();

      if (membershipError || !membership) {
        console.error(membershipError);
        setError(
          "No se encontró una tienda asociada al usuario."
        );
        setLoading(false);
        return;
      }

      setStoreId(membership.store_id);

      const {
        data,
        error: suppliersError,
      } = await supabase
        .from("suppliers")
        .select(`
          id,
          company,
          contact_name,
          email,
          phone,
          address,
          city,
          province,
          tax_id,
          website,
          notes,
          supplier_type,
          active
        `)
        .eq("store_id", membership.store_id)
        .order("company");

      if (suppliersError) {
        console.error(suppliersError);
        setError("No se pudieron cargar los proveedores.");
        setLoading(false);
        return;
      }

      setSuppliers(
        (data as SupplierRow[]).map(mapSupplier)
      );

      setLoading(false);
    }

    void loadSuppliers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy]);

  async function addSupplier(
    supplier: Omit<Supplier, "id" | "active">
  ): Promise<boolean> {
    if (!storeId) {
      setError("No se encontró la tienda.");
      return false;
    }

    const cleanCompany = supplier.company.trim();

    const exists = suppliers.some(
      (item) =>
        item.company.toLowerCase() ===
        cleanCompany.toLowerCase()
    );

    if (exists) {
      setError("Ya existe un proveedor con ese nombre.");
      return false;
    }

    const {
      data,
      error: insertError,
    } = await supabase
      .from("suppliers")
      .insert({
        store_id: storeId,
        company: cleanCompany,
        contact_name: supplier.contact.trim() || null,
        email: supplier.email.trim() || null,
        phone: supplier.phone.trim() || null,
        address: supplier.address.trim() || null,
        city: supplier.city.trim() || null,
        province: supplier.province.trim() || null,
        tax_id: supplier.cuit.trim() || null,
        website: supplier.website.trim() || null,
        notes: supplier.notes.trim() || null,
        supplier_type: supplierTypeToDatabase(
          supplier.type
        ),
        active: true,
      })
      .select(`
        id,
        company,
        contact_name,
        email,
        phone,
        address,
        city,
        province,
        tax_id,
        website,
        notes,
        supplier_type,
        active
      `)
      .single();

    if (insertError) {
      console.error(insertError);
      setError("No se pudo crear el proveedor.");
      return false;
    }

    setSuppliers((previous) => [
      ...previous,
      mapSupplier(data as SupplierRow),
    ]);

    setError("");
    return true;
  }

  async function updateSupplier(
    updatedSupplier: Supplier
  ): Promise<boolean> {
    const cleanCompany =
      updatedSupplier.company.trim();

    const exists = suppliers.some(
      (supplier) =>
        supplier.id !== updatedSupplier.id &&
        supplier.company.toLowerCase() ===
          cleanCompany.toLowerCase()
    );

    if (exists) {
      setError("Ya existe un proveedor con ese nombre.");
      return false;
    }

    const { error: updateError } = await supabase
      .from("suppliers")
      .update({
        company: cleanCompany,
        contact_name:
          updatedSupplier.contact.trim() || null,
        email: updatedSupplier.email.trim() || null,
        phone: updatedSupplier.phone.trim() || null,
        address: updatedSupplier.address.trim() || null,
        city: updatedSupplier.city.trim() || null,
        province:
          updatedSupplier.province.trim() || null,
        tax_id: updatedSupplier.cuit.trim() || null,
        website:
          updatedSupplier.website.trim() || null,
        notes: updatedSupplier.notes.trim() || null,
        supplier_type: supplierTypeToDatabase(
          updatedSupplier.type
        ),
        active: updatedSupplier.active,
      })
      .eq("id", updatedSupplier.id);

    if (updateError) {
      console.error(updateError);
      setError("No se pudo actualizar el proveedor.");
      return false;
    }

    setSuppliers((previous) =>
      previous.map((supplier) =>
        supplier.id === updatedSupplier.id
          ? {
              ...updatedSupplier,
              company: cleanCompany,
              contact: updatedSupplier.contact.trim(),
              email: updatedSupplier.email.trim(),
              phone: updatedSupplier.phone.trim(),
              address: updatedSupplier.address.trim(),
              city: updatedSupplier.city.trim(),
              province:
                updatedSupplier.province.trim(),
              cuit: updatedSupplier.cuit.trim(),
              website:
                updatedSupplier.website.trim(),
              notes: updatedSupplier.notes.trim(),
            }
          : supplier
      )
    );

    setError("");
    return true;
  }

  async function deleteSupplier(id: string) {
    const { error: deleteError } = await supabase
      .from("suppliers")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error(deleteError);
      setError("No se pudo eliminar el proveedor.");
      return;
    }

    setSuppliers((previous) =>
      previous.filter(
        (supplier) => supplier.id !== id
      )
    );

    setError("");
  }

  async function toggleSupplierStatus(id: string) {
    const supplier = suppliers.find(
      (item) => item.id === id
    );

    if (!supplier) return;

    const newStatus = !supplier.active;

    const { error: updateError } = await supabase
      .from("suppliers")
      .update({ active: newStatus })
      .eq("id", id);

    if (updateError) {
      console.error(updateError);
      setError("No se pudo cambiar el estado.");
      return;
    }

    setSuppliers((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, active: newStatus }
          : item
      )
    );

    setError("");
  }

  const filteredSuppliers = useMemo(
    () =>
      [...suppliers]
        .filter((supplier) =>
          supplier.company
            .toLowerCase()
            .includes(search.toLowerCase())
        )
        .sort((a, b) => {
          if (sortBy === "name") {
            return a.company.localeCompare(b.company);
          }

          return Number(b.active) - Number(a.active);
        }),
    [suppliers, search, sortBy]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSuppliers.length / itemsPerPage)
  );

  const paginatedSuppliers =
    filteredSuppliers.slice(
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
    loading,
    error,
  };
}