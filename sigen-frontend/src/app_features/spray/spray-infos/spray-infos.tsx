"use client";

import { SigenAppLayout } from "@/components/sigen-app-layout";
import { SigenTable } from "@/components/sigen-table";
import { SigenPagination } from "@/components/sigen-pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ResidenceInfos, SortKey } from "../../residence-infos/residence-infos";
import { Plus } from "lucide-react";
import { API_BASE_URL } from "@/config/api-config";
import Cookies from "js-cookie";
import { SigenDialog, SigenDialogProps } from "@/components/sigen-dialog";

export interface SprayPendingsInfos {
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
  id: number;
  pesquisaId: number;
  codigoDaLocalidade: number;
  nomeDaLocalidade: string;
  categoriaDaLocalidade: string;
  nomeDoMorador: string;
  numero: number;
  complemento: string;
  dataDeRegistro: string;
  dataDeAtualizacao: string;
  criadoPor: number;
  atualizadoPor: number;
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
  const [sprayPendings, setSprayPendings] = useState<SprayPendingsInfos[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "ascending" | "descending";
  } | null>({
    key: "nomeDoMorador",
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [locationInfo, setLocationInfo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<SigenDialogProps>({
    isOpen: false,
    type: "info",
    message: "",
  });
  

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
          `${API_BASE_URL}/api/Spray/pending?${queryString}`,
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
          setSprayPendings((data.data) ? data.data : []);
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

  const handleSort = (key: SortKey) => {
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

  const handleAddSpray = (id: string) => {
    router.push(`./spray-control/?id=${id}`);
  };

  const totalPages = sprayPendings[0]?.totalPages;

  if (loading) {
    return (
      <SigenAppLayout
        headerTitle="Borrifação Pendente"
        showBackButton
        onBackClick={() => router.replace("./spray-consult")}
        scrollDisable
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
        </div>
      </SigenAppLayout>
    );
  }

  return (
    <>
      <SigenAppLayout
        headerTitle="Borrifação Pendente"
        showBackButton
        onBackClick={() => router.replace("./spray-consult")}
        scrollDisable
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800">a</div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <SigenTable
                residences={paginatedSprayPendings}
                viewResidence={handleAddSpray}
                sortConfig={sortConfig}
                complementId={locationInfo}
                onSort={handleSort}
                actionIcon={<Plus size={15} />}
                actionColor="green"
              />
            </div>
            <div className="flex-shrink-0 mt-4">
              <SigenPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
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
