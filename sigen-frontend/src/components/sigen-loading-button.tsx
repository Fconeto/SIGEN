import type React from "react";

import { Loader2 } from "lucide-react";
import { SigenButton } from "@/components/sigen-button";
import { cn } from "@/lib/utils";

interface SigenLoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
}

export function SigenLoadingButton({
  loading = false,
  children,
  className,
  disabled,
  ...props
}: SigenLoadingButtonProps) {
  return (
    <SigenButton
      className={cn("w-full", className)}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </SigenButton>
  );
}
