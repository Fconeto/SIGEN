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

interface SprayControlForm {
  date: Date | undefined;
  pendency: string | undefined;
  insecticideType: string;
  numberOfCharges: string;
}

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

    console.log("Form Data:", {
      ...values,
    });

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
    await new Promise((r) => setTimeout(r, 2000));

    setIsLoading(false);
    setDialog({
      isOpen: true,
      type: "success",
      title: "Sucesso",
      message: "Controle de borrifação registrado com sucesso!",
    });
    resetForm();
  };

  return (
    <Suspense fallback={<div>Carregando...</div>}>
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
    </Suspense>
  );
}
