/**
 * Retorna o intervalo de datas do mês calendário anterior completo
 * Exemplo: se hoje é março/2026, retorna 2026-02-01 a 2026-02-28
 */
export function getLastMonthRange(): { since: string; until: string; label: string } {
  const now = new Date();

  const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfLastMonth = new Date(firstDayOfCurrentMonth.getTime() - 1);
  const firstDayOfLastMonth = new Date(lastDayOfLastMonth.getFullYear(), lastDayOfLastMonth.getMonth(), 1);

  const format = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];

  const label = `${monthNames[firstDayOfLastMonth.getMonth()]} ${firstDayOfLastMonth.getFullYear()}`;

  return {
    since: format(firstDayOfLastMonth),
    until: format(lastDayOfLastMonth),
    label,
  };
}
