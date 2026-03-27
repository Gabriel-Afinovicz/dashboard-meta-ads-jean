// Tipos base da Meta Marketing API

export interface MetaAction {
  action_type: string;
  value: string;
}

export interface MetaInsightRaw {
  account_id: string;
  account_name: string;
  spend: string;
  actions?: MetaAction[];
  date_start: string;
  date_stop: string;
}

export interface MetaInsightsResponse {
  data: MetaInsightRaw[];
  paging?: {
    cursors?: { before: string; after: string };
    next?: string;
  };
}

export interface MetaAccountInfo {
  id: string;
  name: string;
}

// Tipo normalizado para uso interno no dashboard
export interface ClinicMetrics {
  accountId: string;
  accountName: string;
  spend: number;
  leads: number;
  estimatedRevenue: number;
  period: {
    dateStart: string;
    dateStop: string;
  };
}

// Totais consolidados para os cards de resumo
export interface DashboardSummary {
  totalSpend: number;
  totalLeads: number;
  totalEstimatedRevenue: number;
  totalClinics: number;
  period: {
    label: string;
    dateStart: string;
    dateStop: string;
  };
}

// Estado da requisição da API
export type FetchStatus = "idle" | "loading" | "success" | "error";

export interface DashboardData {
  clinics: ClinicMetrics[];
  summary: DashboardSummary;
  lastUpdated: string;
}

// Resposta da API route interna
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: "success" | "error";
}
