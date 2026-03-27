"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, CheckCircle2 } from "lucide-react";
import { SummaryCards } from "./summary-cards";
import { ClinicsTable } from "./clinics-table";
import { InvestmentChart } from "./investment-chart";
import { ErrorState } from "./error-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DashboardData, FetchStatus } from "@/types/meta";

function formatLastUpdated(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function DashboardView() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const fetchData = useCallback(async () => {
    setStatus("loading");
    setErrorMessage(undefined);

    try {
      const response = await fetch("/api/dashboard", { cache: "no-store" });
      const json = await response.json();

      if (!response.ok || json.status === "error") {
        throw new Error(json.error ?? "Erro desconhecido");
      }

      setData(json.data);
      setStatus("success");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erro ao carregar dados");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isLoading = status === "idle" || status === "loading";

  return (
    <div className="space-y-8">
      {/* Header da página */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
              Dashboard Meta Ads
            </h1>
            <Badge variant="blue">
              <CheckCircle2 className="h-3 w-3" />
              Dados oficiais via Meta Marketing API
            </Badge>
          </div>
          <p className="text-sm text-zinc-500">
            Visão consolidada do mês anterior
            {data?.summary.period.label && (
              <span className="ml-1 font-medium text-zinc-400">
                — {data.summary.period.label}
              </span>
            )}
          </p>
          {data?.lastUpdated && (
            <p className="mt-1 text-xs text-zinc-600">
              Última atualização: {formatLastUpdated(data.lastUpdated)}
            </p>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchData}
          disabled={isLoading}
          className="shrink-0 self-start"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Atualizando…" : "Atualizar dados"}
        </Button>
      </div>

      {/* Aviso informativo */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3">
        <p className="text-xs leading-relaxed text-zinc-500">
          <span className="font-medium text-zinc-400">Sobre os dados:</span> Os dados de
          investimento e desempenho são consultados diretamente da API oficial da Meta. O
          faturamento exibido é apenas uma estimativa interna calculada com base em 10× o
          valor investido — não representa dado real fornecido pela Meta.
        </p>
      </div>

      {/* Cards de resumo */}
      <SummaryCards summary={data?.summary} isLoading={isLoading} />

      {/* Estado de erro */}
      {status === "error" && (
        <ErrorState message={errorMessage} onRetry={fetchData} />
      )}

      {/* Tabela de clínicas */}
      {status !== "error" && (
        <ClinicsTable clinics={data?.clinics} isLoading={isLoading} />
      )}

      {/* Gráfico comparativo */}
      {status !== "error" && (
        <InvestmentChart clinics={data?.clinics} isLoading={isLoading} />
      )}
    </div>
  );
}
