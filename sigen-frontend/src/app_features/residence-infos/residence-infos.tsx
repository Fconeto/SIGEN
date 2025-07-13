"use client";

import { SigenAppLayout } from '@/components/sigen-app-layout';
import { SigenTable } from '@/components/sigen-table';
import { SigenPagination } from '@/components/sigen-pagination'
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';

export interface ResidenceInfos {
  id: string;
  complement: string;
  numeroCasa: string;
  nomeMorador: string;
}

export type SortKey = keyof ResidenceInfos;

export default function ResidenceInfos() {
  const router = useRouter();
  const [residences, setResidences] = useState<ResidenceInfos[]>([])
  const [loading, setLoading] = useState(false)
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'nomeMorador', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const searchResults = async () => {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockData: ResidenceInfos[] = [
        { id: "1", complement: "1", numeroCasa: "203A", nomeMorador: "João Moreira da Silva" },
        { id: "2", complement: "1", numeroCasa: "718", nomeMorador: "Welligton Rocha" },
        { id: "3", complement: "2", numeroCasa: "201A", nomeMorador: "João Moreira da Silva" },
        { id: "4", complement: "2", numeroCasa: "203", nomeMorador: "Eduardo Ximenes Paiva" },
        { id: "5", complement: "10", numeroCasa: "203A", nomeMorador: "João Moreira da Silva" },
        { id: "6", complement: "20", numeroCasa: "203A", nomeMorador: "João Moreira da Silva" },
        { id: "7", complement: "20", numeroCasa: "203A", nomeMorador: "João Moreira da Silva" },
        { id: "8", complement: "20", numeroCasa: "203A", nomeMorador: "João Moreira da Silva" },
        { id: "9", complement: "20", numeroCasa: "203A", nomeMorador: "João Moreira da Silva" },
        { id: "10", complement: "20", numeroCasa: "203A", nomeMorador: "João Moreira da Silva" },
        { id: "11", complement: "20", numeroCasa: "203A", nomeMorador: "João Moreira da Silva" },
        { id: "12", complement: "20", numeroCasa: "203A", nomeMorador: "João Moreira da Silva" },
      ];
      
      setResidences(mockData);
      setLoading(false);
    };

    searchResults();
  }, []);
  
  const paginatedResidences = useMemo(() => {
    let sortedItems = [...residences];

    if (sortConfig !== null) {
      sortedItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (sortConfig.key === 'complement') {
          const numA = parseInt(aValue, 10);
          const numB = parseInt(bValue, 10);
          if (numA < numB) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (numA > numB) return sortConfig.direction === 'ascending' ? 1 : -1;
          return 0;
        }
        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
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