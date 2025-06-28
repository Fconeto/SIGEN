"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SigenPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function SigenPagination({
  totalPages,
  currentPage,
  onPageChange,
  className,
}: SigenPaginationProps) {
  
  if (totalPages <= 1) {
    return null;
  }

  const getPaginationNumbers = () => {
    const delta = 1; 
    const range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }
    
    return range;
  };

  const paginationNumbers = getPaginationNumbers();

  return (
    <div className={cn("flex items-center justify-center gap-2 py-1", className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "flex items-center gap-2 px-3 text-sm font-medium rounded-lg transition-colors",
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Anterior</span>
      </button>
      
      <div className="flex items-center gap-1">
        {paginationNumbers.map((pageNumber, index) =>
          typeof pageNumber === "string" ? (
            <span key={`ellipsis-${index}`} className="px-2 py-2 text-gray-400 text-sm">
              ⋯
            </span>
          ) : (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={cn(
                "min-w-[40px] h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200",
                pageNumber === currentPage
                  ? "bg-sky-500 text-white shadow-md shadow-blue-600/25"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              {pageNumber}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        )}
      >
        <span className="hidden sm:inline">Próxima</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}