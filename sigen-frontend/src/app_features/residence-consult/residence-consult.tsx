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
import { residenceFilterOptions } from "@/domain/entities/residence-filter";

interface ResidenceConsult {
  locationId: string;
  filterOption: string;
  nomeMorador?: string;
  bairro?: string;
  numeroCasa?: string;
}

export default function ResidenceConsult(){
  const router = useRouter();
  
  const { values, errors, handleChange, validateForm, setValues } = useForm(
    {
      locationId: "",
      filterOption: "",
      nomeMorador: "",
      bairro: "",
      numeroCasa: "",
    } as ResidenceConsult,
    {
      locationId: [
        validators.required("Campo obrigatório"),
      ],
      filterOption: [
        validators.required("Campo obrigatório"),
      ],
      nomeMorador: [
        (value, formValues) =>
          formValues.filterOption === "nomeMorador" && !value
            ? "Campo obrigatório"
            : undefined,
      ],
      bairro: [
        (value, formValues) =>
          formValues.filterOption === "bairro" && !value
            ? "Campo obrigatório"
            : undefined,
      ],
      numeroCasa: [
        (value, formValues) =>
          formValues.filterOption === "numeroCasa" && !value
            ? "Campo obrigatório"
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

  const handleFilterLocationChange = (selectedValue: string) => {
    handleChange("filterOption", selectedValue); 

    setValues(prevValues => ({
      ...prevValues,
      nomeMorador: selectedValue === "nomeMorador" ? prevValues.nomeMorador : "",
      bairro: selectedValue === "bairro" ? prevValues.bairro : "",
      numeroCasa: selectedValue === "numeroCasa" ? prevValues.numeroCasa : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000)); 
    console.log("Form Data:", values);
    setIsLoading(false);
    
    router.push('/residence-infos');
  };

  const renderDropboxInputFilter = () => {
    const selectedOption = residenceFilterOptions.find(opt => opt.value === values.filterOption);
    
    if (!selectedOption)
      return null;

    const inputId = selectedOption.value as keyof ResidenceConsult;
    const inputLabel = selectedOption.fieldLabel ?? "";

    return (
      <SigenFormField
        id={inputId}
        label={inputLabel}
        error={errors[inputId]}
      >
        <SigenInput
          id={inputId}
          value={values[inputId] || ""}
          onChange={(e) => handleChange(inputId, e.target.value)}
          aria-invalid={!!errors[inputId]}
          placeholder={`Digite o ${inputLabel.toLowerCase()}`}
        />
      </SigenFormField>
    );
  };
  
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
            label="Código da Localidade"
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

            <SigenFormField id="typeConsult" label="Consultar por:">
              <SigenDropdown
                value={values.filterOption}
                onValueChange={handleFilterLocationChange}
                options={residenceFilterOptions}
              />
            </SigenFormField>

            {renderDropboxInputFilter()}

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