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

export default function PITResults() {
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
    
    const searchParams = Object.fromEntries(
      Object.entries(values).filter(([key, value]) => {
        if (typeof value === 'string') return value.trim() !== '';
        if (typeof value === 'number') return value > 0;
        return !!value;
      })
    );

    const queryString = new URLSearchParams(searchParams as Record<string, string>).toString();

    // try {
    //   const response = await fetch(`/api/pit/consult?${queryString}`);

    //   if (!response.ok) {
    //     const errorData = await response.json().catch(() => ({ message: 'Não foi possível encontrar resultados.' }));
    //     throw new Error(errorData.message);
    //   }
      
    //   const results = await response.json();
    //   if (results.length === 0) {
    //     setDialog({
    //       isOpen: true,
    //       type: 'info',
    //       message: 'Nenhum resultado encontrado para os filtros informados.',
    //       onConfirm: () => setDialog({ ...dialog, isOpen: false }),
    //     });
    //     return; 
    //   }

       router.push(`/chief-agent/pit-results?${queryString}`);

    // } catch (error: any) {
    //   setDialog({
    //     isOpen: true,
    //     type: 'error',
    //     message: error.message || 'Ocorreu um erro ao realizar a busca. Tente novamente.',
    //     onConfirm: () => setDialog({ ...dialog, isOpen: false }),
    //   });
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return(
    <>
      <SigenAppLayout
        headerTitle="Pesquisa de PIT"
        showBackButton
        onBackClick={() => router.back()}
      >
        <form onSubmit={handleSubmit} className="space-y-2 mt-8">
          
        </form>
      </SigenAppLayout>
    </>
  );
}