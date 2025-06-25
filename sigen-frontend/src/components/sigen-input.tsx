import React, { useEffect, useRef } from "react";
import IMask, { InputMask } from "imask";
import { cn } from "@/lib/utils";

interface SigenInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask?: string;
}

export function SigenInput({ className, mask, ...props }: SigenInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const maskRef = useRef<InputMask<any> | null>(null);

  useEffect(() => {
    if (inputRef.current && mask) {
      maskRef.current = IMask(inputRef.current, { mask });

      return () => {
        maskRef.current?.destroy();
        maskRef.current = null;
      };
    }
  }, [mask]);

  return (
    <input
      ref={inputRef}
      className={cn(
        "w-full h-12 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-gray-400 transition-colors",
        className
      )}
      {...props}
    />
  );
}
