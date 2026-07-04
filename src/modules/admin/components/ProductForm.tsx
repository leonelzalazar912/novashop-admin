import { useState } from "react";

interface ProductFormProps {
  onCancel: () => void;
  onAddProduct: (product: {
    image: string;
    name: string;
    category: string;
    price: number;
    stock: number;
  }) => void;
  initialProduct?: {
    image: string;
    name: string;
    category: string;
    price: number;
    stock: number;
  };
}

    export function ProductForm({
    onCancel,
    onAddProduct,
    initialProduct,
    }: ProductFormProps) {
    const [name, setName] = useState(initialProduct?.name ?? "");
    const [category, setCategory] = useState(initialProduct?.category ?? "");
    const [price, setPrice] = useState(initialProduct?.price?.toString() ?? "");
    const [stock, setStock] = useState(initialProduct?.stock?.toString() ?? "");

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
        <button
        className="primary-button"
        onClick={() => {
            if (!name || !category || !price || !stock) {
            alert("Completá todos los campos");
            return;
            }

            onAddProduct({
            image: "🎮",
            name,
            category,
            price: Number(price),
            stock: Number(stock),
            });
        }}
        >
        Guardar
        </button>

        <button onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
}