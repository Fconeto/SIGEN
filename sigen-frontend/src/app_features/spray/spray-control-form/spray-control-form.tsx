"use client";

import type React from "react";

import { useForm, validators } from "@/hooks/useform";
import { SigenFormField } from "@/components/sigen-form-field";
import { SigenLoadingButton } from "@/components/sigen-loading-button";
import { SigenAppLayout } from "@/components/sigen-app-layout";
import { SigenInput } from "@/components/sigen-input";
import { SigenDropdown } from "@/components/sigen-dropdown";
import { Suspense, useState } from "react";
import { SigenDialog, type SigenDialogProps } from "@/components/sigen-dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { SigenDateInput } from "@/components/sigen-date-picker";
import { API_BASE_URL } from "@/config/api-config";
import Cookies from "js-cookie";

interface SprayControlForm {
  date: Date | undefined;
  pendency: string | undefined;
  insecticideType: string;
  numberOfCharges: string;
}

const pendencyOptions = [
  { value: "Nenhuma", id: 0 },
  { value: "Recusa", id: 1 },
  { value: "Fechado", id: 2 },
];

export default function SprayControlForm() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { values, errors, handleChange, validateForm, resetForm } = useForm(
    {
      date: undefined,
      pendency: undefined,
      insecticideType: "",
      numberOfCharges: "0",
    } as SprayControlForm,
    {
      date: [validators.required("Data inválida")],
      pendency: [validators.required("Campo obrigatório")],
      insecticideType: [validators.required("Campo obrigatório")],
      numberOfCharges: [validators.required("Campo obrigatório")],
    }
  );

  const [isLoading, setIsLoading] = useState(false);
  const [dialog, setDialog] = useState<SigenDialogProps>({
    isOpen: false,
    type: "info",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setDialog({
        isOpen: true,
        type: "error",
        title: "Erro",
        message: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }

    setIsLoading(true);

    const pendencyValue = Number(values.pendency) ? pendencyOptions[Number(values.pendency)].value : 0;
    const dateValue = values.date ? values.date.toISOString().split("T")[0] : "";

    try {
      const token = Cookies.get('authToken');
      const response = await fetch(`${API_BASE_URL}/api/spray/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          agenteId: localStorage.getItem("agentId") || 0,
          DataDoPreenchimento: dateValue,
          Pendencia: pendencyValue,
          TipoDeInseticida: values.insecticideType,
          NumeroDeCarga: Number(values.numberOfCharges),
          PesquisaId: id,
        }),
      });
      
      if (response.ok) {
        setDialog({
          isOpen: true,
          type: 'success',
          message: 'Cadastro realizado com sucesso!',
        });
        resetForm();
        
        setTimeout(() => {
          setDialog({ isOpen: false, type: 'info', message: '' });
          router.back(); 
        }, 2000);
        
      } else {
        const errorData = await response.json();
        setDialog({
          isOpen: true,
          type: 'error',
          message: errorData.message || 'Ocorreu um erro ao realizar o cadastro.',
        });
      }
    } catch (error: any) {
      setDialog({
          isOpen: true,
          type: 'error',
          message: error.message || 'Não foi possível conectar ao servidor. Tente novamente mais tarde.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SigenAppLayout
        headerTitle="Controle de Borrifação"
        showBackButton
        onBackClick={() => router.back()}
      >
        <form onSubmit={handleSubmit} className="space-y-2 mt-4">
          <SigenFormField
            id="date"
            label="Data (DD/MM/AAAA):"
            error={errors.date}
          >
            <SigenDateInput
              id="date"
              value={values.date}
              onChange={(value: Date | undefined) =>
                handleChange("date", value)
              }
              error={!!errors.date}
            />
          </SigenFormField>

          <SigenFormField
            id="pendency"
            label="Pendência:"
            error={errors.pendency}
          >
            <SigenDropdown
              value={values.pendency}
              onValueChange={(v) => handleChange("pendency", v)}
              options={[
                { value: "Nenhuma", label: "Nenhuma" },
                { value: "Recusa", label: "Recusa" },
                { value: "Fechado", label: "Fechado" },
              ]}
            />
          </SigenFormField>

          <SigenFormField
            id="insecticideType"
            label="Tipo de inseticida:"
            error={errors.insecticideType}
          >
            <SigenInput
              id="insecticideType"
              value={values.insecticideType}
              onChange={(e) => handleChange("insecticideType", e.target.value)}
              aria-invalid={!!errors.insecticideType}
              placeholder="Digite o tipo de inseticida"
            />
          </SigenFormField>

          <SigenFormField
            id="numberOfCharges"
            label="Número (cargas):"
            error={errors.numberOfCharges}
          >
            <SigenInput
              id="numberOfCharges"
              value={values.numberOfCharges}
              onChange={(e) => handleChange("numberOfCharges", e.target.value)}
              aria-invalid={!!errors.numberOfCharges}
              placeholder="Digite o número de cargas"
              type="number"
              min="0"
            />
          </SigenFormField>

          <div className="pt-4">
            <SigenLoadingButton
              type="submit"
              loading={isLoading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              Confirmar
            </SigenLoadingButton>
          </div>
        </form>
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
