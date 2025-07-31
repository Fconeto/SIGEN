"use client";

import type React from "react";
import { useForm, validators } from "@/hooks/useform";
import { SigenAppLayout } from "@/components/sigen-app-layout";
import { useState } from "react";
import {
  SigenDialog,
  SigenDialogProps,
} from "@/components/sigen-dialog";
import { useRouter } from "next/navigation";
import { SigenFormField } from "@/components/sigen-form-field";
import { SigenInput } from "@/components/sigen-input";
import { SigenLoadingButton } from "@/components/sigen-loading-button";
import { WorkPhase } from "@/domain/entities/work";
import { SigenDropdown } from "@/components/sigen-dropdown";
import { Turma } from "@/domain/entities/class";
import { API_BASE_URL } from "@/config/api-config";

interface WeeklyReport {
  microregional: string;
  city: string;
  workPhase: WorkPhase | undefined;
  week: number;
  class: Turma | undefined;
  headGuard: string;
}

export default function WeeklyReport(){
  const router = useRouter();
  
  const { values, errors, handleChange, validateForm, setValues } = useForm(
    {
      microregional: "",
      city: "",
      workPhase: undefined,
      class: undefined,
      headGuard: "",
    } as WeeklyReport,
    {
      microregional: [
        validators.required("Campo obrigatório"),
      ],
      city: [
        validators.required("Campo obrigatório"),
      ],
      workPhase: [
        validators.required("Campo obrigatório"),
      ],
      week: [
        validators.required("Campo obrigatório"),
      ],
      class: [
        validators.required("Campo obrigatório"),
      ],
      headGuard: [
        validators.required("Campo obrigatório"),
      ],
    }
  );

  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportList[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    const fase = values.workPhase == WorkPhase.AV ? 0 : 1;

    const searchParams = {
      microregional: values.microregional,
      municipio: values.city,
      fasedetrabalho: fase.toString(),
      semana: String(values.week || 0),
      turma: String(values.class || ''),
      guardachefe: values.headGuard,
    };

    const queryString = new URLSearchParams(searchParams).toString();

    router.push(`./report-results?${queryString}`);
  };

  return (
    <>
      <SigenAppLayout
        headerTitle="Relatório Semanal"
        showBackButton
        onBackClick={() => router.back()}
      >
        <form onSubmit={handleSubmit} className="space-y-2 p-6">
          <SigenFormField
            id="microregional"
            label="Microregional"
            error={errors.microregional}
          >
            <SigenInput
              id="microregional"
              value={values.microregional}
              onChange={(e) => handleChange("microregional", e.target.value)}
              aria-invalid={!!errors.microregional}
              placeholder="Digite o microregional"
            />
          </SigenFormField>

          <SigenFormField
            id="city"
            label="Município"
            error={errors.city}
          >
            <SigenInput
              id="city"
              value={values.city}
              onChange={(e) => handleChange("city", e.target.value)}
              aria-invalid={!!errors.city}
              placeholder="Digite o município"
            />
          </SigenFormField>

          <SigenFormField
            id="workPhase"
            label="Fase de Trabalho:"
            error={errors.workPhase}
          >
            <SigenDropdown
              value={values.workPhase}
              onValueChange={(v) => handleChange("workPhase", v)}
              options={[
                { value: WorkPhase.AV, label: WorkPhase.AV },
                { value: WorkPhase.pit, label: WorkPhase.pit }
              ]}
            />
          </SigenFormField>

          <SigenFormField
            id="week"
            label="Semana:"
            error={errors.week}
          >
            <SigenInput
              id="week"
              type="number"
              value={values.week}
              onChange={(e) => handleChange("week", Number(e.target.value))}
              aria-invalid={!!errors.week}
              placeholder="Digite a semana"
            />
          </SigenFormField>

          <SigenFormField
            id="class"
            label="Turma:"
            error={errors.class}
          >
            <SigenDropdown
              value={values.class}
              onValueChange={(v) => handleChange("class", v)}
              options={[
                { value: Turma.chagas, label: Turma.chagas },
              ]}
            />
          </SigenFormField>

          <SigenFormField
            id="headGuard"
            label="Guarda Chefe:"
            error={errors.headGuard}
          >
            <SigenInput
              id="headGuard"
              value={values.headGuard}
              onChange={(e) => handleChange("headGuard", e.target.value)}
              aria-invalid={!!errors.headGuard}
              placeholder="Digite o nome do guarda chefe"
            />
          </SigenFormField>

          <div className="pt-4">
            <SigenLoadingButton type="submit" loading={isLoading}>
              Consultar
            </SigenLoadingButton>
          </div>
        </form>
      </SigenAppLayout>
    </>
  );
}