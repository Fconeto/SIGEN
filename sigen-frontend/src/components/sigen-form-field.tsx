import { SigenLabel } from "@/components/sigen-label";
import { cn } from "@/lib/utils";

interface SigenFormFieldProps {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  labelStyle?: string;
}

export function SigenFormField({
  id,
  label,
  error,
  children,
}: SigenFormFieldProps) {
  return (
    <div className="space-y-1 :className">
      <SigenLabel htmlFor={id}>{label}</SigenLabel>
      {children}
      <p className="text-sm text-red-500 min-h-[1.25rem]">{error}</p>
    </div>
  );
}
