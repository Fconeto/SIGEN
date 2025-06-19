import type React from "react";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResidenceInfos {
  id: string;
  location: string;
  numeroCasa: string;
  nomeMorador: string;
}

interface ResidenceTableProps {
  residences: ResidenceInfos[];
  locationid?: string;
  onViewDetails?: (residenceId: string) => void;
  className?: string;
}

export function SigenTable({
  residences,
  locationid,
  onViewDetails,
  className,
}: ResidenceTableProps) {
  return (
    <div
      className={cn("bg-white rounded-lg shadow-sm overflow-hidden", className)}
    >
      {locationid && (
        <div className="bg-gray-200 px-4 py-3 border-b border-gray-300">
          <h3 className="text-sm font-medium text-gray-700">{locationid}</h3>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Localidade
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Nº Casa
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Morador
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider w-16">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {residences.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  Nenhuma residência encontrada
                </td>
              </tr>
            ) : (
              residences.map((residence, index) => (
                <tr
                  key={residence.id}
                  className={cn(
                    "hover:bg-gray-50 transition-colors",
                    index % 2 === 0 ? "bg-white" : "bg-gray-25"
                  )}
                >
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {residence.location}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {residence.numeroCasa}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {residence.nomeMorador}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onViewDetails?.(residence.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors"
                      title="Visualizar detalhes"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {residences.length > 0 && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            {residences.length} residência{residences.length !== 1 ? "s" : ""}{" "}
            encontrada{residences.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
