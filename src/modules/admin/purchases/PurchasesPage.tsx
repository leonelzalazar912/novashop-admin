import { useState } from "react";
import { PurchaseForm } from "./components/PurchaseForm";
import { PurchasesTable } from "./components/PurchasesTable";
import { usePurchases } from "./hooks/usePurchases";
import { useSuppliers } from "../suppliers/hooks/useSuppliers";
import type { Product } from "../products/data/productsData";

type PurchasesPageProps = {
  products: Product[];
  increaseProductStock: (
    productId: number,
    quantity: number
  ) => void;
};

export function PurchasesPage({
  products,
  increaseProductStock,
}: PurchasesPageProps) {
  const {
    purchases,
    addPurchase,
    deletePurchase,
  } = usePurchases();

  const { activeSuppliers } = useSuppliers();

  const [showForm, setShowForm] = useState(false);

  return (
    <section className="admin-page">
      <div className="page-header">
        <div>
          <h1>Compras</h1>
          <p>
            Administrá las compras realizadas a proveedores.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowForm(true)}
        >
          + Nueva compra
        </button>
      </div>

      <PurchasesTable
        purchases={purchases}
        onDelete={deletePurchase}
      />

      {showForm && (
        <PurchaseForm
          products={products}
          suppliers={activeSuppliers}
          onCancel={() => setShowForm(false)}
          onSave={(purchase) => {
            addPurchase(purchase);

            purchase.items.forEach((item) => {
              increaseProductStock(
                item.productId,
                item.quantity
              );
            });

            setShowForm(false);
          }}
        />
      )}
    </section>
  );
}