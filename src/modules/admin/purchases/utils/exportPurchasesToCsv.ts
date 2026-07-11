import type { Purchase } from "../data/purchasesData";

const CSV_SEPARATOR = ";";

function escapeCsvValue(value: unknown): string {
  let text = String(value ?? "");

  // Evita que Excel interprete el contenido como una fórmula.
  if (/^[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  // Escapa las comillas dobles dentro del contenido.
  text = text.replace(/"/g, '""');

  return `"${text}"`;
}

function createFileName(): string {
  const date = new Date().toISOString().slice(0, 10);

  return `compras-${date}.csv`;
}

export function exportPurchasesToCsv(
  purchases: Purchase[]
): void {
  const headers = [
    "Número",
    "Fecha",
    "Proveedor",
    "Forma de pago",
    "Total",
    "Estado",
    "Observaciones",
  ];

  const rows = purchases.map((purchase) => [
    purchase.number ?? "",
    purchase.date,
    purchase.supplier,
    purchase.paymentMethod || "Contado",
    purchase.total,
    purchase.status,
    purchase.observations || "",
  ]);

  const csvLines = [
    headers.map(escapeCsvValue).join(CSV_SEPARATOR),
    ...rows.map((row) =>
      row.map(escapeCsvValue).join(CSV_SEPARATOR)
    ),
  ];

  // CRLF mejora la compatibilidad con Excel en Windows.
  const csvContent = csvLines.join("\r\n");

  // BOM para que Excel reconozca correctamente tildes y ñ.
  const blob = new Blob(
    ["\uFEFF", csvContent],
    {
      type: "text/csv;charset=utf-8;",
    }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = createFileName();
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}