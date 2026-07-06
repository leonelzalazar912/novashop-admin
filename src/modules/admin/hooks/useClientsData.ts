import { useMemo } from "react";
import { initialClients, type Client } from "../clients/data/clientsData";

export function useClientsData() {
  const clients = useMemo<Client[]>(() => {
    const stored = localStorage.getItem("clients");

    if (!stored) {
      return initialClients;
    }

    try {
      return JSON.parse(stored);
    } catch {
      return initialClients;
    }
  }, []);

  return clients.filter((client) => client.active);
}