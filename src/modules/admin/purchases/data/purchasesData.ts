export interface PurchaseItem {
  productId: number;
  productName: string;
  quantity: number;
  unitCost: number;
}

export interface Purchase {
  id: number;
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