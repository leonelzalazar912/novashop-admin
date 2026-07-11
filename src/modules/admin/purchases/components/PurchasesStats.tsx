import type { Purchase } from "../data/purchasesData";

type PurchasesStatsProps = {
  purchases: Purchase[];
};

export function PurchasesStats({
  purchases,
}: PurchasesStatsProps) {
  const completedPurchases = purchases.filter(
    (purchase) => purchase.status === "Completada"
  );

  const totalAmount = completedPurchases.reduce(
    (sum, purchase) => sum + purchase.total,
    0
  );

  const totalProducts = completedPurchases.reduce(
    (sum, purchase) =>
      sum +
      purchase.items.reduce(
        (itemSum, item) => itemSum + item.quantity,
        0
      ),
    0
  );

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <span>Compras</span>
        <strong>{purchases.length}</strong>
      </div>

      <div className="stat-card">
        <span>Importe comprado</span>
        <strong>
          ${totalAmount.toLocaleString("es-AR")}
        </strong>
      </div>

      <div className="stat-card">
        <span>Productos adquiridos</span>
        <strong>{totalProducts}</strong>
      </div>

      <div className="stat-card">
        <span>Ticket promedio</span>

        <strong>
          $
          {(
            completedPurchases.length
              ? totalAmount / completedPurchases.length
              : 0
          ).toLocaleString("es-AR", {
            maximumFractionDigits: 0,
          })}
        </strong>
      </div>
    </div>
  );
}