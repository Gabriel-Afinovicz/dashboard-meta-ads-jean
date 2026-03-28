"use client";

import { TrendingUp, Users, DollarSign, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/format-currency";
import { formatNumber } from "@/utils/format-number";
import type { DashboardSummary } from "@/types/meta";

interface SummaryCardsProps {
  summary?: DashboardSummary;
  isLoading?: boolean;
}

interface SummaryCardData {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  accent: string;
}

function SummaryCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-3 w-24" />
      </CardContent>
    </Card>
  );
}

export function SummaryCards({ summary, isLoading }: SummaryCardsProps) {
  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SummaryCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const cards: SummaryCardData[] = [
    {
      title: "Investimento total",
      value: formatCurrency(summary.totalSpend),
      subtitle: summary.period.label,
      icon: <DollarSign className="h-4 w-4" />,
      accent: "text-blue-400",
    },
    {
      title: "Leads gerados",
      value: formatNumber(summary.totalLeads),
      subtitle: "Leads reconhecidos pela Meta",
      icon: <Users className="h-4 w-4" />,
      accent: "text-emerald-400",
    },
    {
      title: "Faturamento estimado",
      value: formatCurrency(summary.totalEstimatedRevenue),
      subtitle: "Estimativa com base no investimento",
      icon: <TrendingUp className="h-4 w-4" />,
      accent: "text-violet-400",
    },
    {
      title: "Clínicas monitoradas",
      value: formatNumber(summary.totalClinics),
      subtitle: "Contas de anúncio ativas",
      icon: <Building2 className="h-4 w-4" />,
      accent: "text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>{card.title}</span>
              <span className={card.accent}>{card.icon}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold tracking-tight ${card.accent}`}>
              {card.value}
            </p>
            {card.subtitle && (
              <p className="mt-1 text-xs text-zinc-500">{card.subtitle}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
