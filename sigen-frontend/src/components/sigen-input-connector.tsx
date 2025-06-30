import { cn } from "@/lib/utils";

interface SigenInputConnectorProps {
  children: React.ReactNode;
  className?: string;
  showLine?: boolean;
}

export function SigenInputConnector({ children, className, showLine }: SigenInputConnectorProps) {
  return (
    <div
      className={cn(
        showLine && [
          "relative",
          "before:content-['']",
          "before:absolute",
          "before:left-4",
          "before:top-11",
          "before:w-6",
          "before:h-20",
          "before:border-b",
          "before:border-l",
          "before:border-gray-400/60",
          "before:rounded-bl-lg",
        ],
        className
      )}
    >
      {children}
    </div>
  );
}