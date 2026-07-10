import { useState } from "react";
import { PurchaseForm } from "./components/PurchaseForm";
import { PurchasesTable } from "./components/PurchasesTable";
import { usePurchases } from "./hooks/usePurchases";
import { useSuppliers } from "../suppliers/hooks/useSuppliers";
import type { Product } from "../products/data/productsData";
import type { Purchase } from "./data/purchasesData";
import { PurchaseDetailModal } from "./components/PurchaseDetailModal";
import { PurchasesStats } from "./components/PurchasesStats";
import { PurchasesFilters } from "./components/PurchasesFilters";

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

    const [selectedPurchase, setSelectedPurchase] =
      useState<Purchase | null>(null);

    const [search, setSearch] = useState("");

    const [supplierFilter, setSupplierFilter] =
      useState("Todos");

    const [statusFilter, setStatusFilter] =
      useState("Todos");

    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const [sortBy, setSortBy] = useState("date-desc");

    const suppliers = [
      "Todos",
      ...new Set(
        purchases.map((purchase) => purchase.supplier)
      ),
    ];

    const filteredPurchases = purchases.filter((purchase) => {
      const term = search.toLowerCase();

      const matchesSearch =
        (purchase.number ?? "")
          .toLowerCase()
          .includes(term) ||
        purchase.supplier
          .toLowerCase()
          .includes(term);

      const matchesSupplier =
        supplierFilter === "Todos" ||
        purchase.supplier === supplierFilter;

      const matchesStatus =
        statusFilter === "Todos" ||
        purchase.status === statusFilter;

      const matchesDateFrom =
        !dateFrom || purchase.date >= dateFrom;

      const matchesDateTo =
        !dateTo || purchase.date <= dateTo;

      return (
        matchesSearch &&
        matchesSupplier &&
        matchesStatus &&
        matchesDateFrom &&
        matchesDateTo
      );
    });

    const sortedPurchases = [...filteredPurchases].sort(
      (a, b) => {
        switch (sortBy) {
          case "date-asc":
            return a.date.localeCompare(b.date);

          case "total-desc":
            return b.total - a.total;

          case "total-asc":
            return a.total - b.total;

          case "number-desc":
            return (b.number ?? "").localeCompare(
              a.number ?? ""
            );

          case "number-asc":
            return (a.number ?? "").localeCompare(
              b.number ?? ""
            );

          default:
            return b.date.localeCompare(a.date);
        }
      }
    );

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

      <PurchasesStats purchases={purchases} />

      <PurchasesFilters
        search={search}
        supplierFilter={supplierFilter}
        statusFilter={statusFilter}
        dateFrom={dateFrom}
        dateTo={dateTo}
        suppliers={suppliers}
        sortBy={sortBy}
        onSearchChange={setSearch}
        onSupplierChange={setSupplierFilter}
        onStatusChange={setStatusFilter}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onSortChange={setSortBy}
        onClear={() => {
          setSearch("");
          setSupplierFilter("Todos");
          setStatusFilter("Todos");
          setDateFrom("");
          setDateTo("");
        }}
      />

      <PurchasesTable
        purchases={sortedPurchases}
        onDelete={deletePurchase}
        onView={setSelectedPurchase}
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

      {selectedPurchase && (
        <PurchaseDetailModal
          purchase={selectedPurchase}
          onClose={() => setSelectedPurchase(null)}
        />
      )}
    </section>
  );
}