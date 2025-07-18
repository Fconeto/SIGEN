"use client";

import type React from "react";
import { useForm, validators } from "@/hooks/useform";
import { SigenAppLayout } from "@/components/sigen-app-layout";
import { useState } from "react";
import { SigenDialog, type SigenDialogProps } from "@/components/sigen-dialog";
import { useRouter } from "next/navigation";
import { SigenFormField } from "@/components/sigen-form-field";
import { SigenInput } from "@/components/sigen-input";
import { SigenLoadingButton } from "@/components/sigen-loading-button";

interface SprayConsult {
  locationId: string;
  nomeMorador: string;
  numeroComplemento: string;
  numeroCasa: string;
}

export default function SprayConsult() {
  const router = useRouter();

  const { values, errors, handleChange, validateForm, setValues } = useForm(
    {
      locationId: "",
      nomeMorador: "",
      numeroComplemento: "",
      numeroCasa: "",
    } as SprayConsult,
    {
      locationId: [
        validators.required("Campo obrigatório"),
        (value) =>
          value && !/^\d+$/.test(value)
            ? "O campo Código da Localidade deve conter apenas números"
            : undefined,
      ],
      nomeMorador: [
        (value) => /\d/.test(value) ? "O campo nome não pode conter números" :  undefined,
      ],
      numeroComplemento: [],
      numeroCasa: [
        (value) =>
          value && !/^\d+$/.test(value)
            ? "O campo Número da Casa deve conter apenas números"
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
    const searchParams = {
      locationId: values.locationId,
      ...(values.nomeMorador && { nomeMorador: values.nomeMorador }),
      ...(values.numeroComplemento && {
        numeroComplemento: values.numeroComplemento,
      }),
      ...(values.numeroCasa && { numeroCasa: values.numeroCasa }),
    };

    await new Promise((r) => setTimeout(r, 1000));
    console.log("Form Data:", values);
    setIsLoading(false);

    const queryString = new URLSearchParams(searchParams).toString();
    router.push(`./spray-infos?${queryString}`);
  };

  return (
    <>
      <SigenAppLayout
        headerTitle="Borrifações Pendentes"
        showBackButton
        onBackClick={() => router.back()}
      >
        <form onSubmit={handleSubmit} className="space-y-2 p-6">
          <SigenFormField
            id="locationId"
            label={
              <>
                Código da Localidade{" "}
                <span className="text-red-500 font-semibold">*</span>
              </>
            }
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

          <SigenFormField
            id="numeroComplemento"
            label="Número do Complemento:"
            error={errors.numeroComplemento}
          >
            <SigenInput
              id="numeroComplemento"
              value={values.numeroComplemento}
              onChange={(e) =>
                handleChange("numeroComplemento", e.target.value)
              }
              aria-invalid={!!errors.numeroComplemento}
              placeholder="Digite o número do complemento"
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
