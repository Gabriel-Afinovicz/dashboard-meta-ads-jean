/**
 * Módulo server-side exclusivo para comunicação com a Meta Marketing API.
 * NÃO importar este arquivo no frontend/client components.
 */
import type { MetaInsightsResponse, MetaInsightRaw } from "@/types/meta";
import { getLastMonthRange } from "./get-last-month-range";

const META_BASE_URL = "https://graph.facebook.com";

function getEnvOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória não definida: ${key}`);
  }
  return value;
}

function getAdAccountIds(): string[] {
  const raw = getEnvOrThrow("META_AD_ACCOUNT_IDS");
  return raw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

/**
 * Busca os insights de uma única conta de anúncio para o mês passado completo.
 */
async function fetchAccountInsights(
  accountId: string,
  accessToken: string,
  apiVersion: string,
  since: string,
  until: string
): Promise<MetaInsightRaw | null> {
  const fields = [
    "account_id",
    "account_name",
    "spend",
    "actions",
    "date_start",
    "date_stop",
  ].join(",");

  const params = new URLSearchParams({
    access_token: accessToken,
    fields,
    time_range: JSON.stringify({ since, until }),
    time_increment: "all_days",
    level: "account",
  });

  const url = `${META_BASE_URL}/${apiVersion}/${accountId}/insights?${params.toString()}`;

  const response = await fetch(url, {
    next: { revalidate: 0 }, // sem cache — dados financeiros sempre frescos
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`[Meta API] Erro ao buscar conta ${accountId}:`, errorBody);
    throw new Error(`Meta API retornou status ${response.status} para ${accountId}`);
  }

  const json: MetaInsightsResponse = await response.json();

  if (!json.data || json.data.length === 0) {
    // Conta sem dados no período — retornar estrutura zerada
    return null;
  }

  // Agrega todos os registros (pode vir paginado por dia se time_increment != all_days)
  return json.data[0];
}

/**
 * Busca os insights de todas as contas configuradas no .env
 * e retorna a lista de dados brutos.
 *
 * Contas sem dados no período retornam estrutura zerada em vez de null
 * para garantir que apareçam no dashboard.
 */
export async function fetchAllAccountsInsights(): Promise<MetaInsightRaw[]> {
  const accessToken = getEnvOrThrow("META_ACCESS_TOKEN");
  const apiVersion = process.env.META_API_VERSION ?? "v25.0";
  const accountIds = getAdAccountIds();
  const { since, until } = getLastMonthRange();

  const results = await Promise.allSettled(
    accountIds.map((id) =>
      fetchAccountInsights(id, accessToken, apiVersion, since, until)
    )
  );

  const insights: MetaInsightRaw[] = [];

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const accountId = accountIds[i];

    if (result.status === "fulfilled") {
      if (result.value) {
        insights.push(result.value);
      } else {
        // Sem dados no período — adiciona estrutura zerada para manter visibilidade no dashboard
        insights.push({
          account_id: accountId.replace("act_", ""),
          account_name: `Conta ${accountId}`,
          spend: "0",
          actions: [],
          date_start: since,
          date_stop: until,
        });
      }
    } else {
      console.error(`[Meta API] Falha ao buscar ${accountId}:`, result.reason);
      // Inclui no dashboard com erro indicado no nome
      insights.push({
        account_id: accountId.replace("act_", ""),
        account_name: `Conta ${accountId} (erro na busca)`,
        spend: "0",
        actions: [],
        date_start: since,
        date_stop: until,
      });
    }
  }

  return insights;
}
