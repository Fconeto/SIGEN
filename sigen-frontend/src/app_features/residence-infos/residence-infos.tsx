"use client";

import { SigenAppLayout } from '@/components/sigen-app-layout';
import { SigenTable } from '@/components/sigen-table';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface ResidenceInfos {
  id: string;
  location: string;
  numeroCasa: string;
  nomeMorador: string;
}

export default function ResidenceInfos() {
  const router = useRouter();
  const [residences, setResidences] = useState<ResidenceInfos[]>([])
  const [loading, setLoading] = useState(false)

useEffect(() => {
    const searchResults = async () => {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockData: ResidenceInfos[] = [
        { id: "1", location: "Barro dos Venâncios", numeroCasa: "203A", nomeMorador: "João Moreira da Silva" },
        { id: "2", location: "Barro V.", numeroCasa: "20", nomeMorador: "João" },
        { id: "3", location: "Barro V.", numeroCasa: "20", nomeMorador: "João" },
        { id: "4", location: "Barro V.", numeroCasa: "20", nomeMorador: "João" },
        { id: "5", location: "Barro V.", numeroCasa: "20", nomeMorador: "João" },
        { id: "6", location: "Barro V.", numeroCasa: "20", nomeMorador: "João" },
        { id: "7", location: "Barro V.", numeroCasa: "20", nomeMorador: "João" },
        { id: "8", location: "Barro V.", numeroCasa: "20", nomeMorador: "João" },
        { id: "9", location: "Barro V.", numeroCasa: "20", nomeMorador: "João" },
        { id: "10", location: "Barro V.", numeroCasa: "20", nomeMorador: "João" },
        { id: "11", location: "Barro V.", numeroCasa: "20", nomeMorador: "João" },
        { id: "12", location: "Barro V.", numeroCasa: "20", nomeMorador: "João" },
      ];
      
      setResidences(mockData);
      setLoading(false);
    };

    searchResults();
  }, []);

if (loading) {
    return (
      <SigenAppLayout
        headerTitle="Consulta de Residência"
        showBackButton
        onBackClick={() => router.back()}
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
        </div>
      </SigenAppLayout>
    );
  }

  const showResidence = (id: string) => {
    console.log("Vizualizar detalhes da residência:", id);
    router.push(`/chief-agent/residence-details/${id}`);
  };

  return (
    <SigenAppLayout
      headerTitle="Consulta de Residência"
      showBackButton
      onBackClick={() => router.back()}
      padding="sm"
    >
      <div className="space-y-4">
        <SigenTable
          residences={residences}
          locationid="0020"
          viewResidence={showResidence}
        />
      </div>
    </SigenAppLayout>
  );
}