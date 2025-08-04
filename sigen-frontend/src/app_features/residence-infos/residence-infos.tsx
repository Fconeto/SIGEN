"use client";

import { SigenAppLayout } from '@/components/sigen-app-layout';
import { SigenTable } from '@/components/sigen-table';
import { SigenPagination } from '@/components/sigen-pagination'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import type { ResidenceInfos as BaseResidenceInfos } from "@/domain/entities/residences";
import Cookies from 'js-cookie';
import { API_BASE_URL } from '@/config/api-config';
import { SigenDialog, type SigenDialogProps } from "@/components/sigen-dialog";

export interface ResidenceConsultInfos {
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

export type ResidenceInfos = Omit<BaseResidenceInfos, 'status'> ;

export type SortKey = keyof ResidenceInfos;

const sortResidenceInfos = {
  id: -1,
  complemento: 0,
  numero: 1,
  nomeDoMorador: 2,
}

export default function ResidenceInfos() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [residences, setResidences] = useState<ResidenceConsultInfos[]>([])
  const [loading, setLoading] = useState(false)
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'nomeDoMorador', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [locationInfo, setLocationInfo] = useState("");
  const ITEMS_PER_PAGE = 10;
  const [dialog, setDialog] = useState<SigenDialogProps>({
      isOpen: false,
      type: "info",
      message: "",
    });

  useEffect(() => {
    const searchResults = async () => {
      setLoading(true);

      let queryString = searchParams.toString();

      setLocationInfo(localStorage.getItem("locality") || "");
      
      if (sortConfig) {
        queryString += `&page=${currentPage}&order=${sortConfig.direction}&ordertype=${sortResidenceInfos[sortConfig.key]}`;
      }

      const token = Cookies.get("authToken");

      const response = await fetch(`${API_BASE_URL}/api/Residence/consult?${queryString}`, 
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error("Falha ao buscar as residências.");
      }

      const res = await response.json();

      if (res.data && res.data.length > 0) {
        setResidences((res && res.data) ? res.data : []);
      }
      else {
        setDialog({
          isOpen: true,
          type: "info",
          title: "Sem Resultados",
          message: "Nenhum dado encontrado para os filtros informados.",
        });
      }
      
      setLoading(false);
    };

    searchResults();
  }, [sortConfig, currentPage, searchParams]);
  
  const paginatedResidences = useMemo(() => {
    const sortedItems: ResidenceInfos[] = residences.map(item => ({
      id: item.id.toString(),
      complemento: item.complemento,
      numero: item.numero.toString(),
      nomeDoMorador: item.nomeDoMorador,
      status: "pending",
    }));

    return sortedItems;
  }, [residences]);

  const handleSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };
  
  if (loading) {
    return (
      <SigenAppLayout
        headerTitle="Consulta de Residência"
        showBackButton
        onBackClick={() => router.back()}
        scrollDisable
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
        </div>
      </SigenAppLayout>
    );
  }

  const showResidence = (id: string) => {
    router.push(`/chief-agent/residence-details/${id}`);
  };

  const totalPages = residences[0]?.totalPages;

  return (  
    <>
      <SigenAppLayout
        headerTitle="Consulta de Residência"
        showBackButton
        onBackClick={() => router.back()}
        scrollDisable
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <SigenTable
                residences={paginatedResidences}
                viewResidence={showResidence}
                complementId={locationInfo}
                sortConfig={sortConfig}
                onSort={handleSort}
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