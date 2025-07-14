"use client";

import { SigenAppLayout } from "@/components/sigen-app-layout";
import { SigenTable } from "@/components/sigen-table";
import { SigenPagination } from "@/components/sigen-pagination";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Eye, Plus } from "lucide-react";
import type { ResidenceInfos as BaseResidenceInfos } from "@/domain/entities/residences";

type ResidenceInfos = BaseResidenceInfos;
type SortKey = keyof Omit<ResidenceInfos, "status">;

export default function PITResults() {
  const router = useRouter();
  const [residences, setResidences] = useState<ResidenceInfos[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "ascending" | "descending";
  } | null>({ key: "nomeMorador", direction: "ascending" });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const searchResults = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      const mockData: ResidenceInfos[] = [
        { id: "1", complement: "1", numeroCasa: "101", nomeMorador: "Ana", status: "pending" },
        { id: "2", complement: "2", numeroCasa: "102", nomeMorador: "Bruno", status: "pending" },
        { id: "3", complement: "3", numeroCasa: "201", nomeMorador: "Carlos", status: "completed" },
        { id: "4", complement: "4", numeroCasa: "202", nomeMorador: "Daniela", status: "completed" },
        { id: "5", complement: "5", numeroCasa: "203", nomeMorador: "Eduardo", status: "completed" },
        { id: "6", complement: "6", numeroCasa: "204", nomeMorador: "Fernanda", status: "completed" },
        { id: "7", complement: "7", numeroCasa: "205", nomeMorador: "Gabriel", status: "completed" },
        { id: "8", complement: "8", numeroCasa: "206", nomeMorador: "Heloisa", status: "completed" },
        { id: "9", complement: "9", numeroCasa: "207", nomeMorador: "Igor", status: "completed" },
        { id: "10", complement: "10", numeroCasa: "208", nomeMorador: "Julia", status: "completed" },
        { id: "11", complement: "11", numeroCasa: "209", nomeMorador: "Lucas", status: "completed" },
        { id: "12", complement: "12", numeroCasa: "210", nomeMorador: "Mariana", status: "completed" },
        { id: "13", complement: "13", numeroCasa: "211", nomeMorador: "Natalia", status: "completed" },
        { id: "14", complement: "14", numeroCasa: "212", nomeMorador: "Otavio", status: "completed" },
      ];
      setResidences(mockData);
      setLoading(false);
    };
    searchResults();
  }, []);

  const { sortedPendings, sortedComplets } = useMemo(() => {
    let itemsToSort = [...residences];

    if (sortConfig !== null) {
      itemsToSort.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        if (aStr < bStr) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    
    const pendings = itemsToSort.filter(r => r.status === "pending");
    const complets = itemsToSort.filter(r => r.status === "completed");

    return { sortedPendings: pendings, sortedComplets: complets };
  }, [residences, sortConfig]);


  const paginatedCompleted = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedComplets.slice(startIndex, endIndex);
  }, [sortedComplets, currentPage]);

  const totalPages = Math.ceil(sortedComplets.length / ITEMS_PER_PAGE);

  const handleSort = (key: SortKey) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const addPit = (id: string) => router.push(`./pit-search/${id}`);
  const viewPit = (id: string) => router.push(`./spray-consult-form/${id}`);

  if (loading) return <div>Carregando...</div>;
  
  return (
    <SigenAppLayout
      headerTitle="Pesquisa de PIT"
      showBackButton
      onBackClick={() => router.back()}
    >
      <div className="p-1 space-y-6">
        <div>
          <div className="p-2 mb-5 text-center bg-gray-200 rounded-md shadow-sm">
            <h2 className="font-semibold text-gray-700">0001 CUPIM</h2>
          </div>
          <h2 className="text-lg text-center font-semibold text-gray-800 mb-3">Pendências</h2>
          <SigenTable
            residences={sortedPendings}
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
            residences={paginatedCompleted}
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
  );
}