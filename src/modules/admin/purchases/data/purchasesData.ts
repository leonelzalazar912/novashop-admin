export interface PurchaseItem {
  productId: number;
  productName: string;
  quantity: number;
  unitCost: number;
}

export interface Purchase {
  id: number;
  supplier: string;
  date: string;
  items: PurchaseItem[];
  total: number;
  status: "Completada" | "Cancelada";
}

export const initialPurchases: Purchase[] = [];