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
    const [image, setImage] = useState(initialProduct?.image ?? "");
    const [preview, setPreview] = useState(initialProduct?.image ?? "");

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onloadend = () => {
        const imageBase64 = reader.result as string;
            setImage(imageBase64);
            setPreview(imageBase64);
    };

        reader.readAsDataURL(file);
    }

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

      <div className="form-group">
  <label>Imagen (URL o archivo)</label>

  <input
    type="text"
    placeholder="https://..."
    value={image.startsWith("data:") ? "" : image}
    onChange={(e) => {
      setImage(e.target.value);
      setPreview(e.target.value);
    }}
  />

  <input
    type="file"
    accept="image/*"
    onChange={handleImageChange}
  />

  {preview && (
    <img
      className="image-preview"
      src={preview}
      alt="Vista previa"
    />
  )}
</div>

      <div className="form-actions">
        <button
        className="primary-button"
        onClick={() => {
            if (!name || !category || !price || !stock) {
            alert("Completá todos los campos");
            return;
            }

            onAddProduct({
                image: image || "🎮",
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