import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import type {
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
} from "../data/ordersData";

type OrderItemRow = {
  product_id: string | null;
  quantity: number | string;
  unit_price: number | string;
};

type OrderRow = {
  id: string;
  customer_id: string | null;
  status: string;
  payment_status: string;
  fulfillment_status: string;
  total: number | string;
  notes: string | null;
  placed_at: string | null;
  created_at: string;
  order_items: OrderItemRow[] | null;
};

type CustomerRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  business_name: string | null;
  email: string | null;
  phone: string | null;
};

type ProductRow = {
  id: string;
  name: string;
};

function mapOrderStatus(
  status: string,
  fulfillmentStatus: string
): OrderStatus {
  if (
    status === "cancelled" ||
    fulfillmentStatus === "cancelled"
  ) {
    return "Cancelado";
  }

  if (
    status === "completed" ||
    fulfillmentStatus === "delivered"
  ) {
    return "Entregado";
  }

  if (fulfillmentStatus === "shipped") {
    return "Enviado";
  }

  if (
    fulfillmentStatus === "preparing" ||
    fulfillmentStatus === "ready_for_pickup"
  ) {
    return "En preparación";
  }

  return "Pendiente";
}

function mapPaymentStatus(
  paymentStatus: string
): PaymentStatus {
  if (
    paymentStatus === "paid" ||
    paymentStatus === "authorized"
  ) {
    return "Pagado";
  }

  if (
    paymentStatus === "failed" ||
    paymentStatus === "cancelled"
  ) {
    return "Rechazado";
  }

  return "Pendiente";
}

function getDatabaseOrderStatus(status: OrderStatus) {
  switch (status) {
    case "En preparación":
      return {
        status: "confirmed",
        fulfillmentStatus: "preparing",
      };

    case "Enviado":
      return {
        status: "confirmed",
        fulfillmentStatus: "shipped",
      };

    case "Entregado":
      return {
        status: "completed",
        fulfillmentStatus: "delivered",
      };

    case "Cancelado":
      return {
        status: "cancelled",
        fulfillmentStatus: "cancelled",
      };

    default:
      return {
        status: "confirmed",
        fulfillmentStatus: "unfulfilled",
      };
  }
}

function getDatabasePaymentStatus(
  paymentStatus: PaymentStatus
): string {
  switch (paymentStatus) {
    case "Pagado":
      return "paid";

    case "Rechazado":
      return "failed";

    default:
      return "pending";
  }
}

function mapOrder(row: OrderRow): Order {
  const items: OrderItem[] = (row.order_items ?? [])
    .filter(
      (
        item
      ): item is OrderItemRow & {
        product_id: string;
      } => Boolean(item.product_id)
    )
    .map((item) => ({
      productId: item.product_id,
      quantity: Number(item.quantity),
      price: Number(item.unit_price),
    }));

  const orderDate =
    row.placed_at ?? row.created_at;

  return {
    id: row.id,
    clientId: row.customer_id ?? "",
    items,
    status: mapOrderStatus(
      row.status,
      row.fulfillment_status
    ),
    paymentStatus: mapPaymentStatus(
      row.payment_status
    ),
    date: orderDate.slice(0, 10),
    total: Number(row.total),
    notes: row.notes ?? "",
  };
}

function getCustomerName(customer: CustomerRow): string {
  if (customer.business_name?.trim()) {
    return customer.business_name.trim();
  }

  return [
    customer.first_name?.trim(),
    customer.last_name?.trim(),
  ]
    .filter(Boolean)
    .join(" ");
}

