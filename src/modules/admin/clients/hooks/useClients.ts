import { useEffect, useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import {
  initialClients,
  type Client,
} from "../data/clientsData";

export function useClients() {
  const [clients, setClients] = useLocalStorage<Client[]>(
    "clients",
    initialClients
  );

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "status">("name");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy]);

  function addClient(
    name: string,
    email: string,
    phone: string,
    city: string
  ) {
    const clientExists = clients.some(
      (client) =>
        client.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (clientExists) return;

    const newClient: Client = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      active: true,
    };

    setClients((prev) => [...prev, newClient]);
  }

  function deleteClient(id: number) {
    setClients((prev) =>
      prev.filter((client) => client.id !== id)
    );
  }

  function updateClient(
    id: number,
    name: string,
    email: string,
    phone: string,
    city: string
  ) {
    const clientExists = clients.some(
      (client) =>
        client.id !== id &&
        client.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (clientExists) return;

    setClients((prev) =>
      prev.map((client) =>
        client.id === id
          ? {
              ...client,
              name: name.trim(),
              email: email.trim(),
              phone: phone.trim(),
              city: city.trim(),
            }
          : client
      )
    );
  }

  function toggleClientStatus(id: number) {
    setClients((prev) =>
      prev.map((client) =>
        client.id === id
          ? { ...client, active: !client.active }
          : client
      )
    );
  }

  const filteredClients = [...clients]
    .filter((client) =>
      client.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      return Number(b.active) - Number(a.active);
    });

  const totalPages = Math.ceil(
    filteredClients.length / itemsPerPage
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
  };
}