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
  productId: number;
  quantity: number;
  price: number;
};

export type Order = {
  id: number;
  clientId: number;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  date: string;
  total: number;
  notes: string;
};

export const initialOrders: Order[] = [
  {
    id: 1,
    clientId: 1,
    items: [
      {
        productId: 1,
        quantity: 1,
        price: 850000,
      },
    ],
    status: "Pendiente",
    paymentStatus: "Pendiente",
    date: "2026-07-06",
    total: 850000,
    notes: "Retira por sucursal.",
  },
];