import { useEffect, useState } from "react";
import { ClientForm } from "./components/ClientForm";
import { ClientsTable } from "./components/ClientsTable";
import { useClients } from "./hooks/useClients";
import type { Client } from "./data/clientsData";

import { Message } from "../components/common/Message";
import { Toolbar } from "../components/common/Toolbar";
import { Pagination } from "../components/common/Pagination";

export function ClientsPage() {
  const {
    clients,
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
  } = useClients();

  const [editingClient, setEditingClient] =
    useState<Client | null>(null);

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  function handleAddClient(
    name: string,
    email: string,
    phone: string,
    city: string
  ) {
    addClient(name, email, phone, city);
    setMessage("Cliente creado correctamente.");
  }

  function handleUpdateClient(
    id: number,
    name: string,
    email: string,
    phone: string,
    city: string
  ) {
    updateClient(id, name, email, phone, city);
    setEditingClient(null);
    setMessage("Cliente actualizado correctamente.");
  }

  function handleDeleteClient(id: number) {
    deleteClient(id);
    setMessage("Cliente eliminado correctamente.");
  }

  return (
    <div>
      <div className="products-header">
        <div>
          <h1>Clientes</h1>
          <p>Administrá los clientes registrados.</p>
        </div>
      </div>

      <p>Total de clientes: {clients.length}</p>

      <Message message={message} />

      <Toolbar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        searchPlaceholder="Buscar cliente..."
      />

      <ClientForm
        editingClient={editingClient}
        onAddClient={handleAddClient}
        onUpdateClient={handleUpdateClient}
        onCancelEdit={() => setEditingClient(null)}
      />

      <ClientsTable
        clients={clients}
        onEditClient={setEditingClient}
        onDeleteClient={handleDeleteClient}
        onToggleClientStatus={toggleClientStatus}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={() => setCurrentPage(currentPage - 1)}
        onNext={() => setCurrentPage(currentPage + 1)}
      />
    </div>
  );
}