import { createContext, useContext, useState, ReactNode } from "react";
import { mockClients as initialClients } from "@/data/mockData";
import type { Client, ClientStatus, Sector } from "@/types";

interface ClientContextType {
  clients: Client[];
  updateStatus: (id: string, status: ClientStatus) => void;
  deleteClient: (id: string) => void;
  addClient: (name: string, sector: Sector, amount: number) => void;
  uploadDocument: (clientId: string, docId: string, fileName: string) => void;
  removeFile: (clientId: string, docId: string, fileId: string) => void;
}

const ClientContext = createContext<ClientContextType | null>(null);

export const useClients = () => {
  const ctx = useContext(ClientContext);
  if (!ctx) throw new Error("useClients must be used within ClientProvider");
  return ctx;
};

const createDocumentChecklist = () => [
  { id: "d1", name: "Presentación / Curriculum de la empresa", category: "proyecto_inversion" as const, uploaded: false },
  { id: "d2", name: "Resumen ejecutivo", category: "proyecto_inversion" as const, uploaded: false },
  { id: "d3", name: "Proyecciones financieras", category: "proyecto_inversion" as const, uploaded: false },
  { id: "d4", name: "Cuadro descriptivo estructura directiva", category: "proyecto_inversion" as const, uploaded: false },
  { id: "d5", name: "CV principales directivos y socios", category: "proyecto_inversion" as const, uploaded: false },
  { id: "d6", name: "Acta Constitutiva", category: "legal" as const, uploaded: false },
  { id: "d7", name: "Poderes y Asambleas", category: "legal" as const, uploaded: false },
  { id: "d8", name: "Estados Financieros 2019", category: "financiera" as const, uploaded: false },
  { id: "d9", name: "Estados Financieros 2020", category: "financiera" as const, uploaded: false },
  { id: "d10", name: "Estado Financiero Parcial 2021", category: "financiera" as const, uploaded: false },
  { id: "d11", name: "Estados de cuenta bancarios (últimos 12 meses)", category: "financiera" as const, uploaded: false },
  { id: "d12", name: "Proyecciones Financieras del proyecto", category: "financiera" as const, uploaded: false },
  { id: "d13", name: "Constancia de Situación Fiscal", category: "fiscal" as const, uploaded: false },
  { id: "d14", name: "Declaración anual 2019", category: "fiscal" as const, uploaded: false },
  { id: "d15", name: "Declaración anual 2020", category: "fiscal" as const, uploaded: false },
  { id: "d16", name: "Últimas 3 declaraciones provisionales", category: "fiscal" as const, uploaded: false },
  { id: "d17", name: "Comprobante de domicilio fiscal", category: "fiscal" as const, uploaded: false },
  { id: "d18", name: "Reporte buró de crédito Especial PM", category: "buro_credito" as const, uploaded: false },
  { id: "d19", name: "Reporte buró de crédito Especial Socios/RL", category: "buro_credito" as const, uploaded: false },
];

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>(initialClients);

  const updateStatus = (id: string, status: ClientStatus) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const addClient = (name: string, sector: Sector, amount: number) => {
    const newId = String(clients.length + 1).padStart(3, "0");
    const newClient: Client = {
      id: newId,
      companyName: name,
      sector,
      amountRequested: amount,
      status: "en_analisis",
      createdAt: new Date().toISOString().split("T")[0],
      analystEmail: "analista@pontifex.com",
      documents: createDocumentChecklist(),
      financialRatios: [],
      monthlyFlows: [],
      covenants: [],
    };
    setClients(prev => [...prev, newClient]);
  };

  const uploadDocument = (clientId: string, docId: string, fileName: string) => {
    setClients(prev => prev.map(c => {
      if (c.id !== clientId) return c;
      return {
        ...c,
        documents: c.documents.map(d =>
          d.id === docId
            ? { ...d, uploaded: true, fileName, uploadDate: new Date().toISOString().split("T")[0] }
            : d
        ),
      };
    }));
  };

  return (
    <ClientContext.Provider value={{ clients, updateStatus, deleteClient, addClient, uploadDocument }}>
      {children}
    </ClientContext.Provider>
  );
};
