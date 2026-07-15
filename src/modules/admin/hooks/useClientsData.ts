import { useClients } from "../clients/hooks/useClients";

export function useClientsData() {
  const { clients } = useClients();

  return clients.filter((client) => client.active);
}