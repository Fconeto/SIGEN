import { SigenLabel } from "@/components/sigen-label";
import { cn } from "@/lib/utils";

interface SigenFormFieldProps {
  id: string;
  label: string;
  error?: string;
  labelStyle?: string;
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
      <SigenLabel htmlFor={id} className={cn("pl-1", labelStyle)}>{label}</SigenLabel>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
