import type { Brand } from "../data/brandsData";
import { EmptyState } from "../../components/common/EmptyState";
import { useDataIntegrity } from "../../hooks/useDataIntegrity";

type BrandsTableProps = {
  brands: Brand[];
  onEditBrand: (brand: Brand) => void;
  onDeleteBrand: (id: string) => void;
  onToggleBrandStatus: (id: string) => void;
};

export function BrandsTable({
  brands,
  onEditBrand,
  onDeleteBrand,
  onToggleBrandStatus,
}: BrandsTableProps) {
  const { hasProductsByBrand } = useDataIntegrity();

  async function handleDelete(brand: Brand) {
    try {
      const hasProducts = await hasProductsByBrand(
        brand.id
      );

      if (hasProducts) {
        alert(
          `No se puede eliminar la marca "${brand.name}" porque tiene productos asociados. Podés marcarla como inactiva en su lugar.`
        );
        return;
      }

      const confirmed = window.confirm(
        `¿Eliminar la marca "${brand.name}"?`
      );

      if (confirmed) {
        onDeleteBrand(brand.id);
      }
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "No se pudo comprobar la marca."
      );
    }
  }

  return (
    <table className="products-table">
      <thead>
        <tr>
          <th>Marca</th>
          <th>País</th>
          <th>Sitio web</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {brands.length === 0 ? (
          <EmptyState
            message="No se encontraron marcas."
            colSpan={5}
          />
        ) : (
          brands.map((brand) => (
            <tr key={brand.id}>
              <td>
                <strong>{brand.name}</strong>
                <br />
                <small>{brand.description}</small>
              </td>

              <td>{brand.country}</td>
              <td>{brand.website || "-"}</td>
              <td>
                {brand.active
                  ? "🟢 Activa"
                  : "🔴 Inactiva"}
              </td>

              <td>
                <button
                  type="button"
                  className="action-button"
                  onClick={() => onEditBrand(brand)}
                >
                  ✏️
                </button>

                <button
                  type="button"
                  className="action-button"
                  onClick={() => {
                    void handleDelete(brand);
                  }}
                >
                  🗑️
                </button>

                <button
                  type="button"
                  className="action-button"
                  onClick={() =>
                    onToggleBrandStatus(brand.id)
                  }
                >
                  {brand.active ? "🚫" : "✅"}
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}