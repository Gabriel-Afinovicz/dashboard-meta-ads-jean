"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5 px-8 py-16 text-center">
      <div className="mb-4 rounded-full border border-red-500/20 bg-red-500/10 p-3">
        <AlertTriangle className="h-6 w-6 text-red-400" />
      </div>
      <h3 className="mb-2 text-base font-semibold text-zinc-200">
        Não foi possível carregar os dados
      </h3>
      <p className="mb-1 max-w-md text-sm text-zinc-500">
        {message ?? "Ocorreu um erro ao buscar os dados da Meta Marketing API."}
      </p>
      <p className="mb-6 max-w-md text-xs text-zinc-600">
        Verifique se o token de acesso está configurado corretamente no arquivo .env e se as contas de anúncio estão ativas.
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="h-3.5 w-3.5" />
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
