"use client";

import { SigenAppLayout } from "@/components/sigen-app-layout";
import { SigenTable } from "@/components/sigen-table";
import { SigenPagination } from "@/components/sigen-pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ResidenceInfos, SortKey } from "../../residence-infos/residence-infos";
import { Plus } from "lucide-react";

export default function SprayPendingResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sprayPendings, setSprayPendings] = useState<ResidenceInfos[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "ascending" | "descending";
  } | null>({
    key: "nomeMorador",
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [locationInfo, setLocationInfo] = useState({ code: "", name: "" });
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchSprayPendings = async () => {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 600));

      const mockData: ResidenceInfos[] = [
        {
          id: "1",
          complement: "1",
          numeroCasa: "203A",
          nomeMorador: "João Moreira da Silva",
        },
        {
          id: "2",
          complement: "1",
          numeroCasa: "718",
          nomeMorador: "Wellington Rocha",
        },
        {
          id: "3",
          complement: "2",
          numeroCasa: "201A",
          nomeMorador: "Eduardo Ximenes Paiva",
        },
        {
          id: "4",
          complement: "3",
          numeroCasa: "201",
          nomeMorador: "Lucas Silva",
        },
        {
          id: "5",
          complement: "1",
          numeroCasa: "105",
          nomeMorador: "Maria Santos",
        },
        {
          id: "6",
          complement: "4",
          numeroCasa: "asd",
          nomeMorador: "Carlos Oliveira",
        },
        { id: "7", complement: "5", numeroCasa: "302", nomeMorador: "asd" },
        {
          id: "8",
          complement: "sd",
          numeroCasa: "150",
          nomeMorador: "Ana Costa",
        },
        {
          id: "9",
          complement: "6",
          numeroCasa: "401",
          nomeMorador: "Pedro Lima",
        },
        {
          id: "10",
          complement: "7",
          numeroCasa: "202",
          nomeMorador: "Lucia Ferreira",
        },
        {
          id: "11",
          complement: "8",
          numeroCasa: "501",
          nomeMorador: "Roberto Silva",
        },
        {
          id: "12",
          complement: "9",
          numeroCasa: "602",
          nomeMorador: "Fernanda Costa",
        },
      ];

      setSprayPendings(mockData);

      const locationId = searchParams.get("locationId") || "0001";
      setLocationInfo({ code: locationId, name: "CUPIM" });

      setLoading(false);
    };

    fetchSprayPendings();
  }, [searchParams]);

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
          const numA = Number.parseInt(aValue, 10);
          const numB = Number.parseInt(bValue, 10);
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

  const totalPages = Math.ceil(sprayPendings.length / ITEMS_PER_PAGE);

  return (
    <SigenAppLayout
      headerTitle="Borrifação Pendente"
      showBackButton
      onBackClick={() => router.replace("./spray-consult")}
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
              residences={paginatedSprayPendings}
              viewResidence={handleAddSpray}
              complementId={`${locationInfo.code} ${locationInfo.name}`}
              sortConfig={sortConfig}
              onSort={handleSort}
              actionColor="green"
              actionIcon={<Plus size={15} />}
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
