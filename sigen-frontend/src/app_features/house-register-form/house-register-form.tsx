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

import {
  PropertySituation,
  PropertySituationLabels,
  PropertyType,
  PropertyTypeLabels,
} from "@/domain/entities/house";
import { API_BASE_URL } from "@/config/api-config";
import { GlobalService } from "@/services/global-service";
import { TokenService } from "@/services/auth/token-service";
import Cookies from "js-cookie";

interface Locality {
  localidadeId: number;
  codigoDaLocalidade: number;
  nome: string;
  categoria: string;
  dataDeRegistro: string;
  dataDeAtualizacao: string;
  criadoPor: number;
  atualizadoPor: number;
}

interface HouseForm {
  locationCode: string ;
  category: string | undefined;
  propertyType: number | undefined;
  situation: number | undefined;
  number: string;
  complement: string;
  quarterNumber: string;
  quarterComplement: string;
  residentName: string;
  uninhabited: boolean;
}

export default function HouseRegistrationForm() {
  const router = useRouter();

  const [localities, setLocalities] = useState<Locality[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialog, setDialog] = useState<SigenDialogProps>({
    isOpen: false,
    type: "info",
    message: "",
  });

  const { values, errors, handleChange, validateForm, resetForm, validateField } = useForm(
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
      locationCode: [
       validators.required("Campo obrigatório"),
         validators.isNumber(
          "O campo Código da Localidade deve conter apenas números"
        ),  
      ],
      category: [
        validators.required("Campo obrigatório")
        ],
      propertyType: [validators.required("Campo obrigatório")],
      situation: [validators.required("Campo obrigatório")],
      number: [
        validators.required("Campo obrigatório"),
        validators.isNumber("O campo Número deve conter apenas números"),
      ],
      complement: [],
      quarterNumber: [
        validators.required("Campo obrigatório"),
        validators.isNumber(
          "O campo Número do quarteirão deve conter apenas números"
        ),
      ],
      quarterComplement: [validators.required("Campo obrigatório")],
      residentName: [
        validators.condition<HouseForm, "residentName">((value) =>
          !(/\d/.test(String(value))), 
          "O campo Nome do morador não deve conter números"
        ),
      ],
    }
  );

  useEffect(() => {
    async function fetchLocalities() {
      try {
        const token = Cookies.get('authToken');

        const response = await fetch(`${API_BASE_URL}/api/Locality/consultlocality`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json", 
              "Authorization": `Bearer ${token}`
            },
          }
        );

        const res = await response.json();

        if (!response.ok) throw new Error(res.message || "Erro ao carregar localidades");

        setLocalities(res.data as Locality[]);
      } catch (error: any) {
        setDialog({
          isOpen: true,
          type: "error",
          title: "Erro",
          message: error.message || "Não foi possível carregar as localidades.",
        });
      }
    }
    fetchLocalities();
  }, []);

  useEffect(() => {
    const loc = localities.find(
      (l) => l.codigoDaLocalidade === Number(values.locationCode)
    );

    const newCategory = values.locationCode === "" || !loc ? "" : loc.categoria;

    if (values.category !== newCategory) {
      handleChange("category", newCategory);
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
      const userId = GlobalService.getInstance().getUser()?.id;
      const body = {
        agenteId: userId,
        codigoDaLocalidade: Number(values.locationCode),
        tipoDoImovel: values.propertyType,
        demolida: values.situation === PropertySituation.demolished,
        numero: Number(values.number),
        complemento: values.complement,
        numeroDoQuarteirao: Number(values.quarterNumber),
        complementoDoQuarteirao: values.quarterComplement,
        nomeDoMorador: values.residentName,
        inabitado: values.uninhabited,
      };

      const token = Cookies.get('authToken');

       const res = await fetch(`${API_BASE_URL}/api/Residence/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}`
         },
        body: JSON.stringify(body),
      }); 

      const response = await res.json();

      if (!res.ok) throw new Error(response.message || "Erro ao cadastrar residência"); 

      setIsLoading(false);
      setDialog({
        isOpen: true,
        type: "success",
        title: "Sucesso",
        message: "Residência cadastrada com sucesso!",
      });

      resetForm();

      const residenceId = response.data.residenceId;

      if (!body.demolida) {
        setDialog({
          isOpen: true,
          type: "info",
          title: "Pergunta",
          message: "Deseja realizar a pesquisa dessa residência?",
          onConfirm: () => {
            setDialog({ isOpen: false, type: "info", message: "" });
            router.push(`./search-register?id=${residenceId}`);
          },
          onCancel: () => {
            setDialog({ isOpen: false, type: "info", message: "" });
          },
        });
      }
    } catch (error: any) {
      setIsLoading(false);
      setDialog({
        isOpen: true,
        type: "error",
        title: "Erro",
        message: error.message || "Erro ao cadastrar residência.",
      });
    }
  };

  return (
    <>
      <SigenAppLayout
        headerTitle="Cadastro de Residência"
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
            <SigenDropdown
              value={values.locationCode?.toString()}
              canDigit
              onValueChange={(v) => handleChange("locationCode", v)}
              options={localities.map((loc) => ({
                value: loc.codigoDaLocalidade.toString(),
                label: `${loc.codigoDaLocalidade} - ${loc.nome}`,
              }))}
              placeholder="Selecione ou digite o código da localidade"
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
              readOnly
              tabIndex={-1}
              aria-readonly
              placeholder="Categoria"
            />
          </SigenFormField>

          <SigenFormField
            id="propertyType"
            label="Tipo de Imóvel:"
            error={errors.propertyType}
          >
            <SigenDropdown
              canDigit={false}
              value={values.propertyType}
              onValueChange={(v) => handleChange("propertyType", v)}
              options={[
                {
                  value: PropertyType.house,
                  label: PropertyTypeLabels[PropertyType.house],
                },
                {
                  value: PropertyType.market,
                  label: PropertyTypeLabels[PropertyType.market],
                },
                {
                  value: PropertyType.other,
                  label: PropertyTypeLabels[PropertyType.other],
                },
              ]}
              placeholder="Selecione o tipo de imóvel"
            />
          </SigenFormField>

          <SigenFormField
            id="situation"
            label="Situação:"
            error={errors.situation}
          >
            <SigenDropdown
              canDigit={false}
              value={values.situation?.toString()}
              onValueChange={(v) =>
                handleChange("situation", Number(v) as PropertySituation)
              }
              options={[
                {
                  value: PropertySituation.demolished.toString(),
                  label: PropertySituationLabels[PropertySituation.demolished],
                },
                {
                  value: PropertySituation.new.toString(),
                  label: PropertySituationLabels[PropertySituation.new],
                },
              ]}
              placeholder="Selecione a situação"
            />
          </SigenFormField>

          <SigenFormField id="number" label="Número:" error={errors.number}>
            <SigenInput
              id="number"
              value={values.number}
              mask={{
                mask: Number,
                scale: 0,
              }}
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
              mask={{
                mask: Number,
                scale: 0,
              }}
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
              checked={values.uninhabited}
              onChange={(e) => handleChange("uninhabited", e.target.checked)}
              className="h-4 w-4 border-gray-300 rounded ml-1"
            />
          </SigenFormField>

          <SigenLoadingButton
            loading={isLoading}
            type="submit"
            className="w-full"
          >
            Cadastrar Residência
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
