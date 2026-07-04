interface ProductsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  totalProducts: number;
  onNewProduct: () => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
  sortBy: "name" | "price" | "stock";
  onSortChange: (value: "name" | "price" | "stock") => void;
}

export function ProductsToolbar({
  search,
  onSearchChange,
  totalProducts,
  onNewProduct,
  categoryFilter,
  onCategoryChange,
  categories,
  sortBy,
  onSortChange,
}: ProductsToolbarProps) {
    
  return (
    <>
      <div className="products-header">
        <div>
          <h1>Productos</h1>
          <p>Administrá todos los productos de NovaShop.</p>
        </div>

        <button className="primary-button" onClick={onNewProduct}>
          + Nuevo producto
        </button>
      </div>

      <div className="products-toolbar">
  <span>{totalProducts} productos encontrados</span>

  <select
    value={categoryFilter}
    onChange={(e) => onCategoryChange(e.target.value)}
  >
    {categories.map((category) => (
      <option key={category} value={category}>
        {category}
      </option>
    ))}
  </select>

  <select
    value={sortBy}
    onChange={(e) =>
      onSortChange(e.target.value as "name" | "price" | "stock")
    }
  >
    <option value="name">Ordenar por Nombre</option>
    <option value="price">Ordenar por Precio</option>
    <option value="stock">Ordenar por Stock</option>
  </select>

  <input
    type="text"
    placeholder="Buscar producto..."
    value={search}
    onChange={(e) => onSearchChange(e.target.value)}
  />
</div>
    </>
  );
}