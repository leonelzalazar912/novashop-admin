import { useEffect, useState } from "react";
import { useCategoriesData } from "../../hooks/useCategoriesData";
import { useBrandsData } from "../../hooks/useBrandsData";
import { useSuppliersData } from "../../hooks/useSuppliersData";
import type { AdminProduct } from "../../../../types/product";
import type { NewProductInput } from "../hooks/useProducts";

interface ProductFormProps {
  onCancel: () => void;
  onAddProduct: (product: NewProductInput) => void;
  initialProduct?: AdminProduct;
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
  const [categoryId, setCategoryId] = useState(initialProduct?.categoryId ?? "");
  const [brandId, setBrandId] = useState(initialProduct?.brandId ?? "");
  const [supplierId, setSupplierId] = useState(initialProduct?.supplier?.id ?? "");
  const [price, setPrice] = useState(initialProduct?.price?.toString() ?? "");
  const [stock, setStock] = useState(initialProduct?.stock?.toString() ?? "");
  const initialImageUrl = initialProduct?.images[0]?.url ?? "";
  const [image, setImage] = useState(initialImageUrl);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(initialImageUrl);
  const [published, setPublished] = useState(initialProduct?.published ?? false);

  const isFormValid =
    name &&
    categoryId &&
    brandId &&
    supplierId &&
    price &&
    stock;

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage("");
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
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

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

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
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Seleccionar categoría</option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
          >
            <option value="">Seleccionar marca</option>

            {brands.map((brand) => (
              <option
                key={brand.id}
                value={brand.id}
              >
                {brand.name}
              </option>
            ))}
          </select>

          <select
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
          >
            <option value="">Seleccionar proveedor</option>

            {suppliers.map((supplier) => (
              <option
                key={supplier.id}
                value={supplier.id}
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
              value={image}
              onChange={(e) => {
                setImage(e.target.value);
                setImageFile(null);
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

          <div className="form-group">
            <label>Estado de publicación</label>

            <div className="published-toggle">
              <button
                type="button"
                className={published ? "primary-button" : ""}
                onClick={() => setPublished(true)}
              >
                Publicado
              </button>

              <button
                type="button"
                className={!published ? "primary-button" : ""}
                onClick={() => setPublished(false)}
              >
                Borrador
              </button>
            </div>

            <small>
              {published
                ? "Visible para los clientes en la tienda pública."
                : "Oculto en la tienda pública hasta que lo publiques."}
            </small>
          </div>

          <div className="form-actions">
            <button
              className="primary-button"
              disabled={!isFormValid}
              onClick={() => {
                if (!isFormValid) return;

                onAddProduct({
                  name,
                  categoryId,
                  brandId,
                  supplierId,
                  price: Number(price),
                  stock: Number(stock),
                  published,
                  imageUrl: image,
                  imageFile,
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
