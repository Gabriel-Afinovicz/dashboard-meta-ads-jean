import type { MetaAction, MetaInsightRaw, ClinicMetrics } from "@/types/meta";
import { calculateEstimatedRevenue } from "@/utils/calculate-revenue";

/**
 * Action types reconhecidos como "lead" na Meta Marketing API.
 *
 * A Meta retorna diferentes tipos de ação dependendo da configuração do
 * pixel, objetivos da campanha e tipo de conversão. Este mapper consolida
 * todos os tipos relevantes para contabilizar um lead.
 *
 * Referência oficial: https://developers.facebook.com/docs/marketing-api/reference/ads-action-stats/
 */
const LEAD_ACTION_TYPES: Set<string> = new Set([
  "lead",
  "leadgen_grouped",
  "onsite_conversion.lead_grouped",
  "offsite_conversion.fb_pixel_lead",
  "contact",
  "schedule",
  "submit_application",
  "start_trial",
  "onsite_conversion.messaging_first_reply",
]);

/**
 * Soma todas as ações que se enquadram como "lead" no array de actions
 * retornado pela Meta API.
 */
export function extractLeadsFromActions(actions?: MetaAction[]): number {
  if (!actions || actions.length === 0) return 0;

  let total = 0;
  for (const action of actions) {
    if (LEAD_ACTION_TYPES.has(action.action_type)) {
      const parsed = parseFloat(action.value);
      if (!isNaN(parsed)) {
        total += parsed;
      }
    }
  }

  return Math.round(total);
}

/**
 * Normaliza um insight bruto da Meta API para o formato interno ClinicMetrics,
 * aplicando a regra de negócio de faturamento estimado.
 */
export function normalizeInsight(raw: MetaInsightRaw): ClinicMetrics {
  const spend = parseFloat(raw.spend ?? "0") || 0;
  const leads = extractLeadsFromActions(raw.actions);

  return {
    accountId: raw.account_id,
    accountName: raw.account_name,
    spend,
    leads,
    estimatedRevenue: calculateEstimatedRevenue(spend),
    period: {
      dateStart: raw.date_start,
      dateStop: raw.date_stop,
    },
  };
}
