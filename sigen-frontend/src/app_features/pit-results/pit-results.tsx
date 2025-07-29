"use client";

import { SigenAppLayout } from "@/components/sigen-app-layout";
import { SigenTable } from "@/components/sigen-table";
import { SigenPagination } from "@/components/sigen-pagination";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Eye, Plus } from "lucide-react";
import type { ResidenceInfos as BaseResidenceInfos } from "@/domain/entities/residences";
import ResidenceInfos from "../residence-infos/residence-infos";

type ResidenceInfos = BaseResidenceInfos;
type SortKey = keyof Omit<ResidenceInfos, "status">;

export default function PITResults() {
  const router = useRouter();
  const [residences, setResidences] = useState<ResidenceInfos[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "ascending" | "descending";
  } | null>({ key: "nomeDoMorador", direction: "ascending" });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const searchResults = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      const mockData: ResidenceInfos[] = [
        { id: "1", complemento: "1", numero: "101", nomeDoMorador: "Ana", status: "pending" },
        { id: "2", complemento: "2", numero: "102", nomeDoMorador: "Bruno", status: "pending" },
        { id: "3", complemento: "3", numero: "201", nomeDoMorador: "Carlos", status: "completed" },
        { id: "4", complemento: "4", numero: "202", nomeDoMorador: "Daniela", status: "completed" },
        { id: "5", complemento: "5", numero: "203", nomeDoMorador: "Eduardo", status: "completed" },
        { id: "6", complemento: "6", numero: "204", nomeDoMorador: "Fernanda", status: "completed" },
        { id: "7", complemento: "7", numero: "205", nomeDoMorador: "Gabriel", status: "completed" },
        { id: "8", complemento: "8", numero: "206", nomeDoMorador: "Heloisa", status: "completed" },
        { id: "9", complemento: "9", numero: "207", nomeDoMorador: "Igor", status: "completed" },
        { id: "10", complemento: "10", numero: "208", nomeDoMorador: "Julia", status: "completed" },
        { id: "11", complemento: "11", numero: "209", nomeDoMorador: "Lucas", status: "completed" },
        { id: "12", complemento: "12", numero: "210", nomeDoMorador: "Mariana", status: "completed" },
        { id: "13", complemento: "13", numero: "211", nomeDoMorador: "Natalia", status: "completed" },
        { id: "14", complemento: "14", numero: "212", nomeDoMorador: "Otavio", status: "completed" },
      ];
      setResidences(mockData);
      setLoading(false);
    };
    searchResults();
  }, []);

  const { sortedPendings, sortedComplets } = useMemo(() => {
    const itemsToSort = [...residences];

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

  const addPit = (id: string) => router.push(`./pit-search-register?id=${id}`);
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