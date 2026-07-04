import { useEffect, useState } from "react";
import { products as initialProducts, type Product } from "./data/productsData";
import { ProductForm } from "./components/ProductForm";

export function ProductsPage() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>(() => {
  const savedProducts = localStorage.getItem("products");

  if (savedProducts) {
    return JSON.parse(savedProducts);
  }

  return initialProducts;
});

    function handleAddProduct(product: Omit<Product, "id">) {
        setProducts((prevProducts) => [
            ...prevProducts,
            {
            id: Date.now(),
            ...product,
            },
        ]);

  setShowForm(false);
}

function handleDeleteProduct(id: number) {
  const confirmDelete = window.confirm(
    "¿Estás seguro de que quieres eliminar este producto?"
  );

  if (!confirmDelete) return;

  setProducts((prevProducts) =>
    prevProducts.filter((product) => product.id !== id)
  );
}

  const [showForm, setShowForm] = useState(false);

  const filteredProducts = products.filter((product) =>
  product.name.toLowerCase().includes(search.toLowerCase())
);

useEffect(() => {
  localStorage.setItem("products", JSON.stringify(products));
}, [products]);

  return (
    <>
      <div className="products-header">
        <div>
          <h1>Productos</h1>
          <p>Administrá todos los productos de NovaShop.</p>
        </div>

        <button className="primary-button" onClick={() => setShowForm(true)}>
            + Nuevo producto
        </button>
      </div>

      <div className="products-toolbar">
        <span>{filteredProducts.length} productos encontrados</span>

        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

        {showForm && (
            <ProductForm
                onCancel={() => setShowForm(false)}
                onAddProduct={handleAddProduct}
            />
        )}

      <table className="products-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.image}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>${product.price.toLocaleString("es-AR")}</td>
              <td>{product.stock}</td>
              <td>
                <button>✏️</button>
                <button onClick={() => handleDeleteProduct(product.id)}>
                    🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}