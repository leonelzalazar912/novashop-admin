import type { Supplier } from "../data/suppliersData";
import { EmptyState } from "../../components/common/EmptyState";
import { useDataIntegrity } from "../../hooks/useDataIntegrity";

type SuppliersTableProps = {
  suppliers: Supplier[];
  onEditSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (id: number) => void;
  onToggleSupplierStatus: (id: number) => void;
};

export function SuppliersTable({
  suppliers,
  onEditSupplier,
  onDeleteSupplier,
  onToggleSupplierStatus,
}: SuppliersTableProps) {
  const { hasProductsBySupplier } = useDataIntegrity();

  return (
    <table className="products-table">
      <thead>
        <tr>
          <th>Empresa</th>
          <th>Tipo</th>
          <th>Contacto</th>
          <th>Ciudad</th>
          <th>Provincia</th>
          <th>CUIT</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {suppliers.length === 0 ? (
          <EmptyState message="No se encontraron proveedores." colSpan={8} />
        ) : (
          suppliers.map((supplier) => (
            <tr key={supplier.id}>
              <td><strong>{supplier.company}</strong></td>
              <td>{supplier.type}</td>
              <td>
                <div>{supplier.contact}</div>
                <small>{supplier.email}</small>
              </td>
              <td>{supplier.city || "-"}</td>
              <td>{supplier.province || "-"}</td>
              <td>{supplier.cuit || "-"}</td>
              <td>{supplier.active ? "🟢 Activo" : "🔴 Inactivo"}</td>

              <td>
                <button
                  className="action-button"
                  onClick={() => onEditSupplier(supplier)}
                  title="Editar"
                >
                  ✏️
                </button>

                <button
                  className="action-button"
                  onClick={() => {
                    if (hasProductsBySupplier(supplier.company)) {
                      alert(
                        `No se puede eliminar el proveedor "${supplier.company}" porque tiene productos asociados. Podés marcarlo como inactivo en su lugar.`
                      );
                      return;
                    }

                    const confirmed = window.confirm(
                      `¿Eliminar proveedor "${supplier.company}"?`
                    );

                    if (confirmed) {
                      onDeleteSupplier(supplier.id);
                    }
                  }}
                  title="Eliminar"
                >
                  🗑️
                </button>

                <button
                  className="action-button"
                  onClick={() => onToggleSupplierStatus(supplier.id)}
                  title={supplier.active ? "Desactivar proveedor" : "Activar proveedor"}
                >
                  {supplier.active ? "🚫" : "✅"}
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}