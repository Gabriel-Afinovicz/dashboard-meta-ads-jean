"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/format-currency";
import { formatCurrencyCompact } from "@/utils/format-currency";
import type { ClinicMetrics } from "@/types/meta";

interface InvestmentChartProps {
  clinics?: ClinicMetrics[];
  isLoading?: boolean;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 shadow-xl">
      <p className="mb-2 text-xs font-semibold text-zinc-300">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-zinc-400">{entry.name}:</span>
          <span className="font-medium text-zinc-200">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function InvestmentChart({ clinics, isLoading }: InvestmentChartProps) {
  if (isLoading || !clinics) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-52" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const data = clinics.map((clinic) => ({
    name:
      clinic.accountName.length > 18
        ? clinic.accountName.slice(0, 16) + "…"
        : clinic.accountName,
    fullName: clinic.accountName,
    Investimento: clinic.spend,
    "Fat. Estimado": clinic.estimatedRevenue,
  }));

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold text-zinc-200">
          Investimento × Faturamento estimado
        </CardTitle>
        <p className="text-xs text-zinc-500">
          Comparativo por clínica — dados do mês anterior
        </p>
      </CardHeader>
      <CardContent className="pb-6">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data}
            margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
            barGap={4}
            barCategoryGap="28%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "#71717a", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => formatCurrencyCompact(v)}
              tick={{ fill: "#71717a", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={72}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
            <Legend
              wrapperStyle={{ fontSize: "12px", color: "#a1a1aa", paddingTop: "16px" }}
              iconType="circle"
              iconSize={8}
            />
            <Bar
              dataKey="Investimento"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="Fat. Estimado"
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
