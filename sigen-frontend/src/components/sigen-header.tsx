"use client";

import type React from "react";
import { ArrowLeft, LogOut } from "lucide-react";
import { SigenButton } from "@/components/sigen-button";
import { cn } from "@/lib/utils";

interface SigenHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  showLogoutButton?: boolean;
  onLogoutClick?: () => void;
  className?: string;
}

export function SigenHeader({
  title,
  showBackButton = false,
  onBackClick,
  showLogoutButton = false,
  onLogoutClick,
  className,
}: SigenHeaderProps) {
  return (
    <div className={cn("bg-gray-800 sticky top-0 z-50 shadow-sm", className)}>
      <div className="grid grid-cols-3 items-center p-4 max-w-md mx-auto">
        <div className="flex items-center">
          {showLogoutButton && (
            <SigenButton
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-700"
              onClick={onLogoutClick}
              aria-label="Sair"
            >
              <LogOut className="h-5 w-5" />
            </SigenButton>
          )}

          {showBackButton && (
            <SigenButton
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-700 mr-2"
              onClick={onBackClick}
              aria-label="Voltar"
            >
              <ArrowLeft className="h-5 w-5" />
            </SigenButton>
          )}
        </div>

        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-medium text-white text-center whitespace-normal">
          {title}
        </h1>
      </div>
    </div>
  );
}
