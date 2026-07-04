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
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
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

    
  return {
    search,
    setSearch,
    showForm,
    setShowForm,
    editingProduct,
    setEditingProduct,
    filteredProducts,
    handleAddProduct,
    handleDeleteProduct,
    handleUpdateProduct,
    toast,
  };
}