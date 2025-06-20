import type React from "react";
import { cn } from "@/lib/utils";

interface SigenInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function SigenInput({ className, ...props }: SigenInputProps) {
  return (
    <input
      className={cn(
        "w-full h-12 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-gray-400 transition-colors",
        className
      )}
      {...props}
    />
  );
}
