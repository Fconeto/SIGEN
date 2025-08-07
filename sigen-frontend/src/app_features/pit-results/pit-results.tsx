"use client";

import { SigenAppLayout } from "@/components/sigen-app-layout";
import { SigenTable } from "@/components/sigen-table";
import { SigenPagination } from "@/components/sigen-pagination";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Eye, Plus } from "lucide-react";
import type { ResidenceInfos as BaseResidenceInfos } from "@/domain/entities/residences";
import ResidenceInfos from "../residence-infos/residence-infos";
import { API_BASE_URL } from "@/config/api-config";
import Cookies from "js-cookie";
import { SigenDialog, SigenDialogProps } from "@/components/sigen-dialog";

type ResidenceInfos = BaseResidenceInfos;
type SortKey = keyof Omit<ResidenceInfos, "status">;

export interface PITSearchInfos {
  id: number;
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
  pitId: number;
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

export default function PITResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [error, setError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<SigenDialogProps>({
    isOpen: false,
    type: "info",
    message: "",
  });
  const [pendingPIT, setPendingPIT] = useState<PITSearchInfos[]>([]);
  const [completedPIT, setCompletedPIT] = useState<PITSearchInfos[]>([]);

  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "ascending" | "descending";
  } | null>({ key: "nomeDoMorador", direction: "ascending" });
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
        `${API_BASE_URL}/api/PIT/consult?${queryString}`,
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
      if (data.data) {
        setPendingPIT((data.data && data.data.pendingPIT) ? data.data.pendingPIT : []);
        setCompletedPIT((data.data && data.data.pitCompleted) ? data.data.pitCompleted : []);
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

  const paginatedPendingsPIT = useMemo(() => {
    const sortedItems = pendingPIT.map(item => ({
      id: item.pitId.toString(),
      residenceId: item.id ? item.id.toString() : "0",
      complemento: item.complemento,
      numero: item.numero.toString(),
      nomeDoMorador: item.nomeDoMorador,
      status: "pending",
    }));

    return sortedItems;
  }, [pendingPIT]);

  const paginatedCompletedPIT = useMemo(() => {
    const sortedItems = completedPIT.map(item => ({
      id: item.pitId.toString(),
      residenceId: item.id ? item.id.toString() : "0",
      complemento: item.complemento,
      numero: item.numero.toString(),
      nomeDoMorador: item.nomeDoMorador,
      status: "completed",
    }));

    return sortedItems;
  }, [completedPIT]);
  
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

  const addPit = (id: string) => {
    const residenceId = paginatedPendingsPIT.find((item) => item.id === id)?.residenceId;
    router.push(`./pit-search-register?id=${id}&ResidenceId=${residenceId}`);
  }
  const viewPit = (id: string) => router.push(`./spray-consult-form/${id}`);

  const totalPages = completedPIT[0]?.totalPages >= pendingPIT[0]?.totalPages ? completedPIT[0]?.totalPages : pendingPIT[0]?.totalPages;
  return (
    <>
      <SigenAppLayout
        headerTitle="Pesquisa de PIT"
        showBackButton
        onBackClick={() => router.replace("./pit-search")}
      >
        <div className="p-1 space-y-6">
          <div>
            <div className="p-2 mb-5 text-center bg-gray-200 rounded-md shadow-sm">
              <h2 className="font-semibold text-gray-700">{locationInfo}</h2>
            </div>
            <h2 className="text-lg text-center font-semibold text-gray-800 mb-3">Pendências</h2>
            <SigenTable
              residences={paginatedPendingsPIT}
              viewResidence={addPit}
              sortConfig={sortConfig}
              onSort={handleSort}
              actionIcon={<Plus size={15} />}
              actionColor="green"
            />
          </div>
          <div>
            <hr className="my-4 border-1"></hr>
            <h2 className="text-lg text-center font-semibold text-gray-800 mb-3">Concluídos</h2>
            <SigenTable
              residences={paginatedCompletedPIT}
              viewResidence={viewPit}
              sortConfig={sortConfig}
              onSort={handleSort}
              actionIcon={<Eye size={15} />}
              actionColor="gray"
            />
          </div>
          <SigenPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
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