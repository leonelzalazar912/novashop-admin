import { useEffect, useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { initialBrands, type Brand } from "../data/brandsData";

export function useBrands() {
  const [brands, setBrands] = useLocalStorage<Brand[]>(
    "brands",
    initialBrands
  );

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "status">("name");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy]);

  function addBrand(brand: Omit<Brand, "id" | "active">): boolean {
    const exists = brands.some(
      (item) => item.name.toLowerCase() === brand.name.trim().toLowerCase()
    );

    if (exists) return false;

    setBrands((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...brand,
        name: brand.name.trim(),
        country: brand.country.trim(),
        website: brand.website.trim(),
        description: brand.description.trim(),
        active: true,
      },
    ]);

    return true;
  }

  function updateBrand(updatedBrand: Brand): boolean {
    const exists = brands.some(
      (brand) =>
        brand.id !== updatedBrand.id &&
        brand.name.toLowerCase() === updatedBrand.name.trim().toLowerCase()
    );

    if (exists) return false;

    setBrands((prev) =>
      prev.map((brand) =>
        brand.id === updatedBrand.id ? updatedBrand : brand
      )
    );

    return true;
  }

  function deleteBrand(id: number) {
    setBrands((prev) => prev.filter((brand) => brand.id !== id));
  }

  function toggleBrandStatus(id: number) {
    setBrands((prev) =>
      prev.map((brand) =>
        brand.id === id ? { ...brand, active: !brand.active } : brand
      )
    );
  }

  const filteredBrands = [...brands]
    .filter((brand) =>
      brand.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return Number(b.active) - Number(a.active);
    });

  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);

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
  };
}