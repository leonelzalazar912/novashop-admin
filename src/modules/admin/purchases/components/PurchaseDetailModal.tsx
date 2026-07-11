import {
  useEffect,
  useRef,
} from "react";

import type { Purchase } from "../data/purchasesData";

type PurchaseDetailModalProps = {
  purchase: Purchase;
  onClose: () => void;
};

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function PurchaseDetailModal({
  purchase,
  onClose,
}: PurchaseDetailModalProps) {
  const printAreaRef =
    useRef<HTMLElement | null>(null);

  const totalProducts = purchase.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onClose]);

  function handlePrint() {
    const printableContent =
      printAreaRef.current;

    if (!printableContent) {
      return;
    }

    const printWindow = window.open(
      "",
      "_blank",
      "width=900,height=700"
    );

    if (!printWindow) {
      window.alert(
        "El navegador bloqueó la ventana de impresión. Permití las ventanas emergentes e intentá nuevamente."
      );

      return;
    }

    const documentTitle =
      purchase.number || "Comprobante de compra";

    printWindow.document.open();

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
          />

          <title>${documentTitle}</title>

          <style>
            @page {
              size: A4 portrait;
              margin: 14mm;
            }

            * {
              box-sizing: border-box;
            }

            html,
            body {
              margin: 0;
              padding: 0;
              background: #ffffff;
              color: #111827;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 12px;
            }

            body {
              width: 100%;
            }

            .purchase-print-area {
              width: 100%;
              margin: 0;
              padding: 0;
            }

            .purchase-document-header {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              gap: 24px;
              padding-bottom: 18px;
              border-bottom: 1px solid #d1d5db;
            }

            .purchase-document-header h2 {
              margin: 6px 0 0;
              font-size: 22px;
              color: #111827;
            }

            .purchase-document-label {
              color: #6b7280;
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.08em;
              text-transform: uppercase;
            }

            .purchase-document-status {
              display: flex;
              justify-content: flex-end;
            }

            .purchase-status {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              padding: 6px 12px;
              border: 1px solid #9ca3af;
              border-radius: 999px;
              color: #111827;
              font-size: 11px;
              font-weight: 700;
            }

            .purchase-detail-grid {
              display: grid;
              grid-template-columns:
                repeat(2, minmax(0, 1fr));
              gap: 14px 24px;
              margin: 22px 0;
            }

            .purchase-detail-item {
              display: flex;
              flex-direction: column;
              gap: 5px;
              padding: 10px 12px;
              border: 1px solid #d1d5db;
              border-radius: 6px;
              break-inside: avoid;
            }

            .purchase-detail-item span {
              color: #6b7280;
              font-size: 10px;
            }

            .purchase-detail-item strong {
              color: #111827;
              font-size: 12px;
              overflow-wrap: anywhere;
            }

            .purchase-items-section {
              margin-top: 20px;
            }

            .purchase-items-section h3,
            .purchase-observations h3 {
              margin: 0 0 10px;
              color: #111827;
              font-size: 14px;
            }

            .purchase-table-wrapper {
              width: 100%;
              overflow: visible;
            }

            .purchase-detail-table {
              width: 100%;
              border-collapse: collapse;
            }

            .purchase-detail-table th,
            .purchase-detail-table td {
              padding: 8px;
              border: 1px solid #d1d5db;
              color: #111827;
              text-align: left;
              vertical-align: top;
            }

            .purchase-detail-table th {
              background: #f3f4f6;
              font-weight: 700;
            }

            .purchase-detail-table thead {
              display: table-header-group;
            }

            .purchase-detail-table tr {
              break-inside: avoid;
              page-break-inside: avoid;
            }

            .purchase-summary-card {
              display: flex;
              justify-content: flex-end;
              margin-top: 20px;
              break-inside: avoid;
            }

            .purchase-grand-total {
              display: flex;
              width: 280px;
              flex-direction: column;
              gap: 7px;
              padding: 14px 16px;
              border: 1px solid #9ca3af;
              border-radius: 6px;
            }

            .purchase-grand-total span {
              color: #6b7280;
              font-size: 11px;
            }

            .purchase-grand-total strong {
              color: #111827;
              font-size: 21px;
            }

            .purchase-observations {
              margin-top: 22px;
              padding: 14px;
              border: 1px solid #d1d5db;
              border-radius: 6px;
              break-inside: avoid;
              page-break-inside: avoid;
            }

            .purchase-observations p {
              margin: 0;
              color: #111827;
              line-height: 1.5;
              white-space: pre-wrap;
              overflow-wrap: anywhere;
            }

            .purchase-document-footer {
              margin-top: 24px;
              padding-top: 12px;
              border-top: 1px solid #d1d5db;
              color: #6b7280;
              font-size: 10px;
              text-align: center;
              break-inside: avoid;
            }
          </style>
        </head>

        <body>
          ${printableContent.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.focus();

    window.setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  }

  return (
    <div
      className="modal-overlay purchase-modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="modal-content purchase-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="purchase-detail-title"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <article
          ref={printAreaRef}
          className="purchase-print-area"
        >
          <header className="purchase-document-header">
            <div>
              <span className="purchase-document-label">
                Comprobante de compra
              </span>

              <h2 id="purchase-detail-title">
                {purchase.number ||
                  "Compra sin número"}
              </h2>
            </div>

            <div className="purchase-document-status">
              <span
                className={
                  purchase.status === "Completada"
                    ? "purchase-status purchase-status-completed"
                    : "purchase-status purchase-status-cancelled"
                }
              >
                {purchase.status}
              </span>
            </div>
          </header>

          <section className="purchase-detail-grid">
            <div className="purchase-detail-item">
              <span>Proveedor</span>
              <strong>{purchase.supplier}</strong>
            </div>

            <div className="purchase-detail-item">
              <span>Fecha</span>
              <strong>{purchase.date}</strong>
            </div>

            <div className="purchase-detail-item">
              <span>Forma de pago</span>

              <strong>
                {purchase.paymentMethod ||
                  "Contado"}
              </strong>
            </div>

            <div className="purchase-detail-item">
              <span>Total de productos</span>
              <strong>{totalProducts}</strong>
            </div>
          </section>

          <section className="purchase-items-section">
            <h3>Productos</h3>

            <div className="purchase-table-wrapper">
              <table className="products-table purchase-detail-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Costo unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {purchase.items.length > 0 ? (
                    purchase.items.map(
                      (item, index) => (
                        <tr
                          key={`${item.productId}-${index}`}
                        >
                          <td>
                            {item.productName}
                          </td>

                          <td>{item.quantity}</td>

                          <td>
                            {currencyFormatter.format(
                              item.unitCost
                            )}
                          </td>

                          <td>
                            {currencyFormatter.format(
                              item.quantity *
                                item.unitCost
                            )}
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan={4}>
                        Esta compra no tiene
                        productos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="purchase-summary-card purchase-summary-single">
            <div className="purchase-grand-total">
              <span>Total de la compra</span>

              <strong>
                {currencyFormatter.format(
                  purchase.total
                )}
              </strong>
            </div>
          </section>

          {purchase.observations?.trim() && (
            <section className="purchase-observations">
              <h3>Observaciones</h3>
              <p>{purchase.observations}</p>
            </section>
          )}

          <footer className="purchase-document-footer">
            Documento generado desde el sistema
            administrativo.
          </footer>
        </article>

        <div className="form-actions purchase-modal-actions no-print">
          <button
            type="button"
            className="secondary-button"
            onClick={handlePrint}
          >
            Imprimir / Guardar como PDF
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}