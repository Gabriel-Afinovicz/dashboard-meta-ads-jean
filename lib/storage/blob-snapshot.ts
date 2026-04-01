/**
 * Funções server-side para persistir e recuperar snapshots do dashboard no Vercel Blob.
 * Cada período (ex: "2026-03") é armazenado como um arquivo JSON separado.
 */
import { put, head } from "@vercel/blob";
import type { DashboardData } from "@/types/meta";

function getSnapshotKey(period: string): string {
  // period format: "YYYY-MM"  →  "dashboard-2026-03.json"
  return `dashboard-${period}.json`;
}

/**
 * Lê um snapshot salvo para o período informado.
 * Retorna null se não existir ainda.
 */
export async function readSnapshot(period: string): Promise<DashboardData | null> {
  const key = getSnapshotKey(period);

  try {
    // Verifica se o blob existe sem fazer download completo
    const blob = await head(key);
    if (!blob) return null;

    const response = await fetch(blob.url, { cache: "no-store" });
    if (!response.ok) return null;

    const data: DashboardData = await response.json();
    return data;
  } catch {
    return null;
  }
}

/**
 * Salva (ou sobrescreve) o snapshot de um período no Vercel Blob.
 */
export async function writeSnapshot(period: string, data: DashboardData): Promise<void> {
  const key = getSnapshotKey(period);
  const json = JSON.stringify(data);

  await put(key, json, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}
