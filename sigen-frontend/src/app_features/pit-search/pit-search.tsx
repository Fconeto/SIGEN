"use client";

import { useForm, validators } from "@/hooks/useform";
import { SigenAppLayout } from "@/components/sigen-app-layout";
import { SigenFormField } from "@/components/sigen-form-field";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { defaultDialogs, SigenDialogProps } from "@/components/sigen-dialog";
import { SigenInput } from "@/components/sigen-input";
import { SigenLoadingButton } from "@/components/sigen-loading-button";

interface PITSearchForm {
  locationCode: number;
  nomeMorador: string;
  houseNumber: number;
  complementNumber: number;
}

export default function PITSearchForm() {
  const router = useRouter();

    const { values, errors, handleChange, validateForm, resetForm } = useForm(
      {
        locationCode: 0,
        nomeMorador: "",
        houseNumber: 0,
        complementNumber: 0,
      } as PITSearchForm,
      {
        locationCode: [
          validators.required("Campo obrigatório"),
        ],
        nomeMorador: [
          (value) =>
          value && /\d/.test(String(value))
            ? "O campo Nome do morador não deve conter números"
            : undefined,
        ],
        houseNumber: [
          (value) =>
          value && !/^\d+$/.test(String(value))
            ? "O campo Número da casa deve conter apenas números"
            : undefined,
       ],
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

  const searchParams: { [key: string]: any } = {
    locationCode: values.locationCode,
    ...(values.nomeMorador && { nomeMorador: values.nomeMorador }),
    ...(values.houseNumber && { houseNumber: values.houseNumber }),
    ...(values.complementNumber && { complementNumber: values.complementNumber }),
  };

  await new Promise((r) => setTimeout(r, 1000)); 

  console.log("Form Data:", values);
  setIsLoading(false);
  
  const filteredSearchParams = Object.entries(searchParams).reduce((acc, [key, value]) => {
    if (value) {
      acc[key] = value;
    }
    return acc;
  }, {} as { [key: string]: any });

  const queryString = new URLSearchParams(filteredSearchParams).toString();
  router.push(`./pit-results?${queryString}`);
};

  return(
    <>
      <SigenAppLayout
        headerTitle="Pesquisa de PIT"
        showBackButton
        onBackClick={() => router.back()}
      >
        <form onSubmit={handleSubmit} className="space-y-2 mt-8">
          <SigenFormField
            id="locationCode"
            label="Código da localidade:"
            error={errors.locationCode}
          >
            <SigenInput 
              id="locationCode"
              value={values.locationCode}
              onChange={(e) => handleChange("locationCode", e.target.value)}
              aria-invalid={!!errors.locationCode}
              placeholder="Digite o código da localidade"
            />
          </SigenFormField>

          <SigenFormField
            id="nomeMorador"
            label="Nome do morador:"
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
            id="houseNumber"
            label="Número da casa:"
            error={errors.houseNumber}
          >
            <SigenInput 
              id="houseNumber"
              value={values.houseNumber}
              onChange={(e) => handleChange("houseNumber", e.target.value)}
              aria-invalid={!!errors.houseNumber}
              placeholder="Digite o número da casa"
            />
          </SigenFormField>

          <SigenFormField
            id="complementNumber"
            label="Número do complemento:"
            error={errors.complementNumber}
          >
            <SigenInput 
              id="complementNumber"
              value={values.complementNumber}
              onChange={(e) => handleChange("complementNumber", e.target.value)}
              aria-invalid={!!errors.complementNumber}
              placeholder="Digite o número do complemento"
            />
          </SigenFormField>

          <SigenLoadingButton type="submit" loading={isLoading}>
            Confirmar
          </SigenLoadingButton>
        </form>
      </SigenAppLayout>
    </>
  );
}