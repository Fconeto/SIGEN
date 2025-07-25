import type React from "react";
import { ArrowDown, ArrowUp, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableResidence {
  id: string;
  complemento: string;
  numero: string;
  nomeDoMorador: string;
}

type SortKey = keyof TableResidence;

interface ResidenceTableProps {
  residences: TableResidence[];
  complementId?: string; // 1. Adicionado de volta o prop opcional
  viewResidence?: (id: string) => void;
  className?: string;
  onSort: (key: SortKey) => void;
  sortConfig: { key: SortKey; direction: string } | null;
  actionIcon?: React.ReactNode;
  actionColor?: "gray" | "green" | "red" | "blue";
}

export function SigenTable({
  residences,
  complementId, // 2. Adicionado de volta na desestruturação dos props
  viewResidence,
  className,
  onSort,
  sortConfig,
  actionIcon = <Eye size={15} />,
  actionColor = "gray",
}: ResidenceTableProps) {
  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <span className="h-4 w-4 flex-shrink-0" />;
    }
    if (sortConfig.direction === "ascending") {
      return <ArrowUp className="h-4 w-4 flex-shrink-0" />;
    }
    return <ArrowDown className="h-4 w-4 flex-shrink-0" />;
  };

  const bgColor = {
    gray: "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800",
    green: "bg-green-600 hover:bg-green-700 text-white",
    red: "bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-800",
    blue: "bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-800",
  }[actionColor];

  return (
    <div
      className={cn("bg-white rounded-lg shadow-sm overflow-hidden", className)}
    >
      {complementId && (
        <div className="bg-gray-200 px-4 py-3 border-b border-gray-300">
          <h3 className="text-sm font-medium text-gray-700">{complementId}</h3>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full h-full table-fixed">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left w-31">
                <button
                  onClick={() => onSort("complemento")}
                  className="flex w-full items-center gap-2 text-xs font-medium text-gray-600 tracking-wider hover:text-gray-900"
                >
                  <span className="truncate">Nº COMPLEMENTO</span>
                  {getSortIcon("complemento")}
                </button>
              </th>
              <th className="w-22 px-4 py-3 text-left text-xs font-medium text-gray-600 tracking-wider">
                <button
                  onClick={() => onSort("numero")}
                  className="truncate flex items-center gap-2 hover:text-gray-900"
                >
                  Nº CASA
                  {getSortIcon("numero")}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 tracking-wider">
                <button
                  onClick={() => onSort("nomeDoMorador")}
                  className="flex items-center gap-2 hover:text-gray-900"
                >
                  MORADOR
                  {getSortIcon("nomeDoMorador")}
                </button>
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider w-16">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="h-full bg-white divide-y divide-gray-200">
            {residences.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  Nenhuma residência encontrada
                </td>
              </tr>
            ) : (
              residences.map((residence) => (
                <tr
                  key={residence.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="truncate px-4 py-3 text-sm text-center text-gray-900">
                    {residence.complemento}
                  </td>
                  <td className="truncate px-4 py-3 text-sm text-gray-900">
                    {residence.numero}
                  </td>
                  <td className="truncate px-4 py-3 text-sm text-gray-900">
                    {residence.nomeDoMorador}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => viewResidence?.(residence.id)}
                      className={cn(
                        "inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors",
                        bgColor
                      )}
                      title="Ação"
                    >
                      {actionIcon}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}