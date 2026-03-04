import { createContext, useContext, useState, ReactNode } from "react";
import { mockClients as initialClients } from "@/data/mockData";
import type { Client, ClientStatus } from "@/types";

interface ClientContextType {
  clients: Client[];
  updateStatus: (id: string, status: ClientStatus) => void;
  deleteClient: (id: string) => void;
}

const ClientContext = createContext<ClientContextType | null>(null);

export const useClients = () => {
  const ctx = useContext(ClientContext);
  if (!ctx) throw new Error("useClients must be used within ClientProvider");
  return ctx;
};

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>(initialClients);

  const updateStatus = (id: string, status: ClientStatus) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  return (
    <ClientContext.Provider value={{ clients, updateStatus, deleteClient }}>
      {children}
    </ClientContext.Provider>
  );
};
