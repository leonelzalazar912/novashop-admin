import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import type { Brand } from "../data/brandsData";

type BrandRow = {
  id: string;
  name: string;
  country: string | null;
  website: string | null;
  description: string | null;
  active: boolean;
};

function createSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "status">("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const itemsPerPage = 5;

  useEffect(() => {
    async function loadBrands() {
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

      const { data: membership, error: membershipError } = await supabase
        .from("store_members")
        .select("store_id")
        .eq("user_id", user.id)
        .eq("active", true)
        .limit(1)
        .maybeSingle();

      if (membershipError || !membership) {
        console.error(membershipError);
        setError("No se encontró una tienda asociada al usuario.");
        setLoading(false);
        return;
      }

      setStoreId(membership.store_id);

      const { data, error: brandsError } = await supabase
        .from("brands")
        .select("id, name, country, website, description, active")
        .eq("store_id", membership.store_id)
        .order("name");

      if (brandsError) {
        console.error(brandsError);
        setError("No se pudieron cargar las marcas.");
        setLoading(false);
        return;
      }

      const mappedBrands: Brand[] = (data as BrandRow[]).map((brand) => ({
        id: brand.id,
        name: brand.name,
        country: brand.country ?? "",
        website: brand.website ?? "",
        description: brand.description ?? "",
        active: brand.active,
      }));

      setBrands(mappedBrands);
      setLoading(false);
    }

    void loadBrands();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy]);

  async function addBrand(
    brand: Omit<Brand, "id" | "active">
  ): Promise<boolean> {
    if (!storeId) {
      setError("No se encontró la tienda.");
      return false;
    }

    const cleanName = brand.name.trim();

    const exists = brands.some(
      (item) => item.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (exists) {
      setError("Ya existe una marca con ese nombre.");
      return false;
    }

    const { data, error: insertError } = await supabase
      .from("brands")
      .insert({
        store_id: storeId,
        name: cleanName,
        slug: `${createSlug(cleanName)}-${Date.now()}`,
        country: brand.country.trim() || null,
        website: brand.website.trim() || null,
        description: brand.description.trim() || null,
        active: true,
      })
      .select("id, name, country, website, description, active")
      .single();

    if (insertError) {
      console.error(insertError);
      setError("No se pudo crear la marca.");
      return false;
    }

    setBrands((previous) => [
      ...previous,
      {
        id: data.id,
        name: data.name,
        country: data.country ?? "",
        website: data.website ?? "",
        description: data.description ?? "",
        active: data.active,
      },
    ]);

    setError("");
    return true;
  }

  async function updateBrand(updatedBrand: Brand): Promise<boolean> {
    const cleanName = updatedBrand.name.trim();

    const exists = brands.some(
      (brand) =>
        brand.id !== updatedBrand.id &&
        brand.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (exists) {
      setError("Ya existe una marca con ese nombre.");
      return false;
    }

    const { error: updateError } = await supabase
      .from("brands")
      .update({
        name: cleanName,
        slug: `${createSlug(cleanName)}-${updatedBrand.id.slice(0, 8)}`,
        country: updatedBrand.country.trim() || null,
        website: updatedBrand.website.trim() || null,
        description: updatedBrand.description.trim() || null,
        active: updatedBrand.active,
      })
      .eq("id", updatedBrand.id);

    if (updateError) {
      console.error(updateError);
      setError("No se pudo actualizar la marca.");
      return false;
    }

    setBrands((previous) =>
      previous.map((brand) =>
        brand.id === updatedBrand.id
          ? {
              ...updatedBrand,
              name: cleanName,
              country: updatedBrand.country.trim(),
              website: updatedBrand.website.trim(),
              description: updatedBrand.description.trim(),
            }
          : brand
      )
    );

    setError("");
    return true;
  }

  async function deleteBrand(id: string) {
    const { error: deleteError } = await supabase
      .from("brands")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error(deleteError);
      setError("No se pudo eliminar la marca.");
      return;
    }

    setBrands((previous) =>
      previous.filter((brand) => brand.id !== id)
    );

    setError("");
  }

  async function toggleBrandStatus(id: string) {
    const brand = brands.find((item) => item.id === id);

    if (!brand) return;

    const newStatus = !brand.active;

    const { error: updateError } = await supabase
      .from("brands")
      .update({ active: newStatus })
      .eq("id", id);

    if (updateError) {
      console.error(updateError);
      setError("No se pudo cambiar el estado.");
      return;
    }

    setBrands((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, active: newStatus } : item
      )
    );

    setError("");
  }

  const filteredBrands = useMemo(
    () =>
      [...brands]
        .filter((brand) =>
          brand.name.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
          if (sortBy === "name") {
            return a.name.localeCompare(b.name);
          }

          return Number(b.active) - Number(a.active);
        }),
    [brands, search, sortBy]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBrands.length / itemsPerPage)
  );

  const paginatedBrands = filteredBrands.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    brands: paginatedBrands,
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
    loading,
    error,
  };
}