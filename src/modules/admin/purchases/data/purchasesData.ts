export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
}

export interface Purchase {
  id: string;
  number: string;
  supplier: string;
  date: string;
  items: PurchaseItem[];
  total: number;
  observations: string;
  paymentMethod: string;
  status: "Completada" | "Cancelada";
}

export const initialPurchases: Purchase[] = [];