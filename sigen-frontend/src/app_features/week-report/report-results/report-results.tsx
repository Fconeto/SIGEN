"use client";

import type React from "react";
import { SigenAppLayout } from "@/components/sigen-app-layout";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import * as XLSX from 'xlsx';
import { API_BASE_URL } from "@/config/api-config";
import { SigenDialog, SigenDialogProps } from "@/components/sigen-dialog";

interface ReportItem {
  codigoDaLocalidade: number;
  nome: string;
  categoria: string;
  data: string;
  conclusao: boolean;
  localidadePositiva: boolean;
  numeroHabitantes: number;
  casasTrabalhadas: { positivas: number; negativas: number; total: number };
  casasPendentes: { fechadas: number; recusadas: number; total: number };
  anexosTrabalhados: { positivas: number; negativas: number; total: number };
  unidadesDomiciliares: { positivas: number; negativas: number; total: number };
  triatomineosCapturados: { intra: number; peri: number; total: number };
  homensTrabalhando: number; 
  caes: number;
  gatos: number;
}

export default function WeeklyReportResults() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [reportData, setReportData] = useState<ReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dialog, setDialog] = useState<SigenDialogProps>({
    isOpen: false,
    type: "info",
    message: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const queryString = searchParams.toString();
      if (!queryString) {
        setError("Filtros de busca não fornecidos.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const queryString = searchParams.toString();        
        const token = localStorage.getItem('authToken');

        const response = await fetch(`${API_BASE_URL}/api/report/consult?${queryString}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao consultar o relatório. Tente novamente.");
        }
        const data = await response.json();

        if (data.data.items && data.data.items.length > 0) {
          setReportData((data.data && data.data.items) ? data.data.items : []);
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
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchParams]); 

  const handleToggleConclusion = (codigo: number) => {
      setReportData((prevData) =>
      prevData.map((item) =>
        item.codigoDaLocalidade === codigo
          ? { ...item, conclusao: !item.conclusao }
          : item
      )
    );
  };

  const totals = useMemo(() => {
    return reportData.reduce(
      (acc, item) => {
        acc.numeroHabitantes += item.numeroHabitantes;
        acc.casasTrabalhadas.positivas += item.casasTrabalhadas.positivas;
        acc.casasTrabalhadas.negativas += item.casasTrabalhadas.negativas;
        acc.casasTrabalhadas.total += item.casasTrabalhadas.total;
        acc.casasPendentes.fechadas += item.casasPendentes.fechadas;
        acc.casasPendentes.recusadas += item.casasPendentes.recusadas;
        acc.casasPendentes.total += item.casasPendentes.total;
        acc.anexosTrabalhados.positivas += item.anexosTrabalhados.positivas;
        acc.anexosTrabalhados.negativas += item.anexosTrabalhados.negativas;
        acc.anexosTrabalhados.total += item.anexosTrabalhados.total;
        acc.unidadesDomiciliares.positivas += item.unidadesDomiciliares.positivas;
        acc.unidadesDomiciliares.negativas += item.unidadesDomiciliares.negativas;
        acc.unidadesDomiciliares.total += item.unidadesDomiciliares.total;
        acc.triatomineosCapturados.intra += item.triatomineosCapturados.intra;
        acc.triatomineosCapturados.peri += item.triatomineosCapturados.peri;
        acc.triatomineosCapturados.total += item.triatomineosCapturados.total;
        acc.homensTrabalhando += item.homensTrabalhando;
        acc.caes += item.caes;
        acc.gatos += item.gatos;
        return acc;
      },
      {
        numeroHabitantes: 0,
        casasTrabalhadas: { positivas: 0, negativas: 0, total: 0 },
        casasPendentes: { fechadas: 0, recusadas: 0, total: 0 },
        anexosTrabalhados: { positivas: 0, negativas: 0, total: 0 },
        unidadesDomiciliares: { positivas: 0, negativas: 0, total: 0 },
        triatomineosCapturados: { intra: 0, peri: 0, total: 0 },
        homensTrabalhando: 0,
        caes: 0,
        gatos: 0,
      }
    );
  }, [reportData]);
  
  const handleGenerateSheet = () => {
    const headerRow1 = [
      "Data", "Localidade", "Conclusão", "Localidade Positiva", "Número de Habitantes",
      "Casas Trabalhadas", null, null,
      "Casas Pendentes", null, null,
      "Anexos Trabalhados", null, null,
      "Unidades Domiciliares", null, null,
      "Triatomíneos Capturados", null, null,
      "Homens Dia Trabalhando", "Cães", "Gatos"
    ];
    const headerRow2 = [
      null, null, null, null, null,
      "Positivas", "Negativas", "Total",
      "Fechadas", "Recusadas", "Total",
      "Positivas", "Negativas", "Total",
      "Positivas", "Negativas", "Total",
      "Intra", "Peri", "Total",
      null, null, null
    ];

    const bodyRows = reportData.map(item => [
      new Date(item.data).toLocaleDateString("pt-BR", { timeZone: 'UTC' }),
      `${item.nome} - ${item.categoria}`,
      item.conclusao ? "Sim" : "Não",
      item.localidadePositiva ? "Sim" : "Não",
      item.numeroHabitantes,
      item.casasTrabalhadas.positivas, item.casasTrabalhadas.negativas, item.casasTrabalhadas.total,
      item.casasPendentes.fechadas, item.casasPendentes.recusadas, item.casasPendentes.total,
      item.anexosTrabalhados.positivas, item.anexosTrabalhados.negativas, item.anexosTrabalhados.total,
      item.unidadesDomiciliares.positivas, item.unidadesDomiciliares.negativas, item.unidadesDomiciliares.total,
      item.triatomineosCapturados.intra, item.triatomineosCapturados.peri, item.triatomineosCapturados.total,
      item.homensTrabalhando,
      item.caes,
      item.gatos
    ]);

    const footerRow = [
        "Total", null, null, null,
        totals.numeroHabitantes,
        totals.casasTrabalhadas.positivas, totals.casasTrabalhadas.negativas, totals.casasTrabalhadas.total,
        totals.casasPendentes.fechadas, totals.casasPendentes.recusadas, totals.casasPendentes.total,
        totals.anexosTrabalhados.positivas, totals.anexosTrabalhados.negativas, totals.anexosTrabalhados.total,
        totals.unidadesDomiciliares.positivas, totals.unidadesDomiciliares.negativas, totals.unidadesDomiciliares.total,
        totals.triatomineosCapturados.intra, totals.triatomineosCapturados.peri, totals.triatomineosCapturados.total,
        totals.homensTrabalhando,
        totals.caes,
        totals.gatos
    ];

    const finalData = [headerRow1, headerRow2, ...bodyRows, footerRow];

    const ws = XLSX.utils.aoa_to_sheet(finalData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "RelatorioSemanal");

    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, 
      { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, 
      { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } }, 
      { s: { r: 0, c: 3 }, e: { r: 1, c: 3 } }, 
      { s: { r: 0, c: 4 }, e: { r: 1, c: 4 } }, 
      { s: { r: 0, c: 19 }, e: { r: 1, c: 19 } }, 
      { s: { r: 0, c: 20 }, e: { r: 1, c: 20 } }, 
      { s: { r: 0, c: 21 }, e: { r: 1, c: 21 } }, 

      { s: { r: 0, c: 5 }, e: { r: 0, c: 7 } }, 
      { s: { r: 0, c: 8 }, e: { r: 0, c: 10 } }, 
      { s: { r: 0, c: 11 }, e: { r: 0, c: 13 } }, 
      { s: { r: 0, c: 14 }, e: { r: 0, c: 16 } }, 
      { s: { r: 0, c: 17 }, e: { r: 0, c: 19 } }, 
      
      { s: { r: finalData.length -1, c: 0 }, e: { r: finalData.length -1, c: 3 } } 
    ];

    const dataAtual = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `Relatorio_Semanal_${dataAtual}.xlsx`);
  };

  return (
    <>
      <SigenAppLayout
        headerTitle="Relatório Semanal"
        showBackButton
        onBackClick={() => router.back()}
        maxWidth="full"
        padding="none"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Relatório Semanal</h2>
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-sm font-medium"
              onClick={handleGenerateSheet}
            >
              Gerar planilha
            </button>
          </div>

          <div className="overflow-x-auto border border-gray-300 rounded">
            <table className="min-w-full bg-white text-sm">

              <thead className="bg-gray-100 text-xs font-medium">
                <tr>
                  <th rowSpan={2} className="border border-gray-300 p-2 align-middle">Data</th>
                  <th rowSpan={2} className="border border-gray-300 p-2 align-middle">Localidade</th>
                  <th rowSpan={2} className="border border-gray-300 p-2 align-middle">Conclusão</th>
                  <th rowSpan={2} className="border border-gray-300 p-2 align-middle">Localidade Positiva</th>
                  <th rowSpan={2} className="border border-gray-300 p-2 align-middle">Número de Habitantes</th>
                  <th colSpan={3} className="border border-gray-300 p-2">Casas Trabalhadas</th>
                  <th colSpan={3} className="border border-gray-300 p-2">Casas Pendentes</th>
                  <th colSpan={3} className="border border-gray-300 p-2">Anexos Trabalhados</th>
                  <th colSpan={3} className="border border-gray-300 p-2">Unidades Domiciliares</th>
                  <th colSpan={3} className="border border-gray-300 p-2">Triatomíneos Capturados</th>
                  <th rowSpan={2} className="border border-gray-300 p-2 align-middle">Homens Dia Trabalhando</th>
                  <th rowSpan={2} className="border border-gray-300 p-2 align-middle">Cães</th>
                  <th rowSpan={2} className="border border-gray-300 p-2 align-middle">Gatos</th>
                </tr>
                <tr>
                  <th className="border border-gray-300 p-1">Positivas</th>
                  <th className="border border-gray-300 p-1">Negativas</th>
                  <th className="border border-gray-300 p-1">Total</th>
                  <th className="border border-gray-300 p-1">Fechadas</th>
                  <th className="border border-gray-300 p-1">Recusadas</th>
                  <th className="border border-gray-300 p-1">Total</th>
                  <th className="border border-gray-300 p-1">Positivas</th>
                  <th className="border border-gray-300 p-1">Negativas</th>
                  <th className="border border-gray-300 p-1">Total</th>
                  <th className="border border-gray-300 p-1">Positivas</th>
                  <th className="border border-gray-300 p-1">Negativas</th>
                  <th className="border border-gray-300 p-1">Total</th>
                  <th className="border border-gray-300 p-1">Intra</th>
                  <th className="border border-gray-300 p-1">Peri</th>
                  <th className="border border-gray-300 p-1">Total</th>
                </tr>
              </thead>

              <tbody className="text-center">
                {reportData.map((item) => (
                  <tr key={item.codigoDaLocalidade} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">{new Date(item.data).toLocaleDateString("pt-BR", {timeZone: 'UTC'})}</td>
                    <td className="border border-gray-300 p-2 text-left">{item.nome} - {item.categoria}</td>
                    <td className="border border-gray-300 p-2">
                      <input 
                        type="checkbox"
                        className="h-4 w-4 accent-green-600"
                        checked={item.conclusao}
                        onChange={() => handleToggleConclusion(item.codigoDaLocalidade)} 
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={item.localidadePositiva}
                        readOnly
                      />
                    </td>
                    <td className="border border-gray-300 p-2">{item.numeroHabitantes}</td>
                    <td className="border border-gray-300 p-2">{item.casasTrabalhadas.positivas}</td>
                    <td className="border border-gray-300 p-2">{item.casasTrabalhadas.negativas}</td>
                    <td className="border border-gray-300 p-2">{item.casasTrabalhadas.total}</td>
                    <td className="border border-gray-300 p-2">{item.casasPendentes.fechadas}</td>
                    <td className="border border-gray-300 p-2">{item.casasPendentes.recusadas}</td>
                    <td className="border border-gray-300 p-2">{item.casasPendentes.total}</td>
                    <td className="border border-gray-300 p-2">{item.anexosTrabalhados.positivas}</td>
                    <td className="border border-gray-300 p-2">{item.anexosTrabalhados.negativas}</td>
                    <td className="border border-gray-300 p-2">{item.anexosTrabalhados.total}</td>
                    <td className="border border-gray-300 p-2">{item.unidadesDomiciliares.positivas}</td>
                    <td className="border border-gray-300 p-2">{item.unidadesDomiciliares.negativas}</td>
                    <td className="border border-gray-300 p-2">{item.unidadesDomiciliares.total}</td>
                    <td className="border border-gray-300 p-2">{item.triatomineosCapturados.intra}</td>
                    <td className="border border-gray-300 p-2">{item.triatomineosCapturados.peri}</td>
                    <td className="border border-gray-300 p-2">{item.triatomineosCapturados.total}</td>
                    <td className="border border-gray-300 p-2">{item.homensTrabalhando}</td>
                    <td className="border border-gray-300 p-2">{item.caes}</td>
                    <td className="border border-gray-300 p-2">{item.gatos}</td>
                  </tr>
                ))}
              </tbody>

              <tfoot className="bg-gray-100 font-bold text-center">
                  <tr>
                      <td colSpan={4} className="border border-gray-300 p-2 text-right">Total</td>
                      <td className="border border-gray-300 p-2">{totals.numeroHabitantes}</td>
                      <td className="border border-gray-300 p-2">{totals.casasTrabalhadas.positivas}</td>
                      <td className="border border-gray-300 p-2">{totals.casasTrabalhadas.negativas}</td>
                      <td className="border border-gray-300 p-2">{totals.casasTrabalhadas.total}</td>
                      <td className="border border-gray-300 p-2">{totals.casasPendentes.fechadas}</td>
                      <td className="border border-gray-300 p-2">{totals.casasPendentes.recusadas}</td>
                      <td className="border border-gray-300 p-2">{totals.casasPendentes.total}</td>
                      <td className="border border-gray-300 p-2">{totals.anexosTrabalhados.positivas}</td>
                      <td className="border border-gray-300 p-2">{totals.anexosTrabalhados.negativas}</td>
                      <td className="border border-gray-300 p-2">{totals.anexosTrabalhados.total}</td>
                      <td className="border border-gray-300 p-2">{totals.unidadesDomiciliares.positivas}</td>
                      <td className="border border-gray-300 p-2">{totals.unidadesDomiciliares.negativas}</td>
                      <td className="border border-gray-300 p-2">{totals.unidadesDomiciliares.total}</td>
                      <td className="border border-gray-300 p-2">{totals.triatomineosCapturados.intra}</td>
                      <td className="border border-gray-300 p-2">{totals.triatomineosCapturados.peri}</td>
                      <td className="border border-gray-300 p-2">{totals.triatomineosCapturados.total}</td>
                      <td className="border border-gray-300 p-2">{totals.homensTrabalhando}</td>
                      <td className="border border-gray-300 p-2">{totals.caes}</td>
                      <td className="border border-gray-300 p-2">{totals.gatos}</td>
                  </tr>
              </tfoot>
            </table>
          </div>
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