type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
};

export function Pagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        disabled={currentPage === 1}
        onClick={onPrevious}
      >
        Anterior
      </button>

      <span>
        Página {currentPage} de {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={onNext}
      >
        Siguiente
      </button>
    </div>
  );
}