type ToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: "name" | "status") => void;
  searchPlaceholder?: string;
};

export function Toolbar({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  searchPlaceholder = "Buscar...",
}: ToolbarProps) {
  return (
    <div className="products-toolbar">
      <input
        type="text"
        placeholder={searchPlaceholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <select
        value={sortBy}
        onChange={(e) =>
            onSortChange(e.target.value as "name" | "status")
        }
      >
        <option value="name">Ordenar por nombre</option>
        <option value="status">Ordenar por estado</option>
      </select>
    </div>
  );
}