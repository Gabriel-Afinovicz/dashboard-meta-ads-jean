import { NextResponse } from "next/server";
import { getDashboardData } from "@/services/dashboard-service";
import type { ApiResponse, DashboardData } from "@/types/meta";

export async function POST(): Promise<NextResponse<ApiResponse<DashboardData>>> {
  try {
    const data = await getDashboardData({ forceRefresh: true });
    return NextResponse.json({ status: "success", data });
  } catch (error) {
    console.error("[API /snapshot] Erro ao salvar snapshot:", error);
    const message =
      error instanceof Error ? error.message : "Erro interno ao salvar snapshot";
    return NextResponse.json(
      { status: "error", error: message },
      { status: 500 }
    );
  }
}
