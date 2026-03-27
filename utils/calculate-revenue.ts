/** Multiplicador fixo aplicado ao investimento para estimar faturamento */
export const REVENUE_MULTIPLIER = 10;

/**
 * Calcula o faturamento estimado com base no investimento
 * Regra de negócio: faturamento = investimento × 10
 */
export function calculateEstimatedRevenue(spend: number): number {
  return spend * REVENUE_MULTIPLIER;
}
