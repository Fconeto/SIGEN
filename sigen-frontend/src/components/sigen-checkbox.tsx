import type React from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface SigenCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: boolean;
  variant?: "default" | "small" | "large";
}

const SigenCheckbox = forwardRef<HTMLInputElement, SigenCheckboxProps>(
  ({ className, label, error, variant = "default", id, ...props }, ref) => {
    const sizeClasses = {
      small: "h-4 w-4",
      default: "h-5 w-5",
      large: "h-6 w-6",
    };

    const checkIconSizes = {
      small: "h-3 w-3",
      default: "h-4 w-4",
      large: "h-5 w-5",
    };

    return (
      <div className="flex items-center space-x-2">
        <div className="relative">
          <input
            type="checkbox"
            className={cn("peer sr-only", className)}
            id={id}
            ref={ref}
            {...props}
          />
          <div
            className={cn(
              "border-2 rounded-md bg-background transition-all duration-200 cursor-pointer",
              "peer-checked:bg-primary peer-checked:border-primary",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
              "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
              error && "border-red-500 peer-focus-visible:ring-red-500",
              !error && "border-input hover:border-primary/50",
              sizeClasses[variant]
            )}
          >
            <Check
              className={cn(
                "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity duration-200",
                checkIconSizes[variant]
              )}
            />
          </div>
        </div>
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "text-sm font-medium leading-none cursor-pointer",
              "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              error && "text-red-500"
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

SigenCheckbox.displayName = "SigenCheckbox";

export { SigenCheckbox };
