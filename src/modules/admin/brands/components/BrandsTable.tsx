import type { Brand } from "../data/brandsData";
import { EmptyState } from "../../components/common/EmptyState";
import { useDataIntegrity } from "../../hooks/useDataIntegrity";

type BrandsTableProps = {
  brands: Brand[];
  onEditBrand: (brand: Brand) => void;
  onDeleteBrand: (id: number) => void;
  onToggleBrandStatus: (id: number) => void;
};

export function BrandsTable({
  brands,
  onEditBrand,
  onDeleteBrand,
  onToggleBrandStatus,
}: BrandsTableProps) {
  const { hasProductsByBrand } = useDataIntegrity();

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
          <EmptyState message="No se encontraron marcas." colSpan={5} />
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
              <td>{brand.active ? "🟢 Activa" : "🔴 Inactiva"}</td>

              <td>
                <button className="action-button" onClick={() => onEditBrand(brand)}>
                  ✏️
                </button>

                <button
                  className="action-button"
                  onClick={() => {
                    if (hasProductsByBrand(brand.name)) {
                      alert(
                        `No se puede eliminar la marca "${brand.name}" porque tiene productos asociados. Podés marcarla como inactiva en su lugar.`
                      );
                      return;
                    }

                    if (window.confirm(`¿Eliminar la marca "${brand.name}"?`)) {
                      onDeleteBrand(brand.id);
                    }
                  }}
                >
                  🗑️
                </button>

                <button
                  className="action-button"
                  onClick={() => onToggleBrandStatus(brand.id)}
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