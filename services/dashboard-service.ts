/**
 * Serviço server-side que orquestra a busca e normalização dos dados do dashboard.
 * Não importar em client components.
 */
import { fetchAllAccountsInsights } from "@/lib/meta/fetch-meta-insights";
import { normalizeInsight } from "@/lib/meta/normalize-meta-data";
import { getLastMonthRange } from "@/lib/meta/get-last-month-range";
import type { DashboardData, DashboardSummary } from "@/types/meta";

export async function getDashboardData(): Promise<DashboardData> {
  const rawInsights = await fetchAllAccountsInsights();
  const { label, since, until } = getLastMonthRange();

  const clinics = rawInsights.map(normalizeInsight);

  const summary: DashboardSummary = {
    totalSpend: clinics.reduce((acc, c) => acc + c.spend, 0),
    totalLeads: clinics.reduce((acc, c) => acc + c.leads, 0),
    totalEstimatedRevenue: clinics.reduce((acc, c) => acc + c.estimatedRevenue, 0),
    totalClinics: clinics.length,
    period: {
      label,
      dateStart: since,
      dateStop: until,
    },
  };

  return {
    clinics,
    summary,
    lastUpdated: new Date().toISOString(),
  };
}
