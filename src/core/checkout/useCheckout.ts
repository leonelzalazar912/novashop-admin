import { useState } from "react";
import { submitOrder } from "./checkoutService";
import type { CartItem } from "../cart/cartTypes";
import type {
  CheckoutCustomer,
  CheckoutDelivery,
  CheckoutOrderResult,
  PaymentMethodLabel,
} from "./checkoutTypes";

interface SubmitParams {
  items: CartItem[];
  customer: CheckoutCustomer;
  delivery: CheckoutDelivery;
  paymentMethod: PaymentMethodLabel;
}

export function useCheckout() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(
    params: SubmitParams
  ): Promise<CheckoutOrderResult | null> {
    setSubmitting(true);
    setError("");

    try {
      const result = await submitOrder(params);
      return result;
    } catch (caughtError) {
      console.error(caughtError);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No se pudo confirmar la compra."
      );

      return null;
    } finally {
      setSubmitting(false);
    }
  }

  return { submit, submitting, error, setError };
}
