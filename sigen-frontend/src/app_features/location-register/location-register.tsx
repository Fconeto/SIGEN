"use client";

import React, { useEffect, useState } from "react";
import { useForm, validators } from "@/hooks/useform";
import { SigenFormField } from "@/components/sigen-form-field";
import { SigenLoadingButton } from "@/components/sigen-loading-button";
import { SigenAppLayout } from "@/components/sigen-app-layout";
import { SigenInput } from "@/components/sigen-input";
import { SigenDropdown } from "@/components/sigen-dropdown";
import { SigenDialog, type SigenDialogProps } from "@/components/sigen-dialog";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config/api-config";
import { GlobalService } from "@/services/global-service";
import { TokenService } from "@/services/auth/token-service";
import Cookies from "js-cookie";
import { LocationCategory, LocationCategoryLabels } from "@/domain/entities/location";

interface Locality {
  codigoDaLocalidade: number;
  nomeDaLocalidade: string;
  categoria: string;
}

interface LocalityRegister {
  locationCode: number | undefined;
  locationName: string;
  locationCategory: string | undefined;
}

export default function LocationRegisterForm() {
  const router = useRouter();

  const [localities, setLocalities] = useState<Locality[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialog, setDialog] = useState<SigenDialogProps>({
    isOpen: false,
    type: "info",
    message: "",
  });

  const { values, errors, handleChange, validateForm, resetForm } = useForm(
    {
      locationCode: undefined,
      locationName: "",
      locationCategory: "",
    } as LocalityRegister,
    {
      locationCode: [validators.required("Campo obrigatório")],
      locationName: [validators.required("Campo obrigatório")],
      locationCategory: [validators.required("Campo obrigatório")],
    }
  );

  useEffect(() => {
    const loc = localities.find(
      (l) => l.codigoDaLocalidade === Number(values.locationCode)
    );

    const newCategory = values.locationCode === 0 || !loc ? "" : loc.categoria;

    if (values.locationCategory !== newCategory) {
      handleChange("locationCategory", newCategory);
    }
  }, [values.locationCode, localities]);

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
    try {
      const userId = localStorage.getItem("agentId");
      const body = {
        agenteId: userId,
        codigoDaLocalidade: Number(values.locationCode),
        nomeDaLocalidade: values.locationName,
        categoria: values.locationCategory, 
      };

      const token = Cookies.get('authToken');

      const res = await fetch(`${API_BASE_URL}/api/locality/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}`
         },
        body: JSON.stringify(body),
      }); 

      const response = await res.json();

      if (!res.ok) throw new Error(response.Message || "Erro ao cadastrar localidade"); 

      setIsLoading(false);
      setDialog({
        isOpen: true,
        type: "success",
        title: "Sucesso",
        message: response.Message || "Localidade cadastrada com sucesso!",
      });

      resetForm();

    } catch (error: any) {
      setIsLoading(false);
      setDialog({
        isOpen: true,
        type: "error",
        title: "Erro",
        message: error.Message || "Erro ao cadastrar localidade.",
      });
    }
  };

  return (
    <>
      <SigenAppLayout
        headerTitle="Cadastro de Localidades"
        showBackButton
        onBackClick={() => router.back()}
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-4 mt-4 max-w-md mx-auto"
        >
          <SigenFormField
            id="locationCode"
            label="Código da Localidade:"
            error={errors.locationCode}
          >
            <SigenInput
              id="locationCode"
              type="number"
              value={values.locationCode}
              mask={{
                mask: Number,
                scale: 0,
              }}
              onChange={(e) =>
                handleChange("locationCode", Number(e.target.value))
              }
              aria-readonly
              placeholder="Digite o código da localidade"
            />
          </SigenFormField>

          <SigenFormField
            id="locationName"
            label="Nome da Localidade:"
            error={errors.locationName}
          >
            <SigenInput
              id="locationName"
              value={values.locationName}
              onChange={(e) => handleChange("locationName", e.target.value)}
              aria-invalid={!!errors.locationName}
              placeholder="Digite o nome da localidade"
            />
          </SigenFormField>

          <SigenFormField
            id="locationCategory"
            label="Categoria da Localidade:"
            error={errors.locationCategory}
          >
            <SigenDropdown
              canDigit={false}
              value={values.locationCategory?.toString()}
              onValueChange={(v) =>
                handleChange("locationCategory", v)}
              options={[
                {
                  value: LocationCategory.neighborhood.toString(),
                  label: LocationCategoryLabels[LocationCategory.neighborhood],
                },
                {
                  value: LocationCategory.city.toString(),
                  label: LocationCategoryLabels[LocationCategory.city],
                },
                {
                  value: LocationCategory.farm.toString(),
                  label: LocationCategoryLabels[LocationCategory.farm],
                },
                {
                  value: LocationCategory.town.toString(),
                  label: LocationCategoryLabels[LocationCategory.town],
                },
                {
                  value: LocationCategory.site.toString(),
                  label: LocationCategoryLabels[LocationCategory.site],
                },
                {
                  value: LocationCategory.village.toString(),
                  label: LocationCategoryLabels[LocationCategory.village],
                },
              ]}
              placeholder="Selecione a categoria"
            />
          </SigenFormField>


          <SigenLoadingButton
            loading={isLoading}
            type="submit"
            className="w-full"
          >
            Cadastrar
          </SigenLoadingButton>
        </form>

        <SigenDialog
          {...dialog}
          onClose={() =>
            setDialog({ isOpen: false, type: "info", message: "" })
          }
        />
      </SigenAppLayout>
    </>
  );
}
