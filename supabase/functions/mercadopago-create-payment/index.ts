import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

const MERCADOPAGO_ACCESS_TOKEN = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");

type RequestBody = {
  orderId?: unknown;
  paymentData?: unknown;
};

type PaymentDataInput = {
  token: string;
  paymentMethodId: string;
  issuerId?: string;
  installments: number;
  payer: {
    email: string;
    identification?: {
      type: string;
      number: string;
    };
  };
};

type OrderRow = {
  id: string;
  store_id: string;
  order_number: string;
  total: number | string;
  currency: string;
  payment_status: string;
};

function errorResponse(message: string, status: number): Response {
  return Response.json({ success: false, message }, { status });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" && value !== null && !Array.isArray(value)
  );
}

function parsePaymentData(value: unknown): PaymentDataInput | null {
  if (!isRecord(value)) return null;

  const token = typeof value.token === "string" ? value.token : "";

  const paymentMethodId =
    typeof value.payment_method_id === "string"
      ? value.payment_method_id
      : "";

  const installments =
    typeof value.installments === "number" ? value.installments : 1;

  const issuerId =
    typeof value.issuer_id === "string" ? value.issuer_id : undefined;

  const payerValue = value.payer;

  const payerEmail =
    isRecord(payerValue) && typeof payerValue.email === "string"
      ? payerValue.email.trim()
      : "";

  if (!token || !paymentMethodId || !payerEmail) {
    return null;
  }

  let identification: { type: string; number: string } | undefined;

  if (isRecord(payerValue) && isRecord(payerValue.identification)) {
    const idType = payerValue.identification.type;
    const idNumber = payerValue.identification.number;

    if (
      typeof idType === "string" &&
      typeof idNumber === "string" &&
      idType &&
      idNumber
    ) {
      identification = { type: idType, number: idNumber };
    }
  }

  return {
    token,
    paymentMethodId,
    issuerId,
    installments,
    payer: {
      email: payerEmail,
      identification,
    },
  };
}

function mapMercadoPagoStatus(
  status: string
): "paid" | "pending" | "failed" | "refunded" {
  if (status === "approved") return "paid";
  if (status === "in_process" || status === "pending") return "pending";
  if (status === "refunded" || status === "charged_back") return "refunded";
  return "failed";
}

export default {
  fetch: withSupabase(
    { auth: "publishable" },
    async (request, context) => {
      if (request.method !== "POST") {
        return Response.json(
          {
            success: false,
            message:
              "Método no permitido. Utilizá una solicitud POST.",
          },
          {
            status: 405,
            headers: { Allow: "POST" },
          }
        );
      }

      if (!MERCADOPAGO_ACCESS_TOKEN) {
        console.error(
          "Falta configurar MERCADOPAGO_ACCESS_TOKEN."
        );

        return errorResponse(
          "El cobro con Mercado Pago no está disponible en este momento.",
          500
        );
      }

      let body: RequestBody;

      try {
        body = (await request.json()) as RequestBody;
      } catch {
        return errorResponse(
          "El cuerpo de la solicitud no es válido.",
          400
        );
      }

      const orderId =
        typeof body.orderId === "string" ? body.orderId.trim() : "";

      if (!orderId) {
        return errorResponse(
          "Falta el identificador del pedido.",
          400
        );
      }

      const paymentData = parsePaymentData(body.paymentData);

      if (!paymentData) {
        return errorResponse(
          "Los datos de pago no son válidos.",
          400
        );
      }

      const { data: orderData, error: orderError } =
        await context.supabaseAdmin
          .from("orders")
          .select(
            "id, store_id, order_number, total, currency, payment_status"
          )
          .eq("id", orderId)
          .maybeSingle();

      if (orderError || !orderData) {
        console.error(orderError);
        return errorResponse("No se encontró el pedido.", 404);
      }

      const order = orderData as OrderRow;

      if (order.payment_status === "paid") {
        return errorResponse("Este pedido ya fue pagado.", 409);
      }

      const paymentPayload = {
        transaction_amount: Number(order.total),
        token: paymentData.token,
        description: `Pedido ${order.order_number}`,
        installments: paymentData.installments,
        payment_method_id: paymentData.paymentMethodId,
        issuer_id: paymentData.issuerId,
        payer: {
          email: paymentData.payer.email,
          identification: paymentData.payer.identification,
        },
        external_reference: order.id,
      };

      let mercadoPagoResponse: Response;

      try {
        mercadoPagoResponse = await fetch(
          "https://api.mercadopago.com/v1/payments",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
              "X-Idempotency-Key": crypto.randomUUID(),
            },
            body: JSON.stringify(paymentPayload),
          }
        );
      } catch (fetchError) {
        console.error(fetchError);
        return errorResponse(
          "No se pudo comunicar con Mercado Pago.",
          502
        );
      }

      const mercadoPagoResult = await mercadoPagoResponse.json();

      if (!mercadoPagoResponse.ok) {
        console.error(
          "Mercado Pago rechazó la solicitud:",
          mercadoPagoResult
        );

        return errorResponse(
          mercadoPagoResult?.message ??
            "Mercado Pago no pudo procesar el pago.",
          mercadoPagoResponse.status
        );
      }

      const mpStatus = mercadoPagoResult.status as string;

      const mpStatusDetail = mercadoPagoResult.status_detail as
        | string
        | undefined;

      const mpPaymentId = mercadoPagoResult.id;

      const paymentStatus = mapMercadoPagoStatus(mpStatus);

      const { error: paymentUpsertError } =
        await context.supabaseAdmin.from("payments").upsert(
          {
            store_id: order.store_id,
            order_id: order.id,
            provider: "mercadopago",
            payment_method: paymentData.paymentMethodId,
            external_reference: String(mpPaymentId),
            status: paymentStatus,
            currency: order.currency,
            amount: Number(order.total),
            paid_at:
              paymentStatus === "paid"
                ? new Date().toISOString()
                : null,
            metadata: mercadoPagoResult,
          },
          {
            onConflict: "provider,external_reference",
          }
        );

      if (paymentUpsertError) {
        console.error(paymentUpsertError);
      }

      const { error: orderUpdateError } =
        await context.supabaseAdmin
          .from("orders")
          .update({ payment_status: paymentStatus })
          .eq("id", order.id);

      if (orderUpdateError) {
        console.error(orderUpdateError);
      }

      return Response.json({
        success: mpStatus === "approved",
        status: mpStatus,
        statusDetail: mpStatusDetail ?? null,
        paymentId: mpPaymentId,
        message:
          paymentStatus === "paid"
            ? "El pago fue aprobado."
            : paymentStatus === "pending"
              ? "El pago está pendiente de confirmación."
              : "El pago fue rechazado.",
      });
    }
  ),
};
