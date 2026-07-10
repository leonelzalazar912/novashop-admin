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

  function addPurchase(purchase: Omit<Purchase, "id">) {
    const newPurchase: Purchase = {
      ...purchase,
      id: Date.now(),
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