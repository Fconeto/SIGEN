"use client";

import type React from "react";

import { useForm, validators } from "@/hooks/useform";
import { SigenFormField } from "@/components/sigen-form-field";
import { SigenLoadingButton } from "@/components/sigen-loading-button";
import { SigenAppLayout } from "@/components/sigen-app-layout";
import { SigenInput } from "@/components/sigen-input";
import { SigenDropdown } from "@/components/sigen-dropdown";
import { useState } from "react";
import { SigenDialog, type SigenDialogProps } from "@/components/sigen-dialog";
import { useRouter } from "next/navigation";

import { PropertySituation, PropertyType } from "@/domain/entities/house";

interface HouseForm {
  locationCode: string;
  category: string;
  propertyType: PropertyType | undefined;
  situation: PropertySituation | undefined;
  number: string;
  complement: string;
  quarterNumber: string;
  quarterComplement: string;
  residentName: string;
  uninhabited: false;
}

export default function HouseRegistrationForm() {
  const router = useRouter();

  const { values, errors, handleChange, validateForm, resetForm } = useForm(
    {
      locationCode: "",
      category: "",
      propertyType: undefined,
      situation: undefined,
      number: "",
      complement: "",
      quarterNumber: "",
      quarterComplement: "",
      residentName: "",
      uninhabited: false,
    } as HouseForm,
    {
      locationCode: [validators.required("Campo obrigatório")],
      category: [validators.required("Campo obrigatório")],
      propertyType: [validators.required("Campo obrigatório")],
      situation: [validators.required("Campo obrigatório")],
      number: [validators.required("Campo obrigatório")],
      complement: [],
      quarterNumber: [validators.required("Campo obrigatório")],
      quarterComplement: [validators.required("Campo obrigatório")],
      residentName: [],
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
    await new Promise((r) => setTimeout(r, 2000));
    console.log("Form Data:", values);
    setIsLoading(false);
    setDialog({
      isOpen: true,
      type: "success",
      title: "Sucesso",
      message: "Residência cadastrada com sucesso!",
    });
    resetForm();
  };

  return (
    <>
      <SigenAppLayout
        headerTitle="Cadastro de Residência"
        showBackButton
        onBackClick={() => router.back()}
      >
        <form onSubmit={handleSubmit} className="space-y-2 mt-4">
          <SigenFormField
            id="locationCode"
            label="Código da Localidade:"
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
            id="category"
            label="Categoria:"
            error={errors.category}
          >
            <SigenInput
              id="category"
              value={values.category}
              onChange={(e) => handleChange("category", e.target.value)}
              aria-invalid={!!errors.category}
            />
          </SigenFormField>

          <SigenFormField
            id="propertyType"
            label="Tipo de Imóvel:"
            error={errors.propertyType}
          >
            <SigenDropdown
              value={values.propertyType}
              onValueChange={(v) => handleChange("propertyType", v)}
              options={[
                { value: PropertyType.house, label: PropertyType.house },
                { value: PropertyType.market, label: PropertyType.market },
                { value: PropertyType.other, label: PropertyType.other },
              ]}
            />
          </SigenFormField>

          <SigenFormField
            id="situation"
            label="Situação:"
            error={errors.situation}
          >
            <SigenDropdown
              value={values.situation}
              onValueChange={(v) => handleChange("situation", v)}
              options={[
                {
                  value: PropertySituation.new,
                  label: PropertySituation.new,
                },
                {
                  value: PropertySituation.demolished,
                  label: PropertySituation.demolished,
                },
              ]}
            />
          </SigenFormField>

          <SigenFormField id="number" label="Número:" error={errors.number}>
            <SigenInput
              id="number"
              value={values.number}
              onChange={(e) => handleChange("number", e.target.value)}
              aria-invalid={!!errors.number}
              placeholder="Digite o número"
            />
          </SigenFormField>

          <SigenFormField
            id="complement"
            label="Complemento:"
            error={errors.complement}
          >
            <SigenInput
              id="complement"
              value={values.complement}
              onChange={(e) => handleChange("complement", e.target.value)}
              aria-invalid={!!errors.complement}
              placeholder="Digite o complemento"
            />
          </SigenFormField>

          <SigenFormField
            id="quarterNumber"
            label="Número Qrt.:"
            error={errors.quarterNumber}
          >
            <SigenInput
              id="quarterNumber"
              value={values.quarterNumber}
              onChange={(e) => handleChange("quarterNumber", e.target.value)}
              aria-invalid={!!errors.quarterNumber}
              placeholder="Digite o número do quarteirão"
            />
          </SigenFormField>

          <SigenFormField
            id="quarterComplement"
            label="Complemento Qrt.:"
            error={errors.quarterComplement}
          >
            <SigenInput
              id="quarterComplement"
              value={values.quarterComplement}
              onChange={(e) =>
                handleChange("quarterComplement", e.target.value)
              }
              aria-invalid={!!errors.quarterComplement}
              placeholder="Digite o complemento do quarteirão"
            />
          </SigenFormField>

          <SigenFormField
            id="residentName"
            label="Nome do morador:"
            error={errors.residentName}
          >
            <SigenInput
              id="residentName"
              value={values.residentName}
              onChange={(e) => handleChange("residentName", e.target.value)}
              aria-invalid={!!errors.residentName}
              placeholder="Digite o nome do morador"
            />
          </SigenFormField>

          <SigenFormField
            id="uninhabited"
            label="Inabitado"
            error={errors.uninhabited}
            className="flex items-center gap-2 cursor-pointer"
          >
            <SigenInput
              type="checkbox"
              id="uninhabited"
              checked={values.uninhabited}
              onChange={(e) => handleChange("uninhabited", e.target.checked)}
              className="h-4 w-4 border-gray-300 rounded"
            />
          </SigenFormField>

          <div className="pt-4">
            <SigenLoadingButton type="submit" loading={isLoading}>
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
