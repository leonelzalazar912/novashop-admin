import type { Supplier } from "../data/suppliersData";
import { EmptyState } from "../../components/common/EmptyState";
import { useDataIntegrity } from "../../hooks/useDataIntegrity";

type SuppliersTableProps = {
  suppliers: Supplier[];
  onEditSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (id: string) => void;
  onToggleSupplierStatus: (id: string) => void;
};

export function SuppliersTable({
  suppliers,
  onEditSupplier,
  onDeleteSupplier,
  onToggleSupplierStatus,
}: SuppliersTableProps) {
  const { hasProductsBySupplier } =
    useDataIntegrity();

  async function handleDelete(
    supplier: Supplier
  ) {
    try {
      const hasProducts =
        await hasProductsBySupplier(supplier.id);

      if (hasProducts) {
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
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "No se pudo comprobar el proveedor."
      );
    }
  }

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
          <EmptyState
            message="No se encontraron proveedores."
            colSpan={8}
          />
        ) : (
          suppliers.map((supplier) => (
            <tr key={supplier.id}>
              <td>
                <strong>{supplier.company}</strong>
              </td>

              <td>{supplier.type}</td>

              <td>
                <div>{supplier.contact}</div>
                <small>{supplier.email}</small>
              </td>

              <td>{supplier.city || "-"}</td>
              <td>{supplier.province || "-"}</td>
              <td>{supplier.cuit || "-"}</td>

              <td>
                {supplier.active
                  ? "🟢 Activo"
                  : "🔴 Inactivo"}
              </td>

              <td>
                <button
                  type="button"
                  className="action-button"
                  onClick={() =>
                    onEditSupplier(supplier)
                  }
                  title="Editar"
                >
                  ✏️
                </button>

                <button
                  type="button"
                  className="action-button"
                  onClick={() => {
                    void handleDelete(supplier);
                  }}
                  title="Eliminar"
                >
                  🗑️
                </button>

                <button
                  type="button"
                  className="action-button"
                  onClick={() =>
                    onToggleSupplierStatus(
                      supplier.id
                    )
                  }
                  title={
                    supplier.active
                      ? "Desactivar proveedor"
                      : "Activar proveedor"
                  }
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