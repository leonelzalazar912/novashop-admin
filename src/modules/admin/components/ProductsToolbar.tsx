interface ProductsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  totalProducts: number;
  onNewProduct: () => void;
}

export function ProductsToolbar({
  search,
  onSearchChange,
  totalProducts,
  onNewProduct,
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