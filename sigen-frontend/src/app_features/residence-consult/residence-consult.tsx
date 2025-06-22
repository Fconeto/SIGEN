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
import { SigenDropdown } from "@/components/sigen-dropdown";
import { SigenLoadingButton } from "@/components/sigen-loading-button";

interface ResidenceConsult {
  locationId: string;
  nomeMorador: string;
  bairro: string;
  numeroCasa: string;
}

export default function ResidenceConsult(){
  const router = useRouter();
  
  const { values, errors, handleChange, validateForm, setValues } = useForm(
    {
      locationId: "",
      nomeMorador: "",
      bairro: "",
      numeroCasa: "",
    } as ResidenceConsult,
    {
      locationId: [
        validators.required("Campo obrigatório"),
      ],
      nomeMorador: [
        (value) => /\d/.test(value) ? "O campo nome não pode conter números" :  undefined,
      ],
      bairro: [
        (value) => /\d/.test(value) ? "O campo bairro não pode conter números" : undefined,
      ],
      numeroCasa: [],
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
      return;
    }
    
    setIsLoading(true);

    const searchParams = {
      locationId: values.locationId,
      ...(values.nomeMorador && { nomeMorador: values.nomeMorador }),
      ...(values.bairro && { bairro: values.bairro }),
      ...(values.numeroCasa && { numeroCasa: values.numeroCasa }),
    };

    await new Promise((r) => setTimeout(r, 1000)); 

    console.log("Form Data:", values);
    setIsLoading(false);
    
    const queryString = new URLSearchParams(searchParams).toString();
    router.push(`/chief-agent/residence-infos?${queryString}`);  };
  
  return (
    <>
      <SigenAppLayout
        headerTitle="Consulta de Residência"
        showBackButton
        onBackClick={() => router.back()}
      >
        <form onSubmit={handleSubmit} className="space-y-2 p-6">
          <SigenFormField
            id="locationId"
            label={<>Código da Localidade <span className="text-red-500 font-semibold">*</span></>}
            error={errors.locationId}
          >
            <SigenInput
              id="locationId"
              value={values.locationId}
              onChange={(e) => handleChange("locationId", e.target.value)}
              aria-invalid={!!errors.locationId}
              placeholder="Digite o código da localidade"
            />
          </SigenFormField>

          <SigenFormField
            id="nomeMorador"
            label="Nome do Morador:"
            error={errors.nomeMorador}
          >
            <SigenInput
              id="nomeMorador"
              value={values.nomeMorador}
              onChange={(e) => handleChange("nomeMorador", e.target.value)}
              aria-invalid={!!errors.nomeMorador}
              placeholder="Digite o nome do morador"
            />
          </SigenFormField>

          <SigenFormField
            id="bairro"
            label="Bairro:"
            error={errors.bairro}
          >
            <SigenInput
              id="bairro"
              value={values.bairro}
              onChange={(e) => handleChange("bairro", e.target.value)}
              aria-invalid={!!errors.bairro}
              placeholder="Digite o nome do bairro"
            />
          </SigenFormField>

          <SigenFormField
            id="numeroCasa"
            label="Número da Casa:"
            error={errors.numeroCasa}
          >
            <SigenInput
              id="numeroCasa"
              value={values.numeroCasa}
              onChange={(e) => handleChange("numeroCasa", e.target.value)}
              aria-invalid={!!errors.numeroCasa}
              placeholder="Digite o número da casa"
            />
          </SigenFormField>

          <SigenLoadingButton type="submit" loading={isLoading}>
            Confirmar
          </SigenLoadingButton>
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