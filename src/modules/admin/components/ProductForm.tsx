import { useState } from "react";

interface ProductFormProps {
  onCancel: () => void;
}

export function ProductForm({ onCancel }: ProductFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  return (
    <div className="product-form">
      <h2>Nuevo producto</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Categoría"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <input
        type="number"
        placeholder="Precio"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />

      <div className="form-actions">
        <button className="primary-button">
          Guardar
        </button>

        <button onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
}