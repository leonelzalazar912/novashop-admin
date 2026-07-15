export type OrderStatus =
  | "Pendiente"
  | "En preparación"
  | "Enviado"
  | "Entregado"
  | "Cancelado";

export type PaymentStatus =
  | "Pendiente"
  | "Pagado"
  | "Rechazado";

export type OrderItem = {
  productId: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  clientId: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  date: string;
  total: number;
  notes: string;
};

export const initialOrders: Order[] = [];