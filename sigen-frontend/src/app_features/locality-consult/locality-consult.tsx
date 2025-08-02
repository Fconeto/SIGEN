"use client";

import type React from "react";
import { useForm, validators } from "@/hooks/useform";
import { SigenAppLayout } from "@/components/sigen-app-layout";
import { useEffect, useState } from "react";
import { SigenDialog, type SigenDialogProps } from "@/components/sigen-dialog";
import { useRouter } from "next/navigation";
import { SigenFormField } from "@/components/sigen-form-field";
import { SigenInput } from "@/components/sigen-input";
import { SigenLoadingButton } from "@/components/sigen-loading-button";
import { SigenDropdown } from "@/components/sigen-dropdown";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/config/api-config";
import { LocationCategory, LocationCategoryLabels } from "@/domain/entities/location";

interface Locality {
  codigoDaLocalidade: number;
  nomeDaLocalidade: string;
  categoria: string;
}

interface LocalityConsult {
  locationCode: number | undefined;
  locationName: string;
  locationCategory: string | undefined;
}

export default function LocalityConsult() {
  const router = useRouter();

  const { values, errors, handleChange, validateForm, resetForm } = useForm(
    {
      locationCode: undefined,
      locationName: "",
      locationCategory: "",
    } as LocalityConsult,
  );

  const [localities, setLocalities] = useState<Locality[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialog, setDialog] = useState<SigenDialogProps>({
    isOpen: false,
    type: "info",
    message: "",
  });

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
        return;
    }

    setIsLoading(true);

    try {
      const apiParams = {
          ...(values.locationCode && { Codigo: values.locationCode.toString() }),
          ...(values.locationName && { Nome: values.locationName }),
          ...(values.locationCategory && { Categoria: values.locationCategory.toString() }),
      };

      const queryString = new URLSearchParams(apiParams).toString();
      const token = Cookies.get("authToken");

      const response = await fetch(`${API_BASE_URL}/api/Locality/ConsultList?`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.Message || "Erro ao buscar localidades");
      }

      const res = await response.json();

      if (res.IsSuccess && res.Data) {
          const data: Locality[] = res.Data.map((item: any) => ({
            codigoDaLocalidade: item.CodigoDaLocalidade,
            nomeDaLocalidade: item.Nome, 
            categoria: item.Categoria.toString(),
          }));
          
        setLocalities(data);

        router.push(`./locality-infos?${queryString}`);
      } else {
          setDialog({
              isOpen: true,
              type: "error",
              message: res.Message || "Nenhuma localidade encontrada.",
          });
      }
    } catch (error: any) {
        console.error("Erro na requisição:", error);
        setDialog({
            isOpen: true,
            type: "error",
            message: error.message || "Ocorreu um erro inesperado.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <SigenAppLayout
        headerTitle="Consulta de Localidades"
        showBackButton
        onBackClick={() => router.back()}
      >
        <form onSubmit={handleSubmit} className="space-y-2 p-6">
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
            label="Nome do Morador:"
            error={errors.locationName}
          >
            <SigenInput
              id="locationName"
              value={values.locationName}
              onChange={(e) => handleChange("locationName", e.target.value)}
              aria-invalid={!!errors.locationName}
              placeholder="Digite o nome do morador"
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

          <SigenLoadingButton type="submit" loading={isLoading}>
            Confirmar
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
