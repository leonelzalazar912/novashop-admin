type PurchasesFiltersProps = {
  search: string;
  supplierFilter: string;
  statusFilter: string;
  dateFrom: string;
  dateTo: string;
  suppliers: string[];
  onSearchChange: (value: string) => void;
  onSupplierChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onClear: () => void;
  sortBy: string;
  onSortChange: (value: string) => void;
};

export function PurchasesFilters({
  search,
  supplierFilter,
  statusFilter,
  dateFrom,
  dateTo,
  suppliers,
  onSearchChange,
  onSupplierChange,
  onStatusChange,
  onDateFromChange,
  onDateToChange,
  onClear,
  sortBy,
  onSortChange,
}: PurchasesFiltersProps) {
  return (
    <div className="filters-card">
      <div className="purchases-filters">
        <div>
          <label htmlFor="purchase-search">
            Buscar compras
          </label>

          <input
            id="purchase-search"
            className="purchase-search-input"
            type="text"
            placeholder="Buscar por número o proveedor..."
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
          />
        </div>

        <div>
          <label htmlFor="supplier-filter">
            Proveedor
          </label>

          <select
            id="supplier-filter"
            className="purchase-search-input"
            value={supplierFilter}
            onChange={(event) =>
              onSupplierChange(event.target.value)
            }
          >
            {suppliers.map((supplier) => (
              <option key={supplier} value={supplier}>
                {supplier}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status-filter">
            Estado
          </label>

          <select
            id="status-filter"
            className="purchase-search-input"
            value={statusFilter}
            onChange={(event) =>
              onStatusChange(event.target.value)
            }
          >
            <option value="Todos">Todos</option>
            <option value="Completada">Completada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>

        <div>
          <label htmlFor="date-from">
            Desde
          </label>

          <input
            id="date-from"
            className="purchase-search-input"
            type="date"
            value={dateFrom}
            onChange={(event) =>
              onDateFromChange(event.target.value)
            }
          />
        </div>

        <div>
          <label htmlFor="date-to">
            Hasta
          </label>

          <input
            id="date-to"
            className="purchase-search-input"
            type="date"
            value={dateTo}
            min={dateFrom}
            onChange={(event) =>
              onDateToChange(event.target.value)
            }
          />
        </div>

        <div>
            <label htmlFor="sort-by">
                Ordenar por
            </label>

            <select
                id="sort-by"
                className="purchase-search-input"
                value={sortBy}
                onChange={(event) =>
                onSortChange(event.target.value)
                }
            >
                <option value="date-desc">Fecha: más reciente</option>
                <option value="date-asc">Fecha: más antigua</option>
                <option value="total-desc">Importe: mayor a menor</option>
                <option value="total-asc">Importe: menor a mayor</option>
                <option value="number-desc">Número: mayor a menor</option>
                <option value="number-asc">Número: menor a mayor</option>
            </select>
            </div>

        <div className="filters-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onClear}
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  );
}