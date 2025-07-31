import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";


interface DropdownOption<T extends Object> {
  value: T;
  label: string;
}

interface SigenDropdownProps<T extends Object> {
  value?: T;
  onValueChange: (value: T) => void;
  placeholder?: string;
  options: DropdownOption<T>[];
  className?: string;
  canDigit?: boolean; 
}

export function SigenDropdown<T extends Object>({
  value,
  onValueChange,
  placeholder = "Selecione uma opção",
  options,
  className,
  canDigit = false, 
}: SigenDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = canDigit
    ? options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
      )
    : options; 

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

  const handleSelect = (optionValue: T, optionLabel: string) => {
    onValueChange(optionValue);
    setSearch(optionLabel);
    setIsOpen(false);
  };

  useEffect(() => {
    if (value === undefined) {
      setSearch("");
      return;
    }
    const newOption = options.find((opt) => opt.value === value);
    if (newOption) setSearch(newOption.label);
  }, [value, options]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative" onClick={() => setIsOpen(true)}>
        <input
          type="text"
          value={search}
          placeholder={placeholder}
          tabIndex={canDigit ? 0 : -1}
          onChange={(e) => {
            if (canDigit) {
              setSearch(e.target.value);
              setIsOpen(true);
            }
          }}
          onFocus={() => canDigit && setIsOpen(true)}
          className={cn(
            "w-full h-12 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm transition-colors",
       
              "cursor-default focus:outline-none focus:border-gray-400",
           
            className
          )}
          style={!canDigit ? { caretColor: "transparent" } : undefined}
        />
        <ChevronDown
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option.value.toString()}
                type="button"
                onClick={() => handleSelect(option.value, option.label)}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between transition-colors",
                  value === option.value && "bg-gray-50"
                )}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <Check className="h-4 w-4 text-gray-600" />
                )}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">
              Nenhuma opção encontrada
            </div>
          )}
        </div>
      )}
    </div>
  );
}
