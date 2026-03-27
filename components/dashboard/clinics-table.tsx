"use client";

import { Building2, Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/format-currency";
import { formatNumber } from "@/utils/format-number";
import { REVENUE_MULTIPLIER } from "@/utils/calculate-revenue";
import type { ClinicMetrics } from "@/types/meta";

interface ClinicsTableProps {
  clinics?: ClinicMetrics[];
  isLoading?: boolean;
}

function TableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PerformanceDot({ spend }: { spend: number }) {
  if (spend >= 10000) return <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" title="Alto investimento" />;
  if (spend >= 3000) return <span className="inline-block h-2 w-2 rounded-full bg-amber-400" title="Investimento médio" />;
  return <span className="inline-block h-2 w-2 rounded-full bg-zinc-500" title="Baixo investimento" />;
}

export function ClinicsTable({ clinics, isLoading }: ClinicsTableProps) {
  if (isLoading || !clinics) return <TableSkeleton />;

  if (clinics.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Building2 className="mx-auto mb-3 h-8 w-8 text-zinc-600" />
          <p className="text-sm text-zinc-500">Nenhuma clínica encontrada para o período selecionado.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold text-zinc-200">
          Desempenho por clínica
        </CardTitle>
        <p className="text-xs text-zinc-500">
          Dados de investimento e performance consultados via Meta Marketing API
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-left text-xs text-zinc-500">
                <th className="px-6 py-3 font-medium">Clínica</th>
                <th className="px-4 py-3 font-medium">Conta de anúncio</th>
                <th className="px-4 py-3 font-medium text-right">Investimento</th>
                <th className="px-4 py-3 font-medium text-right">Leads</th>
                <th className="px-4 py-3 font-medium text-right">Faturamento estimado</th>
                <th className="px-4 py-3 font-medium text-center">Multiplicador</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {clinics.map((clinic) => (
                <tr
                  key={clinic.accountId}
                  className="group transition-colors hover:bg-zinc-800/30"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <PerformanceDot spend={clinic.spend} />
                      <div>
                        <p className="font-medium text-zinc-200 group-hover:text-white">
                          {clinic.accountName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <Hash className="h-3 w-3" />
                      <span className="font-mono text-xs">{clinic.accountId}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="font-medium text-zinc-200">
                      {formatCurrency(clinic.spend)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="font-medium text-emerald-400">
                      {formatNumber(clinic.leads)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="font-medium text-violet-400">
                      {formatCurrency(clinic.estimatedRevenue)}
                    </span>
                    <p className="mt-0.5 text-xs text-zinc-600">estimativa interna</p>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Badge variant="blue">{REVENUE_MULTIPLIER}×</Badge>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {clinic.spend > 0 ? (
                      <Badge variant="success">Ativo</Badge>
                    ) : (
                      <Badge variant="outline">Sem dados</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-zinc-800 px-6 py-3">
          <p className="text-xs text-zinc-600">
            * O faturamento exibido é apenas uma estimativa interna calculada com base em {REVENUE_MULTIPLIER}× o valor
            investido. Não representa dado real da Meta.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
