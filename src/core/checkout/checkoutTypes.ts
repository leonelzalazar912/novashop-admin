export interface CheckoutCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export type DeliveryMethod = "pickup" | "shipping";

export interface CheckoutDelivery {
  method: DeliveryMethod;
  province: string;
  city: string;
  address: string;
  number: string;
  postalCode: string;
  references: string;
}

export type PaymentMethodLabel =
  | "Tarjeta de crédito"
  | "Mercado Pago"
  | "Transferencia bancaria";

export interface CheckoutOrderResult {
  orderId: string;
  orderNumber: string;
}
