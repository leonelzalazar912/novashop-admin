import { ProductForm } from "./components/ProductForm";
import { ProductsTable } from "./components/ProductsTable";
import { ProductsToolbar } from "./components/ProductsToolbar";
import { useProducts } from "./hooks/useProducts";

export function ProductsPage() {
  const {
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
  } = useProducts();

  return (
    <>
      <ProductsToolbar
        search={search}
        onSearchChange={setSearch}
        totalProducts={filteredProducts.length}
        onNewProduct={() => setShowForm(true)}
      />

      {(showForm || editingProduct) && (
        <ProductForm
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          onAddProduct={(product) => {
            if (editingProduct) {
              handleUpdateProduct({
                ...editingProduct,
                ...product,
              });
            } else {
              handleAddProduct(product);
            }
          }}
          initialProduct={editingProduct ?? undefined}
        />
      )}

      <ProductsTable
        products={filteredProducts}
        onEdit={setEditingProduct}
        onDelete={handleDeleteProduct}
      />
    </>
  );
}