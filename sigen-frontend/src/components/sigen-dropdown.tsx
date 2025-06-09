"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownOption {
  value: string;
  label: string;
}

interface SigenDropdownProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  options: DropdownOption[];
  className?: string;
}

export function SigenDropdown({
  value,
  onValueChange,
  placeholder = "Selecione uma opção",
  options,
  className,
}: SigenDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-12 px-3 py-2 bg-white border border-gray-300 rounded-md text-left flex items-center justify-between focus:outline-none focus:border-gray-400 transition-colors",
          className
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={cn("text-sm", !selectedOption && "text-gray-500")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={cn(
                "w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between transition-colors",
                value === option.value && "bg-gray-50"
              )}
              role="option"
              aria-selected={value === option.value}
            >
              <span>{option.label}</span>
              {value === option.value && (
                <Check className="h-4 w-4 text-gray-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
