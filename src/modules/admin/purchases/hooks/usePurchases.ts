import { useState } from "react";

import {
  initialPurchases,
  type Purchase,
} from "../data/purchasesData";

export function usePurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>(
    () => {
      const stored = localStorage.getItem("purchases");

      if (!stored) {
        return initialPurchases;
      }

      try {
        return JSON.parse(stored) as Purchase[];
      } catch {
        return initialPurchases;
      }
    }
  );

  function savePurchases(nextPurchases: Purchase[]) {
    setPurchases(nextPurchases);

    localStorage.setItem(
      "purchases",
      JSON.stringify(nextPurchases)
    );
  }

  function addPurchase(
    purchase: Omit<Purchase, "id" | "number">
  ) {
    const lastNumber = purchases.reduce(
      (max, currentPurchase) => {
        if (!currentPurchase.number) {
          return max;
        }

        const current = Number(
          currentPurchase.number.replace("COMP-", "")
        );

        return Number.isNaN(current)
          ? max
          : Math.max(max, current);
      },
      0
    );

    const nextNumber = String(lastNumber + 1).padStart(
      6,
      "0"
    );

    const newPurchase: Purchase = {
      ...purchase,
      id: Date.now(),
      number: `COMP-${nextNumber}`,
    };

    savePurchases([...purchases, newPurchase]);
  }

  function cancelPurchase(id: number): Purchase | null {
    const purchaseToCancel = purchases.find(
      (purchase) =>
        purchase.id === id &&
        purchase.status !== "Cancelada"
    );

    if (!purchaseToCancel) {
      return null;
    }

    const cancelledPurchase: Purchase = {
      ...purchaseToCancel,
      status: "Cancelada",
    };

    const nextPurchases = purchases.map((purchase) =>
      purchase.id === id
        ? cancelledPurchase
        : purchase
    );

    savePurchases(nextPurchases);

    return cancelledPurchase;
  }

  return {
    purchases,
    addPurchase,
    cancelPurchase,
  };

  return {
    purchases,
    addPurchase,
    cancelPurchase,
  };
}