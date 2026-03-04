export type ClientStatus = "en_analisis" | "aprobado" | "rechazado";

export type RiskClass = "A" | "B" | "C" | "Rechazado";

export type Sector = 
  | "Construcción" 
  | "Agricultura" 
  | "Transporte" 
  | "Comercio" 
  | "Industria" 
  | "Servicios" 
  | "Primario" 
  | "Tecnología" 
  | "Alimentos" 
  | "Manufactura";

export type DocumentCategory = "proyecto_inversion" | "legal" | "financiera" | "fiscal" | "buro_credito";

export interface DocumentItem {
  id: string;
  name: string;
  category: DocumentCategory;
  uploaded: boolean;
  fileName?: string;
  uploadDate?: string;
}

export interface FinancialRatio {
  name: string;
  value: number;
  status: "healthy" | "warning" | "critical";
}

export interface MonthlyFlow {
  month: string;
  ingresos: number;
  egresos: number;
}

export interface Covenant {
  name: string;
  description: string;
  status: "saludable" | "preventivo" | "critico";
}

export interface Client {
  id: string;
  companyName: string;
  rfc?: string;
  sector: Sector;
  amountRequested: number;
  status: ClientStatus;
  riskClass?: RiskClass;
  score?: number;
  dscr?: number;
  deudaEbitda?: number;
  createdAt: string;
  analystEmail?: string;
  documents: DocumentItem[];
  financialRatios: FinancialRatio[];
  monthlyFlows: MonthlyFlow[];
  covenants: Covenant[];
  yearsOperating?: number;
  employees?: number;
  annualRevenue?: number;
  creditDestination?: string;
}

export type PartnerTier = "ORO" | "PLATA" | "BRONCE" | "REVISION";
export type PartnerType = "BANCO" | "FINANCIERA" | "FINTECH" | "TPV" | "BANCA DE INVERSION";
export type CoverageLevel = "Local" | "Estatal" | "Regional" | "Nacional";

export interface Partner {
  id: string;
  name: string;
  tier: PartnerTier;
  type: PartnerType;
  hasContract: boolean;
  isProfitable: boolean;
  coverage: CoverageLevel[];
  products: {
    creditoSimple: boolean;
    creditoRevolvente: boolean;
    factoraje: boolean;
    arrendamiento: boolean;
  };
  experience: {
    lessThan1Year: boolean;
    oneYear: boolean;
    twoOrMoreYears: boolean;
  };
  sectors: {
    comercio: boolean;
    industria: boolean;
    servicios: boolean;
    primario: boolean;
  };
  buró: {
    excelente: boolean;
    bueno: boolean;
    regular: boolean;
    malo: boolean;
  };
  guarantees: {
    avalObligado: boolean;
    relacionPatrimonial: boolean;
    hipotecaria: boolean;
    prendaria: boolean;
    liquida: boolean;
    contratos: boolean;
  };
  solvency: {
    utilidad: boolean;
    perdida: boolean;
    quiebraTecnica: boolean;
  };
}
