"use client";

import { useForm, validators } from "@/hooks/useform";
import { SigenAppLayout } from "@/components/sigen-app-layout";
import { SigenFormField } from "@/components/sigen-form-field";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { defaultDialogs, SigenDialogProps } from "@/components/sigen-dialog";
import { SigenInput } from "@/components/sigen-input";
import { SigenLoadingButton } from "@/components/sigen-loading-button";
import { SigenCombobox } from "@/components/sigen-combobox";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/config/api-config";

interface Locality {
  codigo: string;
  nome: string;
  categoria: string;
}

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

  const [localities, setLocalities] = useState<Locality[]>([]);
  const [isFetchingLocalities, setIsFetchingLocalities] = useState<boolean>(true);

  useEffect(() => {
    const fetchLocalities = async () => {
      setIsFetchingLocalities(true);
      try {
        const token = Cookies.get("authToken");

        const response = await fetch(`${API_BASE_URL}/api/Locality/consultlocality`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
        });

        if (!response.ok) {
          throw new Error("Falha ao buscar localidades");
        }
        const res = await response.json();

        const data: Locality[] = res.data.map((item: any) => ({
          codigo: item.codigoDaLocalidade,
          nome: item.nome,
          categoria: item.categoria,
        }));
      
        setLocalities(data);

        } catch (error) {
        console.error(error);
        setDialog({
          isOpen: true,
          type: "error",
          title: "Erro de Rede",
          message: "Não foi possível carregar a lista de localidades.",
        });
      } finally {
        setIsFetchingLocalities(false);
      }
    };

    fetchLocalities();
  }, []);
    
  const localityOptions = useMemo(
    () =>
      localities.map((loc) => ({
        value: loc.codigo,
        label: `${loc.codigo} - ${loc.nome}`,
      })),
    [localities]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    const searchParams = {
      CodigoDaLocalidade: values.locationCode.toString(),
      ...(values.nomeMorador && { nomeMorador: values.nomeMorador }),
      ...(values.houseNumber && { NumeroDaCasa: values.houseNumber.toString() }),
      ...(values.complementNumber && { NumeroDoComplemento: values.complementNumber.toString() }),
    };

    await new Promise((r) => setTimeout(r, 1000)); 
    setIsLoading(false);

    const queryString = new URLSearchParams(searchParams).toString();
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
            <SigenCombobox 
              options={localityOptions}
              value={values.locationCode.toString()}
              placeholder="Selecione uma localidade"
              disabled={isFetchingLocalities}
              onChange={(value) => handleChange("locationCode", Number(value))}
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
              onChange={(e) => handleChange("houseNumber", Number(e.target.value))}
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
              onChange={(e) => handleChange("complementNumber", Number(e.target.value))}
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