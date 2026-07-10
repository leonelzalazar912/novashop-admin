type PurchaseSummaryProps = {
  total: number;
};

export function PurchaseSummary({
  total,
}: PurchaseSummaryProps) {
  return (
    <div className="purchase-summary">
      <p>
        <strong>Total:</strong> $
        {total.toLocaleString("es-AR")}
      </p>
    </div>
  );
}