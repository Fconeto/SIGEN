import type React from "react";
import { cn } from "@/lib/utils";

interface SigenLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export function SigenLabel({ className, children, ...props }: SigenLabelProps) {
  return (
    <label
      className={cn("text-sm font-medium text-gray-700", className)}
      {...props}
    >
      {children}
    </label>
  );
}
