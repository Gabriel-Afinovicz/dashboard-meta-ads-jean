"use client";

import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopbarProps {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

export function Topbar({ onToggleSidebar, sidebarOpen }: TopbarProps) {
  return (
    <header className="flex h-16 items-center border-b border-zinc-800 bg-zinc-950 px-4 lg:hidden">
      <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
        {sidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>
      <div className="ml-3">
        <p className="text-sm font-semibold text-zinc-100">Meta Clinic Dashboard</p>
      </div>
    </header>
  );
}
