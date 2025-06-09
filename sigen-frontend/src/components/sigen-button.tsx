"use client";

import type React from "react";
import { cn } from "@/lib/utils";

interface SigenButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost";
  size?: "default" | "icon";
  children: React.ReactNode;
}

export function SigenButton({
  variant = "default",
  size = "default",
  className,
  children,
  ...props
}: SigenButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none",
        {
          "bg-yellow-400 text-gray-900 hover:bg-yellow-500 h-12 px-4":
            variant === "default",
          "hover:bg-gray-100 hover:text-gray-900": variant === "ghost",
          "h-10 w-10": size === "icon",
          "h-12 px-4": size === "default",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
