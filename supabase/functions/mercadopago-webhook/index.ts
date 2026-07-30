import "@supabase/functions-js/edge-runtime.d.ts";
import { createAdminClient } from "@supabase/server/core";

const MERCADOPAGO_ACCESS_TOKEN = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
const MERCADOPAGO_WEBHOOK_SECRET = Deno.env.get(
  "MERCADOPAGO_WEBHOOK_SECRET"
);

type WebhookBody = {
  type?: unknown;
  action?: unknown;
  data?: { id?: unknown };
};

async function hmacSha256Hex(
  secret: string,
  message: string
): Promise<string> {
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message)
  );

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function parseSignatureHeader(
  header: string | null
): { ts: string; v1: string } | null {
  if (!header) return null;

  const parts: Record<string, string> = {};

  for (const segment of header.split(",")) {
    const [key, value] = segment.split("=");

    if (key && value) {
      parts[key.trim()] = value.trim();
    }
  }

  if (!parts.ts || !parts.v1) return null;

  return { ts: parts.ts, v1: parts.v1 };
}

async function isValidSignature(
  request: Request,
  resourceId: string
): Promise<boolean> {
  if (!MERCADOPAGO_WEBHOOK_SECRET) {
    console.error("Falta configurar MERCADOPAGO_WEBHOOK_SECRET.");
    return false;
  }

  const signatureHeader = parseSignatureHeader(
    request.headers.get("x-signature")
  );

  const requestId = request.headers.get("x-request-id");

  if (!signatureHeader) {
    return false;
  }

  const manifestParts: string[] = [];

  if (resourceId) manifestParts.push(`id:${resourceId};`);
  if (requestId) manifestParts.push(`request-id:${requestId};`);
  manifestParts.push(`ts:${signatureHeader.ts};`);

  const manifest = manifestParts.join("");

  const expectedHash = await hmacSha256Hex(
    MERCADOPAGO_WEBHOOK_SECRET,
    manifest
  );

  return expectedHash === signatureHeader.v1;
}

function mapMercadoPagoStatus(
  status: string
): "paid" | "pending" | "failed" | "refunded" {
  if (status === "approved") return "paid";
  if (status === "in_process" || status === "pending") return "pending";
  if (status === "refunded" || status === "charged_back") return "refunded";
  return "failed";
}

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return new Response("Método no permitido.", { status: 405 });
  }

  let body: WebhookBody;

  try {
    body = (await request.json()) as WebhookBody;
  } catch {
    return new Response("Cuerpo inválido.", { status: 400 });
  }

  const url = new URL(request.url);

  const bodyResourceId =
    typeof body.data?.id === "string" || typeof body.data?.id === "number"
      ? String(body.data.id)
      : "";

  const resourceId = bodyResourceId || url.searchParams.get("data.id") || "";
  const notificationType = typeof body.type === "string" ? body.type : "";

  if (notificationType !== "payment" || !resourceId) {
    // No es una notificación de pago o no trae id: no hay nada que procesar,
    // pero respondemos 200 igual para que MP no la siga reintentando.
    return new Response("OK", { status: 200 });
  }

  const validSignature = await isValidSignature(request, resourceId);

  if (!validSignature) {
    console.error(
      "Firma de webhook inválida, se ignora la notificación."
    );
    return new Response("Firma inválida.", { status: 401 });
  }

  if (!MERCADOPAGO_ACCESS_TOKEN) {
    console.error("Falta configurar MERCADOPAGO_ACCESS_TOKEN.");
    return new Response("Error de configuración.", { status: 500 });
  }

  // Nunca confiar en el payload del webhook: volver a consultar el pago real.
  const paymentResponse = await fetch(
    `https://api.mercadopago.com/v1/payments/${resourceId}`,
    {
      headers: { Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}` },
    }
  );

  if (!paymentResponse.ok) {
    console.error(
      "No se pudo consultar el pago en Mercado Pago:",
      await paymentResponse.text()
    );
    return new Response("No se pudo verificar el pago.", { status: 502 });
  }

  const payment = await paymentResponse.json();

  const orderId =
    typeof payment.external_reference === "string"
      ? payment.external_reference
      : null;

  const mpStatus = typeof payment.status === "string" ? payment.status : "";

  if (!orderId) {
    console.error(
      "El pago no tiene external_reference, no se puede asociar a una orden."
    );
    return new Response("OK", { status: 200 });
  }

  const paymentStatus = mapMercadoPagoStatus(mpStatus);
  const supabaseAdmin = createAdminClient();

  const { data: orderData, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("id, store_id, currency")
    .eq("id", orderId)
    .maybeSingle();

  if (orderError || !orderData) {
    console.error(orderError);
    return new Response("Orden no encontrada.", { status: 404 });
  }

  const { error: paymentUpsertError } = await supabaseAdmin
    .from("payments")
    .upsert(
      {
        store_id: orderData.store_id,
        order_id: orderId,
        provider: "mercadopago",
        payment_method:
          typeof payment.payment_method_id === "string"
            ? payment.payment_method_id
            : null,
        external_reference: String(payment.id),
        status: paymentStatus,
        currency: orderData.currency,
        amount: Number(payment.transaction_amount ?? 0),
        paid_at:
          paymentStatus === "paid" ? new Date().toISOString() : null,
        metadata: payment,
      },
      {
        onConflict: "provider,external_reference",
      }
    );

  if (paymentUpsertError) {
    console.error(paymentUpsertError);
  }

  const { error: orderUpdateError } = await supabaseAdmin
    .from("orders")
    .update({ payment_status: paymentStatus })
    .eq("id", orderId);

  if (orderUpdateError) {
    console.error(orderUpdateError);
  }

  return new Response("OK", { status: 200 });
});
