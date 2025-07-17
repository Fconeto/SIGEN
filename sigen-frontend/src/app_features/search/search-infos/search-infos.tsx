"use client";

import { SigenAppLayout } from "@/components/sigen-app-layout";
import { SigenTable } from "@/components/sigen-table";
import { SigenPagination } from "@/components/sigen-pagination";
import { SigenDialog, type SigenDialogProps } from "@/components/sigen-dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ResidenceInfos,
  ResidenceSortKey, 
} from "@/domain/entities/residences";
import { Plus } from "lucide-react";
import { API_BASE_URL } from "@/config/api-config";

export default function SprayPendingResults() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sprayPendings, setSprayPendings] = useState<ResidenceInfos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<SigenDialogProps>({
    isOpen: false,
    type: "info",
    message: "",
  });

  const [totalItems, setTotalItems] = useState(0);

  const [sortConfig, setSortConfig] = useState<{
    key: ResidenceSortKey; 
    direction: "ascending" | "descending";
  } | null>({
    key: "nomeMorador",
    direction: "ascending",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [locationInfo, setLocationInfo] = useState({ code: "", name: "" });
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchData = async () => {
      const queryString = searchParams.toString();

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("authToken");

        const response = await fetch(
          `${API_BASE_URL}/api/Search/pending?${queryString}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao consultar os dados. Tente novamente.");
        }

        const data = await response.json();

        if (data.data.items && data.data.items.length > 0) {
          setSprayPendings((data.data && data.data.items) ? data.data.items : []);
        } 
        else {
          setDialog({
            isOpen: true,
            type: "info",
            title: "Sem Resultados",
            message: "Nenhum dado encontrado para os filtros informados.",
          });
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
        const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro inesperado.";
        setDialog({
          isOpen: true,
          type: "error",
          title: "Erro na Consulta",
          message: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, currentPage, sortConfig]); 

  const paginatedSprayPendings = useMemo(() => {
    const sortedItems = [...sprayPendings];
    if (sortConfig !== null) {
      sortedItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null && bValue === null) return 0;
        if (aValue === null) return 1;
        if (bValue === null) return -1;

        if (sortConfig.key === "complement") {
          const numA = Number.parseInt(String(aValue), 10);
          const numB = Number.parseInt(String(bValue), 10);
          if (Number.isNaN(numA)) return 1;
          if (Number.isNaN(numB)) return -1;
          if (numA < numB) return sortConfig.direction === "ascending" ? -1 : 1;
          if (numA > numB) return sortConfig.direction === "ascending" ? 1 : -1;
          return 0;
        }

        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();

        if (aStr < bStr) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return sortedItems.slice(startIndex, endIndex);
  }, [sprayPendings, currentPage, sortConfig]);

  const handleSort = (key: ResidenceSortKey) => { 
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const handleAddSearch = (id: string) => {
    router.push(`./search-register/?id=${id}`);
  };

  const totalPages = Math.ceil(sprayPendings.length / ITEMS_PER_PAGE);

  return (
    <>
      <SigenAppLayout
        headerTitle="Pesquisa Pendente"
        showBackButton
        onBackClick={() => router.replace("./search-consult")}
        scrollDisable
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500 p-4 text-center">
            {error}
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4">
              <SigenTable
                residences={paginatedSprayPendings}
                viewResidence={handleAddSearch}
                complementId={`${locationInfo.code} - ${locationInfo.name}`}
                sortConfig={sortConfig}
                onSort={handleSort}
                actionColor="green"
                actionIcon={<Plus size={15} />}
              />
            </div>
            {totalPages > 1 && (
              <div className="flex-shrink-0 mt-auto p-4 border-t">
                <SigenPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}
      </SigenAppLayout>

      <SigenDialog
        isOpen={dialog.isOpen}
        onClose={() => setDialog((prev) => ({ ...prev, isOpen: false }))}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
      />
    </>
  );
}
