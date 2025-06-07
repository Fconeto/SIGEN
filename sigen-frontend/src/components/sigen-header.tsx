"use client";

import type React from "react";
import { ArrowLeft, Menu, Bell, User } from "lucide-react";
import { SigenButton } from "@/components/sigen-button";
import { cn } from "@/lib/utils";

interface SigenHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  showMenuButton?: boolean;
  onMenuClick?: () => void;
  showNotifications?: boolean;
  onNotificationsClick?: () => void;
  showProfile?: boolean;
  onProfileClick?: () => void;
  rightContent?: React.ReactNode;
  className?: string;
}

export function SigenHeader({
  title,
  showBackButton = false,
  onBackClick,
  showMenuButton = false,
  onMenuClick,
  showNotifications = false,
  onNotificationsClick,
  showProfile = false,
  onProfileClick,
  rightContent,
  className,
}: SigenHeaderProps) {
  return (
    <div className={cn("bg-gray-800 sticky top-0 z-50 shadow-sm", className)}>
      <div className="flex items-center justify-between p-4 max-w-md mx-auto">
        <div className="flex items-center">
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

          {showMenuButton && (
            <SigenButton
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-700 mr-2"
              onClick={onMenuClick}
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </SigenButton>
          )}
        </div>

        <h1 className="text-lg font-medium text-white text-center flex-1 px-4 truncate">
          {title}
        </h1>

        <div className="flex items-center space-x-2">
          {showNotifications && (
            <SigenButton
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-700"
              onClick={onNotificationsClick}
              aria-label="Notificações"
            >
              <Bell className="h-5 w-5" />
            </SigenButton>
          )}

          {showProfile && (
            <SigenButton
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-700"
              onClick={onProfileClick}
              aria-label="Perfil"
            >
              <User className="h-5 w-5" />
            </SigenButton>
          )}

          {rightContent}
        </div>
      </div>
    </div>
  );
}
