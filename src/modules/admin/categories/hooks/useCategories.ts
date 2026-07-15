import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import type { Category } from "../data/categoriesData";

type CategoryRow = {
  id: string;
  name: string;
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

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "status">("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const itemsPerPage = 5;

  useEffect(() => {
    async function loadCategories() {
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
        setError("No se encontró una tienda asociada al usuario.");
        setLoading(false);
        return;
      }

      setStoreId(membership.store_id);

      const { data, error: categoriesError } = await supabase
        .from("categories")
        .select("id, name, description, active")
        .eq("store_id", membership.store_id)
        .order("name");

      if (categoriesError) {
        console.error(categoriesError);
        setError("No se pudieron cargar las categorías.");
        setLoading(false);
        return;
      }

      const mappedCategories: Category[] = (data as CategoryRow[]).map(
        (category) => ({
          id: category.id,
          name: category.name,
          description: category.description ?? "",
          active: category.active,
        })
      );

      setCategories(mappedCategories);
      setLoading(false);
    }

    void loadCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy]);

  async function addCategory(name: string, description: string) {
    if (!storeId) return;

    const cleanName = name.trim();

    const categoryExists = categories.some(
      (category) =>
        category.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (categoryExists) {
      setError("Ya existe una categoría con ese nombre.");
      return;
    }

    const { data, error: insertError } = await supabase
      .from("categories")
      .insert({
        store_id: storeId,
        name: cleanName,
        slug: `${createSlug(cleanName)}-${Date.now()}`,
        description: description.trim(),
        active: true,
      })
      .select("id, name, description, active")
      .single();

    if (insertError) {
      console.error(insertError);
      setError("No se pudo crear la categoría.");
      return;
    }

    setCategories((previous) => [
      ...previous,
      {
        id: data.id,
        name: data.name,
        description: data.description ?? "",
        active: data.active,
      },
    ]);

    setError("");
  }

  async function deleteCategory(id: string) {
    const { error: deleteError } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error(deleteError);
      setError("No se pudo eliminar la categoría.");
      return;
    }

    setCategories((previous) =>
      previous.filter((category) => category.id !== id)
    );

    setError("");
  }

  async function updateCategory(
    id: string,
    name: string,
    description: string
  ) {
    const cleanName = name.trim();

    const categoryExists = categories.some(
      (category) =>
        category.id !== id &&
        category.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (categoryExists) {
      setError("Ya existe una categoría con ese nombre.");
      return;
    }

    const { error: updateError } = await supabase
      .from("categories")
      .update({
        name: cleanName,
        slug: `${createSlug(cleanName)}-${id.slice(0, 8)}`,
        description: description.trim(),
      })
      .eq("id", id);

    if (updateError) {
      console.error(updateError);
      setError("No se pudo actualizar la categoría.");
      return;
    }

    setCategories((previous) =>
      previous.map((category) =>
        category.id === id
          ? {
              ...category,
              name: cleanName,
              description: description.trim(),
            }
          : category
      )
    );

    setError("");
  }

  async function toggleCategoryStatus(id: string) {
    const category = categories.find((item) => item.id === id);

    if (!category) return;

    const newStatus = !category.active;

    const { error: updateError } = await supabase
      .from("categories")
      .update({ active: newStatus })
      .eq("id", id);

    if (updateError) {
      console.error(updateError);
      setError("No se pudo cambiar el estado.");
      return;
    }

    setCategories((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, active: newStatus } : item
      )
    );

    setError("");
  }

  const filteredCategories = useMemo(
    () =>
      [...categories]
        .filter((category) =>
          category.name.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
          if (sortBy === "name") {
            return a.name.localeCompare(b.name);
          }

          return Number(b.active) - Number(a.active);
        }),
    [categories, search, sortBy]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / itemsPerPage)
  );

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    categories: paginatedCategories,
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
    loading,
    error,
  };
}