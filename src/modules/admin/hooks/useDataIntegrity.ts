import { supabase } from "../../../lib/supabase";

async function recordExists(
  table: string,
  column: string,
  value: string,
  errorMessage: string
): Promise<boolean> {
  const { count, error } = await supabase
    .from(table)
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq(column, value);

  if (error) {
    console.error(error);
    throw new Error(errorMessage);
  }

  return (count ?? 0) > 0;
}

export function useDataIntegrity() {
  function hasOrdersByClient(
    clientId: string
  ): Promise<boolean> {
    return recordExists(
      "orders",
      "customer_id",
      clientId,
      "No se pudo comprobar si el cliente tiene pedidos."
    );
  }

  function hasOrdersByProduct(
    productId: string
  ): Promise<boolean> {
    return recordExists(
      "order_items",
      "product_id",
      productId,
      "No se pudo comprobar si el producto tiene pedidos."
    );
  }

  function hasStockMovementsByProduct(
    productId: string
  ): Promise<boolean> {
    return recordExists(
      "stock_movements",
      "product_id",
      productId,
      "No se pudo comprobar si el producto tiene movimientos de stock."
    );
  }

  function hasPurchaseItemsByProduct(
    productId: string
  ): Promise<boolean> {
    return recordExists(
      "purchase_items",
      "product_id",
      productId,
      "No se pudo comprobar si el producto tiene compras asociadas."
    );
  }

  function hasProductsByCategory(
    categoryId: string
  ): Promise<boolean> {
    return recordExists(
      "products",
      "category_id",
      categoryId,
      "No se pudo comprobar si la categoría tiene productos."
    );
  }

  function hasProductsByBrand(
    brandId: string
  ): Promise<boolean> {
    return recordExists(
      "products",
      "brand_id",
      brandId,
      "No se pudo comprobar si la marca tiene productos."
    );
  }

  function hasProductsBySupplier(
    supplierId: string
  ): Promise<boolean> {
    return recordExists(
      "product_suppliers",
      "supplier_id",
      supplierId,
      "No se pudo comprobar si el proveedor tiene productos."
    );
  }

  return {
    hasOrdersByClient,
    hasOrdersByProduct,
    hasStockMovementsByProduct,
    hasPurchaseItemsByProduct,
    hasProductsByCategory,
    hasProductsByBrand,
    hasProductsBySupplier,
  };
}