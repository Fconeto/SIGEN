"use client";

import { SigenAppLayout } from '@/components/sigen-app-layout';
import { SigenTable } from '@/components/sigen-table';
import { SigenPagination } from '@/components/sigen-pagination'
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import type { ResidenceInfos as BaseResidenceInfos } from "@/domain/entities/residences";

export type ResidenceInfos = Omit<BaseResidenceInfos, 'status'>;

export type SortKey = keyof ResidenceInfos;

export default function ResidenceInfos() {
  const router = useRouter();
  const [residences, setResidences] = useState<ResidenceInfos[]>([])
  const [loading, setLoading] = useState(false)
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'nomeDoMorador', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const searchResults = async () => {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockData: ResidenceInfos[] = [
        { id: "1", complemento: "1", numero: "203A", nomeDoMorador: "João Moreira da Silva" },
        { id: "2", complemento: "1", numero: "718", nomeDoMorador: "Welligton Rocha" },
        { id: "3", complemento: "2", numero: "201A", nomeDoMorador: "João Moreira da Silva" },
        { id: "4", complemento: "2", numero: "203", nomeDoMorador: "Eduardo Ximenes Paiva" },
        { id: "5", complemento: "10", numero: "203A", nomeDoMorador: "João Moreira da Silva" },
        { id: "6", complemento: "20", numero: "203A", nomeDoMorador: "João Moreira da Silva" },
        { id: "7", complemento: "20", numero: "203A", nomeDoMorador: "João Moreira da Silva" },
        { id: "8", complemento: "20", numero: "203A", nomeDoMorador: "João Moreira da Silva" },
        { id: "9", complemento: "20", numero: "203A", nomeDoMorador: "João Moreira da Silva" },
        { id: "10", complemento: "20", numero: "203A", nomeDoMorador: "João Moreira da Silva" },
        { id: "11", complemento: "20", numero: "203A", nomeDoMorador: "João Moreira da Silva" },
        { id: "12", complemento: "20", numero: "203A", nomeDoMorador: "João Moreira da Silva" },
      ];
      
      setResidences(mockData);
      setLoading(false);
    };

    searchResults();
  }, []);
  
  const paginatedResidences = useMemo(() => {
    const sortedItems = [...residences];

    if (sortConfig !== null) {
      sortedItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (sortConfig.key === 'complemento') {
          const numA = parseInt(aValue, 10);
          const numB = parseInt(bValue, 10);
          if (numA < numB) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (numA > numB) return sortConfig.direction === 'ascending' ? 1 : -1;
          return 0;
        }

        const aStr = aValue.toLowerCase();
        const bStr = bValue.toLowerCase();

        if (aStr < bStr) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    
    return sortedItems.slice(startIndex, endIndex);

  }, [residences, currentPage, sortConfig]);

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

  const totalPages = Math.ceil(residences.length / ITEMS_PER_PAGE);

  return (
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
              complementId='0001 CUPIM'
              sortConfig={sortConfig}
              onSort={handleSort}
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
  );
}