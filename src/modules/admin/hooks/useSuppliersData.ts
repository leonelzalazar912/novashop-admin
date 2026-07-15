import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import type {
  Supplier,
  SupplierType,
} from "../suppliers/data/suppliersData";

function convertType(type: string | null): SupplierType {
  const types: Record<string, SupplierType> = {
    wholesaler: "Mayorista",
    distributor: "Distribuidor",
    manufacturer: "Fabricante",
    importer: "Importador",
  };

  return types[type ?? ""] ?? "Distribuidor";
}

export function useSuppliersData() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    async function loadSuppliers() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: membership } = await supabase
        .from("store_members")
        .select("store_id")
        .eq("user_id", user.id)
        .eq("active", true)
        .limit(1)
        .maybeSingle();

      if (!membership) return;

      const { data, error } = await supabase
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
        .eq("active", true)
        .order("company");

      if (error) {
        console.error(error);
        return;
      }

      setSuppliers(
        (data ?? []).map((supplier) => ({
          id: supplier.id,
          company: supplier.company,
          contact: supplier.contact_name ?? "",
          email: supplier.email ?? "",
          phone: supplier.phone ?? "",
          address: supplier.address ?? "",
          city: supplier.city ?? "",
          province: supplier.province ?? "",
          cuit: supplier.tax_id ?? "",
          website: supplier.website ?? "",
          notes: supplier.notes ?? "",
          type: convertType(supplier.supplier_type),
          active: supplier.active,
        }))
      );
    }

    void loadSuppliers();
  }, []);

  return suppliers;
}