function createOrderNumber(): string {
  const timestamp = Date.now();
  const randomPart = Math.random()
    .toString(36)
    .slice(2, 7)
    .toUpperCase();

  return `PED-${timestamp}-${randomPart}`;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [storeId, setStoreId] =
    useState<string | null>(null);
  const [userId, setUserId] =
    useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] =
    useState<"name" | "status">("name");
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const itemsPerPage = 5;

  useEffect(() => {
    async function loadOrders() {
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
        error: ordersError,
      } = await supabase
        .from("orders")
        .select(`
          id,
          customer_id,
          status,
          payment_status,
          fulfillment_status,
          total,
          notes,
          placed_at,
          created_at,
          order_items (
            product_id,
            quantity,
            unit_price
          )
        `)
        .eq("store_id", membership.store_id)
        .order("created_at", {
          ascending: false,
        });

      if (ordersError) {
        console.error(ordersError);
        setError("No se pudieron cargar los pedidos.");
        setLoading(false);
        return;
      }

      setOrders(
        (data as unknown as OrderRow[]).map(mapOrder)
      );

      setLoading(false);
    }

    void loadOrders();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy]);

  async function addOrder(
    order: Omit<Order, "id">
  ): Promise<boolean> {
    if (!storeId) {
      setError("No se encontró la tienda.");
      return false;
    }

    if (!order.clientId || order.items.length === 0) {
      setError(
        "El pedido necesita un cliente y productos."
      );
      return false;
    }

    try {
      setError("");

      const {
        data: customer,
        error: customerError,
      } = await supabase
        .from("customers")
        .select(`
          id,
          first_name,
          last_name,
          business_name,
          email,
          phone
        `)
        .eq("id", order.clientId)
        .eq("store_id", storeId)
        .maybeSingle();

      if (customerError || !customer) {
        console.error(customerError);
        throw new Error(
          "No se encontró el cliente seleccionado."
        );
      }

      const productIds = [
        ...new Set(
          order.items.map((item) => item.productId)
        ),
      ];

      const {
        data: productRows,
        error: productsError,
      } = await supabase
        .from("products")
        .select("id, name")
        .eq("store_id", storeId)
        .in("id", productIds);

      if (productsError) {
        console.error(productsError);
        throw new Error(
          "No se pudieron consultar los productos."
        );
      }

      const productsById = new Map(
        (productRows as ProductRow[]).map((product) => [
          product.id,
          product,
        ])
      );

      const missingProduct = order.items.some(
        (item) => !productsById.has(item.productId)
      );

      if (missingProduct) {
        throw new Error(
          "Uno de los productos ya no está disponible."
        );
      }

      const databaseStatus =
        getDatabaseOrderStatus(order.status);

      const customerName = getCustomerName(
        customer as CustomerRow
      );

      const {
        data: createdOrder,
        error: orderError,
      } = await supabase
        .from("orders")
        .insert({
          store_id: storeId,
          customer_id: order.clientId,
          order_number: createOrderNumber(),
          customer_name: customerName,
          customer_email: customer.email,
          customer_phone: customer.phone,
          status: databaseStatus.status,
          payment_status:
            getDatabasePaymentStatus(
              order.paymentStatus
            ),
          fulfillment_status:
            databaseStatus.fulfillmentStatus,
          currency: "ARS",
          subtotal: order.total,
          discount_total: 0,
          shipping_total: 0,
          tax_total: 0,
          total: order.total,
          notes: order.notes || null,
          placed_at: new Date(
            `${order.date}T12:00:00`
          ).toISOString(),
          cancelled_at:
            order.status === "Cancelado"
              ? new Date().toISOString()
              : null,
          created_by: userId,
        })
        .select("id")
        .single();

      if (orderError || !createdOrder) {
        console.error(orderError);
        throw new Error(
          "No se pudo crear el pedido."
        );
      }

      const orderId = createdOrder.id;

      const orderItems = order.items.map((item) => {
        const product = productsById.get(
          item.productId
        );

        return {
          store_id: storeId,
          order_id: orderId,
          product_id: item.productId,
          product_name:
            product?.name ?? "Producto",
          quantity: item.quantity,
          unit_price: item.price,
          discount_total: 0,
          subtotal: item.price * item.quantity,
        };
      });

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error(itemsError);

        await supabase
          .from("orders")
          .delete()
          .eq("id", orderId)
          .eq("store_id", storeId);

        throw new Error(
          "No se pudieron guardar los productos del pedido."
        );
      }

      const newOrder: Order = {
        id: orderId,
        ...order,
      };

      setOrders((previous) => [
        newOrder,
        ...previous,
      ]);

      return true;
    } catch (caughtError) {
      console.error(caughtError);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No se pudo crear el pedido."
      );

      return false;
    }
  }

  async function updateOrder(
    updatedOrder: Order
  ): Promise<boolean> {
    if (!storeId) {
      setError("No se encontró la tienda.");
      return false;
    }

    const databaseStatus =
      getDatabaseOrderStatus(updatedOrder.status);

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: databaseStatus.status,
        fulfillment_status:
          databaseStatus.fulfillmentStatus,
        payment_status:
          getDatabasePaymentStatus(
            updatedOrder.paymentStatus
          ),
        notes: updatedOrder.notes || null,
        cancelled_at:
          updatedOrder.status === "Cancelado"
            ? new Date().toISOString()
            : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", updatedOrder.id)
      .eq("store_id", storeId);

    if (updateError) {
      console.error(updateError);
      setError("No se pudo actualizar el pedido.");
      return false;
    }

    setOrders((previous) =>
      previous.map((order) =>
        order.id === updatedOrder.id
          ? updatedOrder
          : order
      )
    );

    setError("");
    return true;
  }

  async function deleteOrder(
    id: string
  ): Promise<boolean> {
    if (!storeId) {
      setError("No se encontró la tienda.");
      return false;
    }

    const { error: deleteError } = await supabase
      .from("orders")
      .delete()
      .eq("id", id)
      .eq("store_id", storeId);

    if (deleteError) {
      console.error(deleteError);
      setError("No se pudo eliminar el pedido.");
      return false;
    }

    setOrders((previous) =>
      previous.filter((order) => order.id !== id)
    );

    setError("");
    return true;
  }

  const normalizedSearch = search
    .trim()
    .toLowerCase();

  const filteredOrders = [...orders]
    .filter((order) =>
      order.clientId
        .toLowerCase()
        .includes(normalizedSearch)
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return b.date.localeCompare(a.date);
      }

      return a.status.localeCompare(b.status);
    });

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredOrders.length / itemsPerPage
    )
  );

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    orders: paginatedOrders,
    search,
    setSearch,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
    addOrder,
    updateOrder,
    deleteOrder,
    loading,
    error,
  };
}