"use client";

import { SigenAppLayout } from "@/components/sigen-app-layout";
import { SigenTable } from "@/components/sigen-table";
import { SigenPagination } from "@/components/sigen-pagination";
import { SigenDialog, type SigenDialogProps } from "@/components/sigen-dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useMemo, useState, Suspense } from "react";
import {
  ResidenceInfos,
  ResidenceSortKey, 
} from "@/domain/entities/residences";
import { Plus } from "lucide-react";
import { API_BASE_URL } from "@/config/api-config";
import Cookies from "js-cookie";

export interface PendingSearchInfos {
  atualizadoPor: number;
  categoriaDaLocalidade: string;
  codigoDaLocalidade: number;
  complemento: string;
  criadoPor: number;
  dataDeAtualizacao: string;
  dataDeRegistro: string;
  id: number;
  nomeDaLocalidade: string;
  nomeDoMorador: string;
  numero: number;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

const sortResidenceInfos = {
  id: -1,
  complemento: 0,
  numero: 1,
  nomeDoMorador: 2,
}

export default function SprayPendingResults() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sprayPendings, setSprayPendings] = useState<PendingSearchInfos[]>([
  ]);
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
    key: "nomeDoMorador",
    direction: "ascending",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [locationInfo, setLocationInfo] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      let queryString = searchParams.toString();

      setLocationInfo(localStorage.getItem("locality") || "");

      setLoading(true);
      setError(null);
      
      try {
        
        if (sortConfig) {
          queryString += `&page=${currentPage}&order=${sortConfig.direction}&ordertype=${sortResidenceInfos[sortConfig.key]}`;
        }
        const token = Cookies.get("authToken");

        const response = await fetch(
          `${API_BASE_URL}/api/Search/pending?${queryString}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao consultar os dados. Tente novamente.");
        }

        const data = await response.json();

        if (data.data && data.data.length > 0) {
          setSprayPendings((data && data.data) ? data.data : []);
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
    const sortedItems: ResidenceInfos[] = sprayPendings.map(item => ({
      id: item.id.toString(),
      complemento: item.complemento,
      numero: item.numero.toString(),
      nomeDoMorador: item.nomeDoMorador,
      status: "pending",
    }));

    return sortedItems;
  }, [sprayPendings]);

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

  const totalPages = sprayPendings[0]?.totalPages;

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
                complementId={`${locationInfo}`}
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
