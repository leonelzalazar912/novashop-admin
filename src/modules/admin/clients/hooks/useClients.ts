import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import type { Client } from "../data/clientsData";

type CustomerAddressRow = {
  id: string;
  street: string;
  city: string;
  is_default_shipping: boolean;
};

type CustomerRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  business_name: string | null;
  email: string | null;
  phone: string | null;
  active: boolean;
  customer_addresses: CustomerAddressRow[] | null;
};

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

function getMainAddress(
  addresses: CustomerAddressRow[] | null
): CustomerAddressRow | null {
  if (!addresses?.length) {
    return null;
  }

  return (
    addresses.find(
      (address) => address.is_default_shipping
    ) ?? addresses[0]
  );
}

function mapClient(customer: CustomerRow): Client {
  const address = getMainAddress(
    customer.customer_addresses
  );

  return {
    id: customer.id,
    name: getCustomerName(customer),
    email: customer.email ?? "",
    phone: customer.phone ?? "",
    street: address?.street ?? "",
    city: address?.city ?? "",
    active: customer.active,
  };
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [storeId, setStoreId] = useState<string | null>(
    null
  );

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] =
    useState<"name" | "status">("name");

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const itemsPerPage = 5;

  useEffect(() => {
    async function loadClients() {
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
        error: clientsError,
      } = await supabase
        .from("customers")
        .select(`
          id,
          first_name,
          last_name,
          business_name,
          email,
          phone,
          active,
          customer_addresses (
            id,
            street,
            city,
            is_default_shipping
          )
        `)
        .eq("store_id", membership.store_id)
        .order("created_at", {
          ascending: false,
        });

      if (clientsError) {
        console.error(clientsError);
        setError("No se pudieron cargar los clientes.");
        setLoading(false);
        return;
      }

      setClients(
        (data as unknown as CustomerRow[]).map(
          mapClient
        )
      );

      setLoading(false);
    }

    void loadClients();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy]);

  async function emailAlreadyExists(
    email: string,
    excludedClientId?: string
  ): Promise<boolean> {
    if (!storeId) {
      return false;
    }

    const { data, error: emailError } = await supabase
      .from("customers")
      .select("id, email")
      .eq("store_id", storeId);

    if (emailError) {
      console.error(emailError);
      throw new Error(
        "No se pudo comprobar el correo electrónico."
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    return (data ?? []).some(
      (customer) =>
        customer.id !== excludedClientId &&
        customer.email?.trim().toLowerCase() ===
          normalizedEmail
    );
  }

  async function addClient(
    name: string,
    email: string,
    phone: string,
    street: string,
    city: string
  ): Promise<boolean> {
    if (!storeId) {
      setError("No se encontró la tienda.");
      return false;
    }

    try {
      setError("");

      const clientExists = await emailAlreadyExists(
        email
      );

      if (clientExists) {
        setError(
          "Ya existe un cliente con ese correo electrónico."
        );
        return false;
      }

      const {
        data: createdCustomer,
        error: customerError,
      } = await supabase
        .from("customers")
        .insert({
          store_id: storeId,
          first_name: name.trim(),
          last_name: null,
          business_name: null,
          email: email.trim(),
          phone: phone.trim(),
          active: true,
        })
        .select("id")
        .single();

      if (customerError || !createdCustomer) {
        console.error(customerError);
        throw new Error(
          "No se pudo crear el cliente."
        );
      }

      const customerId = createdCustomer.id;

      const { error: addressError } = await supabase
        .from("customer_addresses")
        .insert({
          store_id: storeId,
          customer_id: customerId,
          label: "Principal",
          recipient_name: name.trim(),
          phone: phone.trim(),
          street: street.trim(),
          city: city.trim(),
          country: "Argentina",
          is_default_shipping: true,
          is_default_billing: true,
        });

      if (addressError) {
        console.error(addressError);

        await supabase
          .from("customers")
          .delete()
          .eq("id", customerId)
          .eq("store_id", storeId);

        throw new Error(
          "No se pudo guardar la dirección del cliente."
        );
      }

      const newClient: Client = {
        id: customerId,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        street: street.trim(),
        city: city.trim(),
        active: true,
      };

      setClients((previous) => [
        newClient,
        ...previous,
      ]);

      return true;
    } catch (caughtError) {
      console.error(caughtError);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No se pudo crear el cliente."
      );

      return false;
    }
  }

  async function deleteClient(
    id: string
  ): Promise<boolean> {
    if (!storeId) {
      setError("No se encontró la tienda.");
      return false;
    }

    const { error: deleteError } = await supabase
      .from("customers")
      .delete()
      .eq("id", id)
      .eq("store_id", storeId);

    if (deleteError) {
      console.error(deleteError);
      setError(
        "No se pudo eliminar el cliente. Puede tener pedidos asociados."
      );
      return false;
    }

    setClients((previous) =>
      previous.filter((client) => client.id !== id)
    );

    setError("");
    return true;
  }

  async function updateClient(
    id: string,
    name: string,
    email: string,
    phone: string,
    street: string,
    city: string
  ): Promise<boolean> {
    if (!storeId) {
      setError("No se encontró la tienda.");
      return false;
    }

    try {
      setError("");

      const clientExists = await emailAlreadyExists(
        email,
        id
      );

      if (clientExists) {
        setError(
          "Ya existe otro cliente con ese correo electrónico."
        );
        return false;
      }

      const { error: customerError } = await supabase
        .from("customers")
        .update({
          first_name: name.trim(),
          last_name: null,
          business_name: null,
          email: email.trim(),
          phone: phone.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("store_id", storeId);

      if (customerError) {
        console.error(customerError);
        throw new Error(
          "No se pudo actualizar el cliente."
        );
      }

      const {
        data: existingAddress,
        error: addressSearchError,
      } = await supabase
        .from("customer_addresses")
        .select("id")
        .eq("store_id", storeId)
        .eq("customer_id", id)
        .order("is_default_shipping", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (addressSearchError) {
        console.error(addressSearchError);
        throw new Error(
          "No se pudo consultar la dirección."
        );
      }

      if (existingAddress) {
        const { error: addressUpdateError } =
          await supabase
            .from("customer_addresses")
            .update({
              recipient_name: name.trim(),
              phone: phone.trim(),
              street: street.trim(),
              city: city.trim(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingAddress.id)
            .eq("store_id", storeId);

        if (addressUpdateError) {
          console.error(addressUpdateError);
          throw new Error(
            "No se pudo actualizar la dirección."
          );
        }
      } else {
        const { error: addressInsertError } =
          await supabase
            .from("customer_addresses")
            .insert({
              store_id: storeId,
              customer_id: id,
              label: "Principal",
              recipient_name: name.trim(),
              phone: phone.trim(),
              street: street.trim(),
              city: city.trim(),
              country: "Argentina",
              is_default_shipping: true,
              is_default_billing: true,
            });

        if (addressInsertError) {
          console.error(addressInsertError);
          throw new Error(
            "No se pudo crear la dirección."
          );
        }
      }

      setClients((previous) =>
        previous.map((client) =>
          client.id === id
            ? {
                ...client,
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                street: street.trim(),
                city: city.trim(),
              }
            : client
        )
      );

      return true;
    } catch (caughtError) {
      console.error(caughtError);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No se pudo actualizar el cliente."
      );

      return false;
    }
  }

  async function toggleClientStatus(
    id: string
  ): Promise<boolean> {
    if (!storeId) {
      setError("No se encontró la tienda.");
      return false;
    }

    const client = clients.find(
      (item) => item.id === id
    );

    if (!client) {
      setError("No se encontró el cliente.");
      return false;
    }

    const newStatus = !client.active;

    const { error: statusError } = await supabase
      .from("customers")
      .update({
        active: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("store_id", storeId);

    if (statusError) {
      console.error(statusError);
      setError(
        "No se pudo cambiar el estado del cliente."
      );
      return false;
    }

    setClients((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, active: newStatus }
          : item
      )
    );

    setError("");
    return true;
  }

  const filteredClients = [...clients]
    .filter((client) =>
      client.name
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      return Number(b.active) - Number(a.active);
    });

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredClients.length / itemsPerPage
    )
  );

  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    clients: paginatedClients,
    search,
    setSearch,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
    addClient,
    deleteClient,
    updateClient,
    toggleClientStatus,
    loading,
    error,
  };
}