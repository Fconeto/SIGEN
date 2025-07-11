import { SigenLabel } from "@/components/sigen-label";
import { cn } from "@/lib/utils";
import React from "react";

interface SigenFormFieldProps {
  id: string;
  label: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}

export function SigenFormField({
  id,
  label,
  error,
  children,
  labelStyle,
}: SigenFormFieldProps) {
  return (
    <div>
      <SigenLabel htmlFor={id} className={cn("pl-1", labelStyle)}>
        {label}
      </SigenLabel>
      {children}
      <p className="text-sm text-red-500 min-h-[1.25rem]">{error}</p>
    </div>
  );
}
