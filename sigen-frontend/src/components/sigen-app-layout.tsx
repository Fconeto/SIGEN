"use client";

import type React from "react";
import { SigenHeader } from "@/components/sigen-header";
import { cn } from "@/lib/utils";

interface SigenAppLayoutProps {
  children: React.ReactNode;
  headerTitle: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  showMenuButton?: boolean;
  onMenuClick?: () => void;
  showNotifications?: boolean;
  onNotificationsClick?: () => void;
  showProfile?: boolean;
  onProfileClick?: () => void;
  showLogoutButton?: boolean;
  onLogoutClick?: () => void;
  headerRightContent?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
}

export function SigenAppLayout({
  children,
  headerTitle,
  showBackButton = false,
  onBackClick,
  showLogoutButton = false,
  onLogoutClick,
  className,
  contentClassName,
  maxWidth = "md",
  padding = "md",
}: SigenAppLayoutProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full",
  };

  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div className={cn("min-h-screen bg-gray-100", className)}>
      <SigenHeader
        title={headerTitle}
        showBackButton={showBackButton}
        onBackClick={onBackClick}
        showLogoutButton={showLogoutButton}
        onLogoutClick={onLogoutClick}
      />

      <div className={cn("mx-auto", maxWidthClasses[maxWidth])}>
        <div className={cn(paddingClasses[padding], contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}
