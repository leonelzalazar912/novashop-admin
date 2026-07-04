import { useState } from "react";
import { products } from "./data/productsData";
import { ProductForm } from "./components/ProductForm";

export function ProductsPage() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

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
            <ProductForm onCancel={() => setShowForm(false)} />
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
                <button>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}