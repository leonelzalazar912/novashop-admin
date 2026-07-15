import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import type {
  Purchase,
  PurchaseItem,
} from "../data/purchasesData";

type PurchaseRow = {
  id: string;
  purchase_number: string;
  purchase_date: string;
  total: number | string;
  observations: string | null;
  payment_method: string | null;
  status: "draft" | "completed" | "cancelled";
  suppliers:
    | { company: string }
    | { company: string }[]
    | null;
  purchase_items:
    | {
        product_id: string | null;
        product_name: string;
        quantity: number | string;
        unit_cost: number | string;
      }[]
    | null;
};

function getSupplierName(
  supplier: PurchaseRow["suppliers"]
): string {
  if (!supplier) return "";

  if (Array.isArray(supplier)) {
    return supplier[0]?.company ?? "";
  }

  return supplier.company;
}

function mapStatus(
  status: PurchaseRow["status"]
): Purchase["status"] {
  return status === "cancelled"
    ? "Cancelada"
    : "Completada";
}

function mapPurchase(row: PurchaseRow): Purchase {
  const items: PurchaseItem[] = (
    row.purchase_items ?? []
  ).map((item) => ({
    productId: item.product_id ?? "",
    productName: item.product_name,
    quantity: Number(item.quantity),
    unitCost: Number(item.unit_cost),
  }));

  return {
    id: row.id,
    number: row.purchase_number,
    supplier: getSupplierName(row.suppliers),
    date: row.purchase_date,
    items,
    total: Number(row.total),
    observations: row.observations ?? "",
    paymentMethod: row.payment_method ?? "",
    status: mapStatus(row.status),
  };
}

export function usePurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>(
    []
  );

  const [storeId, setStoreId] = useState<string | null>(
    null
  );

  const [userId, setUserId] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPurchases() {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error(userError);
        setError("No hay una sesión iniciada.");
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const {
        data: membership,
        error: membershipError,
      } = await supabase
        .from("store_members")
        .select("store_id")
        .eq("user_id", user.id)
        .eq("active", true)
        .limit(1)
        .maybeSingle();

      if (membershipError || !membership) {
        console.error(membershipError);
        setError(
          "No se encontró una tienda asociada al usuario."
        );
        setLoading(false);
        return;
      }

      setStoreId(membership.store_id);

      const {
        data,
        error: purchasesError,
      } = await supabase
        .from("purchases")
        .select(`
          id,
          purchase_number,
          purchase_date,
          total,
          observations,
          payment_method,
          status,
          suppliers (
            company
          ),
          purchase_items (
            product_id,
            product_name,
            quantity,
            unit_cost
          )
        `)
        .eq("store_id", membership.store_id)
        .order("purchase_date", {
          ascending: false,
        })
        .order("created_at", {
          ascending: false,
        });

      if (purchasesError) {
        console.error(purchasesError);
        setError("No se pudieron cargar las compras.");
        setLoading(false);
        return;
      }

      setPurchases(
        (
          data as unknown as PurchaseRow[]
        ).map(mapPurchase)
      );

      setLoading(false);
    }

    void loadPurchases();
  }, []);

  async function findSupplierId(
    supplierName: string
  ): Promise<string> {
    if (!storeId) {
      throw new Error("No se encontró la tienda.");
    }

    const {
      data: supplier,
      error: supplierError,
    } = await supabase
      .from("suppliers")
      .select("id")
      .eq("store_id", storeId)
      .eq("company", supplierName)
      .limit(1)
      .maybeSingle();

    if (supplierError || !supplier) {
      console.error(supplierError);

      throw new Error(
        "No se encontró el proveedor seleccionado."
      );
    }

    return supplier.id;
  }

  async function createPurchaseNumber(): Promise<string> {
    if (!storeId) {
      throw new Error("No se encontró la tienda.");
    }

    const {
      data: lastPurchase,
      error: numberError,
    } = await supabase
      .from("purchases")
      .select("purchase_number")
      .eq("store_id", storeId)
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (numberError) {
      console.error(numberError);

      throw new Error(
        "No se pudo generar el número de compra."
      );
    }

    const previousNumber = Number(
      lastPurchase?.purchase_number?.replace(
        "COMP-",
        ""
      ) ?? "0"
    );

    const nextNumber = Number.isNaN(previousNumber)
      ? 1
      : previousNumber + 1;

    return `COMP-${String(nextNumber).padStart(
      6,
      "0"
    )}`;
  }

  async function addPurchase(
    purchase: Omit<Purchase, "id" | "number">
  ): Promise<Purchase | null> {
    if (!storeId) {
      setError("No se encontró la tienda.");
      return null;
    }

    try {
      setError("");

      const supplierId = await findSupplierId(
        purchase.supplier
      );

      const purchaseNumber =
        await createPurchaseNumber();

      const {
        data: createdPurchase,
        error: purchaseError,
      } = await supabase
        .from("purchases")
        .insert({
          store_id: storeId,
          supplier_id: supplierId,
          purchase_number: purchaseNumber,
          status: "completed",
          payment_status: "pending",
          purchase_date: purchase.date,
          currency: "ARS",
          subtotal: purchase.total,
          discount_total: 0,
          tax_total: 0,
          total: purchase.total,
          payment_method:
            purchase.paymentMethod || null,
          observations:
            purchase.observations || null,
          created_by: userId,
        })
        .select("id")
        .single();

      if (purchaseError || !createdPurchase) {
        console.error(purchaseError);

        throw new Error(
          "No se pudo crear la compra."
        );
      }

      const purchaseId = createdPurchase.id;

      const purchaseItems = purchase.items.map(
        (item) => ({
          store_id: storeId,
          purchase_id: purchaseId,
          product_id: item.productId,
          product_name: item.productName,
          quantity: item.quantity,
          unit_cost: item.unitCost,
          subtotal: item.quantity * item.unitCost,
        })
      );

      const { error: itemsError } = await supabase
        .from("purchase_items")
        .insert(purchaseItems);

      if (itemsError) {
        console.error(itemsError);

        await supabase
          .from("purchases")
          .delete()
          .eq("id", purchaseId);

        throw new Error(
          "No se pudieron guardar los productos de la compra."
        );
      }

      const newPurchase: Purchase = {
        ...purchase,
        id: purchaseId,
        number: purchaseNumber,
      };

      setPurchases((previous) => [
        newPurchase,
        ...previous,
      ]);

      return newPurchase;
    } catch (caughtError) {
      console.error(caughtError);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No se pudo guardar la compra."
      );

      return null;
    }
  }

  async function cancelPurchase(
    id: string
  ): Promise<Purchase | null> {
    const purchaseToCancel = purchases.find(
      (purchase) =>
        purchase.id === id &&
        purchase.status !== "Cancelada"
    );

    if (!purchaseToCancel) {
      return null;
    }

    const { error: cancelError } = await supabase
      .from("purchases")
      .update({
        status: "cancelled",
        payment_status: "cancelled",
        cancelled_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("store_id", storeId);

    if (cancelError) {
      console.error(cancelError);
      setError("No se pudo cancelar la compra.");
      return null;
    }

    const cancelledPurchase: Purchase = {
      ...purchaseToCancel,
      status: "Cancelada",
    };

    setPurchases((previous) =>
      previous.map((purchase) =>
        purchase.id === id
          ? cancelledPurchase
          : purchase
      )
    );

    setError("");

    return cancelledPurchase;
  }

  return {
    purchases,
    addPurchase,
    cancelPurchase,
    loading,
    error,
  };
}