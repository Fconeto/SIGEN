import { useState, useEffect, forwardRef } from "react";
import { format, parse, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SigenInput } from "./sigen-input";

export interface SigenDateInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  value?: Date;
  onChange?: (value: Date | undefined) => void;
  format?: "dd/MM/yyyy" | "MM/dd/yyyy";
  error?: boolean;
  onInvalidInput?: () => void;
}

const SigenDateInput = forwardRef<HTMLDivElement, SigenDateInputProps>(
  (
    {
      value,
      onChange,
      format: dateFormat = "dd/MM/yyyy",
      placeholder,
      error,
      disabled,
      className,
      onInvalidInput,
      id,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
      if (value && isValid(value)) {
        setInputValue(format(value, dateFormat));
      } else {
        setInputValue(inputValue);
      }
    }, [value, dateFormat]);

    const applyDateMask = (rawValue: string): string => {
      const digits = rawValue.replace(/\D/g, "").slice(0, 8);
      const len = digits.length;

      if (len === 0) return "";

      if (dateFormat === "dd/MM/yyyy") {
        if (len <= 2) return digits;
        if (len <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
        return `${digits.slice(0, 2)}/${digits.slice(2, 2 + 2)}/${digits.slice(
          4
        )}`;
      } else {
        if (len <= 2) return digits;
        if (len <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
        return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
      }
    };

    const parseDateFromInput = (value: string): Date | undefined => {
      const parsed = parse(value, dateFormat, new Date());
      return isValid(parsed) ? parsed : undefined;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const masked = applyDateMask(e.target.value);
      setInputValue(masked);

      if (masked.length === 10) {
        const parsedDate = parseDateFromInput(masked);
        if (parsedDate) {
          onChange?.(parsedDate);
        } else {
          onChange?.(undefined);
          onInvalidInput?.();
        }
      } else {
        onChange?.(undefined);
        onInvalidInput?.();
      }
    };

    const handleSelect = (selectedDate: Date | undefined) => {
      if (selectedDate) {
        const formatted = format(selectedDate, dateFormat);
        setInputValue(formatted);
        onChange?.(selectedDate);
        setOpen(false);
      }
    };

    const formatPlaceholder = () => {
      if (placeholder) return placeholder;
      return dateFormat === "dd/MM/yyyy" ? "DD/MM/AAAA" : "MM/DD/AAAA";
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <div className={cn("relative w-full", className)} ref={ref}>
          <SigenInput
            id={id}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={formatPlaceholder()}
            disabled={disabled}
            maxLength={10}
            {...props}
          />
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              disabled={disabled}
              onClick={() => setOpen((prev) => !prev)}
            >
              <CalendarIcon className="h-4 w-4 opacity-50" />
              <span className="sr-only">Abrir calendário</span>
            </Button>
          </PopoverTrigger>
        </div>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleSelect}
            disabled={disabled}
            locale={ptBR}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    );
  }
);

SigenDateInput.displayName = "SigenDateInput";

export { SigenDateInput };
