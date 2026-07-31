import { supabase } from "../../lib/supabase";
import { resolveStoreId } from "../catalog/catalogService";
import type { CartItem } from "../cart/cartTypes";
import type {
  CardPaymentResult,
  CheckoutCustomer,
  CheckoutDelivery,
  CheckoutOrderResult,
  MercadoPagoCardFormData,
  PaymentMethodLabel,
} from "./checkoutTypes";

interface SubmitOrderParams {
  items: CartItem[];
  customer: CheckoutCustomer;
  delivery: CheckoutDelivery;
  paymentMethod: PaymentMethodLabel;
}

interface CheckoutOrderRow {
  order_id: string;
  order_number: string;
}

export async function submitOrder({
  items,
  customer,
  delivery,
  paymentMethod,
}: SubmitOrderParams): Promise<CheckoutOrderResult> {
  const storeId = await resolveStoreId();

  const { data, error } = await supabase.rpc("checkout_create_order", {
    p_store_id: storeId,
    p_items: items.map((item) => ({
      product_id: item.id,
      quantity: item.qty,
    })),
    p_customer: {
      first_name: customer.firstName,
      last_name: customer.lastName,
      email: customer.email,
      phone: customer.phone,
    },
    p_delivery: {
      method: delivery.method,
      province: delivery.province,
      city: delivery.city,
      address: delivery.address,
      number: delivery.number,
      postal_code: delivery.postalCode,
      references: delivery.references,
    },
    p_payment_method: paymentMethod,
  });

  if (error || !data || data.length === 0) {
    console.error(error);
    throw new Error(
      error?.message || "No se pudo confirmar la compra."
    );
  }

  const row = data[0] as CheckoutOrderRow;

  return {
    orderId: row.order_id,
    orderNumber: row.order_number,
  };
}

async function getFunctionErrorMessage(
  error: unknown,
  fallbackMessage: string
): Promise<string> {
  if (
    typeof error !== "object" ||
    error === null ||
    !("context" in error)
  ) {
    return fallbackMessage;
  }

  const context = (error as { context?: Response }).context;

  if (!context) {
    return fallbackMessage;
  }

  try {
    const responseBody = (await context.clone().json()) as {
      message?: unknown;
    };

    if (
      typeof responseBody.message === "string" &&
      responseBody.message.trim() !== ""
    ) {
      return responseBody.message;
    }
  } catch {
    // La respuesta no contenía JSON válido.
  }

  return fallbackMessage;
}

export async function processCardPayment(
  orderId: string,
  paymentData: MercadoPagoCardFormData
): Promise<CardPaymentResult> {
  const { data, error } = await supabase.functions.invoke(
    "mercadopago-create-payment",
    {
      body: { orderId, paymentData },
    }
  );

  if (error) {
    console.error(error);

    throw new Error(
      await getFunctionErrorMessage(
        error,
        "No se pudo procesar el pago con Mercado Pago."
      )
    );
  }

  const status = typeof data?.status === "string" ? data.status : "";

  const message =
    typeof data?.message === "string"
      ? data.message
      : "No se pudo procesar el pago.";

  const ok =
    status === "approved" ||
    status === "pending" ||
    status === "in_process";

  return { ok, message };
}
