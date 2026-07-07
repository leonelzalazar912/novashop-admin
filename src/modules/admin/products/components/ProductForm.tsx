import { useEffect, useState } from "react";
import { useCategoriesData } from "../../hooks/useCategoriesData";
import { useBrandsData } from "../../hooks/useBrandsData";
import { useSuppliersData } from "../../hooks/useSuppliersData";

interface ProductFormProps {
  onCancel: () => void;
  onAddProduct: (product: {
    image: string;
    name: string;
    category: string;
    brand: string;
    supplier: string;
    price: number;
    stock: number;
  }) => void;
  initialProduct?: {
    image: string;
    name: string;
    category: string;
    brand: string;
    supplier: string;
    price: number;
    stock: number;
  };
}

export function ProductForm({
  onCancel,
  onAddProduct,
  initialProduct,
}: ProductFormProps) {
  const categories = useCategoriesData();
  const brands = useBrandsData();
  const suppliers = useSuppliersData();

  const [name, setName] = useState(initialProduct?.name ?? "");
  const [category, setCategory] = useState(initialProduct?.category ?? "");
  const [brand, setBrand] = useState(initialProduct?.brand ?? "");
  const [supplier, setSupplier] = useState(initialProduct?.supplier ?? "");
  const [price, setPrice] = useState(initialProduct?.price?.toString() ?? "");
  const [stock, setStock] = useState(initialProduct?.stock?.toString() ?? "");
  const [image, setImage] = useState(initialProduct?.image ?? "");
  const [preview, setPreview] = useState(initialProduct?.image ?? "");

  const isFormValid =
    name &&
    category &&
    brand &&
    supplier &&
    price &&
    stock;

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

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCancel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel]);

  return (
    <div
      className="modal-overlay"
      onClick={onCancel}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="product-form">
          <h2>
            {initialProduct ? "Editar producto" : "Nuevo producto"}
          </h2>

          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Seleccionar categoría</option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.name}
              >
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          >
            <option value="">Seleccionar marca</option>

            {brands.map((brand) => (
              <option
                key={brand.id}
                value={brand.name}
              >
                {brand.name}
              </option>
            ))}
          </select>

          <select
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
          >
            <option value="">Seleccionar proveedor</option>

            {suppliers.map((supplier) => (
              <option
                key={supplier.id}
                value={supplier.company}
              >
                {supplier.company}
              </option>
            ))}
          </select>

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
              disabled={!isFormValid}
              onClick={() => {
                if (!isFormValid) return;

                onAddProduct({
                  image: image || "🎮",
                  name,
                  category,
                  brand,
                  supplier,
                  price: Number(price),
                  stock: Number(stock),
                });
              }}
            >
              {initialProduct
                ? "Guardar cambios"
                : "Guardar"}
            </button>

            <button onClick={onCancel}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}