"use client"

import { SigenAppLayout } from "@/components/sigen-app-layout";
import { SigenCheckbox } from "@/components/sigen-checkbox";
import { defaultDialogs, SigenDialogProps } from "@/components/sigen-dialog";
import { SigenDropdown } from "@/components/sigen-dropdown";
import { SigenFormField } from "@/components/sigen-form-field";
import { SigenInput } from "@/components/sigen-input";
import { PendencyState } from "@/domain/entities/pendency";
import { useForm, validators } from "@/hooks/useform";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SearchForm {
  pendencyState: PendencyState | undefined;
  nomeMorador: string;
  numberOfPeaple: number;
  wallType: string;
  ceilingType: string;
  capture: boolean;
  positiveAttachments: number;
  negativeAttachments: number;
  numberOfCats: number;
  numberOfDogs: number;
}

export default function SearchRegisterForm() {
  const router = useRouter();
  
  const { values, errors, handleChange, validateForm, resetForm } = useForm(
    {
      pendencyState: undefined,
      nomeMorador: "",
      numberOfPeaple: "",
      wallType: "",
      ceilingType: "",
      capture: "",
      positiveAttachments: "",
      negativeAttachments: "",
      numberOfCats: "",
      numberOfDogs: "",
    } as unknown as SearchForm,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [dialog, setDialog] = useState<SigenDialogProps>({
    isOpen: false,
    type: "info",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setDialog(defaultDialogs.error);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    console.log("Form Data:", values);
    setIsLoading(false);
    resetForm();
  };

  return (
    <>
      <SigenAppLayout
        headerTitle="Cadastro de Pesquisa"
        showBackButton
        onBackClick={() => router.back}
      >
        <form onSubmit={handleSubmit} className="space-y-2 mt-8">
          <SigenFormField
            id="pendencyState"
            label="Pendência:"
            error={errors.pendencyState}
          >
            <SigenDropdown
              value={values.pendencyState}
              onValueChange={(v) => handleChange("pendencyState", v)}
              options={[
                { value: PendencyState.recusa, label: PendencyState.recusa },
                { value: PendencyState.casaFechada, label: PendencyState.casaFechada },
              ]}
            />
          </SigenFormField>
        </form>


      </SigenAppLayout>
    </>
  )
}