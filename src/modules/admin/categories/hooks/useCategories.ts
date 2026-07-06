import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useEffect, useState } from "react";
import {
  initialCategories,
  type Category,
} from "../data/categoriesData";

export function useCategories() {
  const [categories, setCategories] = useLocalStorage<Category[]>(
    "categories",
    initialCategories
  );

  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState<"name" | "status">("name");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
    
    useEffect(() => {
        setCurrentPage(1);
        }, [search, sortBy]);    

  function addCategory(name: string, description: string) {
    const categoryExists = categories.some(
        (category) =>
            category.name.toLowerCase() === name.trim().toLowerCase()
        );

        if (categoryExists) return;
    const newCategory: Category = {
      id: Date.now(),
      name: name.trim(),
      description: description.trim(),
      active: true,
    };

    setCategories((prev) => [...prev, newCategory]);
  }

  function deleteCategory(id: number) {
    setCategories((prev) =>
      prev.filter((category) => category.id !== id)
    );
  }

  function updateCategory(
    id: number,
    name: string,
    description: string
  ) {
    const categoryExists = categories.some(
        (category) =>
            category.id !== id &&
            category.name.toLowerCase() === name.trim().toLowerCase()
        );

    if (categoryExists) return;

    setCategories((prev) =>
      prev.map((category) =>
        category.id === id
          ? {
              ...category,
              name: name.trim(),
              description: description.trim(),
            }
          : category
      )
    );
  }

  function toggleCategoryStatus(id: number) {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === id
          ? { ...category, active: !category.active }
          : category
      )
    );
  }

  const filteredCategories = [...categories]
    .filter((category) =>
        category.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
        if (sortBy === "name") {
            return a.name.localeCompare(b.name);
        }

        if (sortBy === "status") {
            return Number(b.active) - Number(a.active);
        }

        return 0;
    });

   const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

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
  };
}