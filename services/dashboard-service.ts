/**
 * Serviço server-side que orquestra a busca e normalização dos dados do dashboard.
 * Não importar em client components.
 */
import { fetchAllAccountsInsights } from "@/lib/meta/fetch-meta-insights";
import { normalizeInsight } from "@/lib/meta/normalize-meta-data";
import { getLastMonthRange } from "@/lib/meta/get-last-month-range";
import { readSnapshot, writeSnapshot } from "@/lib/storage/blob-snapshot";
import type { DashboardData, DashboardSummary } from "@/types/meta";

interface GetDashboardDataOptions {
  forceRefresh?: boolean;
}

export async function getDashboardData(
  { forceRefresh = false }: GetDashboardDataOptions = {}
): Promise<DashboardData> {
  const { label, since, until } = getLastMonthRange();

  // Período no formato YYYY-MM para usar como chave do snapshot
  const period = since.substring(0, 7); // ex: "2026-03"

  // Se não for forçar refresh, tenta retornar o snapshot salvo
  if (!forceRefresh) {
    const cached = await readSnapshot(period);
    if (cached) {
      return cached;
    }
  }

  // Busca dados ao vivo na Meta API
  const rawInsights = await fetchAllAccountsInsights();
  const clinics = rawInsights.map(normalizeInsight).filter((c) => c.spend > 0);

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

  const now = new Date().toISOString();

  const data: DashboardData = {
    clinics,
    summary,
    lastUpdated: now,
    dataSource: "live",
  };

  // Salva automaticamente no Blob para futuras visitas
  await writeSnapshot(period, {
    ...data,
    dataSource: "snapshot",
    snapshotSavedAt: now,
  });

  return data;
}
