import { useEffect, useState } from "react";
import { products as initialProducts, type Product } from "../data/productsData";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem("products");

    if (savedProducts) {
      return JSON.parse(savedProducts);
    }

    return initialProducts;
  });

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [sortBy, setSortBy] = useState<"name" | "price" | "stock">("name");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
  setCurrentPage(1);
}, [search, categoryFilter]);

  const filteredProducts = products
  .filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "Todas" || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  })
  .sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }

    return a[sortBy] - b[sortBy];
  });

const categories = [
    "Todas",
     ...new Set(products.map((product) => product.category)),
    ];

    const totalPages = Math.ceil(
        filteredProducts.length / productsPerPage
        );

const paginatedProducts = filteredProducts.slice(
  (currentPage - 1) * productsPerPage,
  currentPage * productsPerPage
);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
    }

  function handleAddProduct(product: Omit<Product, "id">) {
    setProducts((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...product,
      },
    ]);

    setShowForm(false);
    showToast("Producto creado correctamente");
  }

  function handleDeleteProduct(id: number) {
    if (!window.confirm("¿Eliminar este producto?")) return;

    setProducts((prev) => prev.filter((product) => product.id !== id));
    showToast("Producto eliminado");
  }

  function handleUpdateProduct(product: Product) {
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? product : p))
    );

    setEditingProduct(null);
    setShowForm(false);
    showToast("Producto actualizado");
  }

  function increaseProductStock(productId: number, quantity: number) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId
            ? {
                ...product,
                stock: product.stock + quantity,
              }
            : product
        )
      );

      showToast("Stock actualizado por la compra");
    }
    
  return {
    products,
    search,
    setSearch,
    showForm,
    setShowForm,
    editingProduct,
    setEditingProduct,    
    filteredProducts: paginatedProducts,
    handleAddProduct,
    handleDeleteProduct,
    handleUpdateProduct,
    increaseProductStock,
    toast,
    categoryFilter,
    setCategoryFilter,
    categories,
    currentPage,
    setCurrentPage,
    totalPages,
    sortBy,
    setSortBy,
  };
}