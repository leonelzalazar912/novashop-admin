import { ProductForm } from "./components/ProductForm";
import { ProductsTable } from "./components/ProductsTable";
import { ProductsToolbar } from "./components/ProductsToolbar";
import { useProducts } from "./hooks/useProducts";
import { Toast } from "./components/Toast";
import { Pagination } from "./components/Pagination";

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
    toast,
    categoryFilter , 
    setCategoryFilter,
    categories,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useProducts();

  return (
    <>
      <ProductsToolbar
        search={search}
        onSearchChange={setSearch}
        totalProducts={filteredProducts.length}
        onNewProduct={() => setShowForm(true)}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        categories={categories}
        sortBy={sortBy}
        onSortChange={setSortBy}
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        />

        <Toast message={toast} />
    </>
  );
}