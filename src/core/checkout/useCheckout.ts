import { useState } from "react";
import { processCardPayment, submitOrder } from "./checkoutService";
import type { CartItem } from "../cart/cartTypes";
import type {
  CardPaymentResult,
  CheckoutCustomer,
  CheckoutDelivery,
  CheckoutOrderResult,
  MercadoPagoCardFormData,
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

  async function payWithCard(
    orderId: string,
    paymentData: MercadoPagoCardFormData
  ): Promise<CardPaymentResult> {
    setSubmitting(true);
    setError("");

    try {
      const result = await processCardPayment(orderId, paymentData);

      if (!result.ok) {
        setError(result.message);
      }

      return result;
    } catch (caughtError) {
      console.error(caughtError);

      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "No se pudo procesar el pago con Mercado Pago.";

      setError(message);

      return { ok: false, message };
    } finally {
      setSubmitting(false);
    }
  }

  return { submit, payWithCard, submitting, error, setError };
}
