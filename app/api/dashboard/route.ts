import { NextResponse } from "next/server";
import { getDashboardData } from "@/services/dashboard-service";
import type { ApiResponse, DashboardData } from "@/types/meta";

/**
 * GET /api/dashboard
 * Busca dados consolidados de todas as contas de anúncio configuradas no .env.
 * Executa exclusivamente no servidor — o token da Meta nunca é exposto ao cliente.
 */
export async function GET(): Promise<NextResponse<ApiResponse<DashboardData>>> {
  try {
    const data = await getDashboardData();
    return NextResponse.json({ status: "success", data });
  } catch (error) {
    console.error("[API /dashboard] Erro ao buscar dados:", error);

    const message =
      error instanceof Error ? error.message : "Erro interno ao buscar dados";

    return NextResponse.json(
      { status: "error", error: message },
      { status: 500 }
    );
  }
}
