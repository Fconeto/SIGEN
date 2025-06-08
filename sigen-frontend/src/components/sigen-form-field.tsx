import { SigenLabel } from "@/components/sigen-label";
import { cn } from "@/lib/utils";

interface SigenFormFieldProps {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

export function SigenFormField({
  id,
  label,
  error,
  children,
}: SigenFormFieldProps) {
  return (
    <div className="space-y-1">
      <SigenLabel htmlFor={id}>{label}</SigenLabel>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
