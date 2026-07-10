import { useState } from "react";
import {
  initialPurchases,
  type Purchase,
} from "../data/purchasesData";

export function usePurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>(() => {
    const stored = localStorage.getItem("purchases");

    if (!stored) return initialPurchases;

    try {
      return JSON.parse(stored);
    } catch {
      return initialPurchases;
    }
  });

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
    const lastNumber = purchases.reduce((max, purchase) => {
      if (!purchase.number) return max;

      const current = Number(
        purchase.number.replace("COMP-", "")
      );

      return Math.max(max, current);
    }, 0);

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

  function deletePurchase(id: number) {
    savePurchases(
      purchases.filter((purchase) => purchase.id !== id)
    );
  }

  return {
    purchases,
    addPurchase,
    deletePurchase,
  };
}