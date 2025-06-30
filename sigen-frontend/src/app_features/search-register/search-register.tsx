"use client"

import { SigenAppLayout } from "@/components/sigen-app-layout";
import { SigenDropdown } from "@/components/sigen-dropdown";
import { SigenFormField } from "@/components/sigen-form-field";
import { SigenInput } from "@/components/sigen-input";
import { SigenInputConnector } from "@/components/sigen-input-connector";
import { CeilingType } from "@/domain/entities/ceiling";
import { PendencyState } from "@/domain/entities/pendency";
import { WallType } from "@/domain/entities/wall";
import { defaultDialogs, SigenDialogProps } from "@/components/sigen-dialog";
import { useForm, validators } from "@/hooks/useform";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SearchForm {
  pendencyState?: PendencyState | undefined;
  nomeMorador: string;
  numberOfPeople: number;
  wallType: string;
  otherWallType: string;
  ceilingType: string;
  otherCeilingType: string;
  capture: {
    intra: boolean,
    peri: boolean,
  };
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
      numberOfPeople: 0,
      wallType: "",
      otherWallType: "",
      ceilingType: "",
      otherCeilingType: "",
      capture: {
        intra: false,
        peri: false,
      },
      positiveAttachments: 0,
      negativeAttachments: 0,
      numberOfCats: 0,
      numberOfDogs: 0,
    } as SearchForm,
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


  function handleCaptureChange(arg0: string, checked: boolean): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <SigenAppLayout
        headerTitle="Cadastro de Pesquisa"
        showBackButton
        onBackClick={() => router.back()}
      >
        <form onSubmit={handleSubmit} className="space-y-1 mt-2">
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
            id="numberOfPeople"
            label="Número de habitantes:"
            error={errors.numberOfPeople}
          >
            <SigenInput
              id="numberOfPeople"
              value={values.numberOfPeople}
              onChange={(e) => handleChange("numberOfPeople", e.target.value)}
              aria-invalid={!!errors.numberOfPeople}
              placeholder="Digite o número de habitantes"
            />
          </SigenFormField>
          
          <SigenInputConnector showLine={values.wallType === WallType.others}>
            <SigenFormField
              id="wallType"
              label="Tipo de parede:"
              error={errors.wallType}
            >
              <SigenDropdown
                value={values.wallType}
                onValueChange={(v) => handleChange("wallType", v)}
                options={[
                  { value: WallType.plasteredMasonry, label: WallType.plasteredMasonry },
                  { value: WallType.unplasteredMasonry, label: WallType.unplasteredMasonry },
                  { value: WallType.clayPlaster, label: WallType.clayPlaster },
                  { value: WallType.clayNoPlaster, label: WallType.clayNoPlaster },
                  { value: WallType.wood, label: WallType.wood },
                  { value: WallType.others, label: WallType.others },
                ]}
              />
            </SigenFormField>

            {values.wallType === WallType.others && (
              <div className="-mt-3 pl-11">
                <SigenFormField
                  id="otherWallTye"
                  label="Especifique o tipo de parede:"
                  error={errors.otherWallType}
                >
                  <SigenInput 
                    id="otherWallType"
                    value={values.otherWallType}
                    onChange={(e) =>
                      handleChange("otherWallType", e.target.value)
                    }
                    aria-invalid={!!errors.otherWallType}
                    placeholder="Digite o tipo de parede"
                  />
                </SigenFormField>
              </div>  
            )}
          </SigenInputConnector>

          <SigenInputConnector showLine={values.wallType === WallType.others}>
            <SigenFormField
              id="ceilingType"
              label="Tipo de telhado:"
              error={errors.ceilingType}
            >
              <SigenDropdown
                value={values.ceilingType}
                onValueChange={(v) => handleChange("ceilingType", v)}
                options={[
                  { value: CeilingType.tile, label: CeilingType.tile },
                  { value: CeilingType.straw, label: CeilingType.straw },
                  { value: CeilingType.wood, label: CeilingType.wood },
                  { value: CeilingType.metalic, label: CeilingType.metalic },
                  { value: CeilingType.others, label: CeilingType.others },
                ]}
              />
            </SigenFormField>

            {values.ceilingType === CeilingType.others && (
              <div className="-mt-3 pl-11">
                <SigenFormField
                  id="otherCeilingType"
                  label="Especifique o tipo de telhado:"
                  error={errors.otherCeilingType}
                >
                  <SigenInput
                    id="otherCeilingType"
                    value={values.otherCeilingType}
                    onChange={(e) =>
                      handleChange("otherCeilingType", e.target.value)
                    }
                    aria-invalid={!!errors.otherCeilingType}
                    placeholder="Digite o tipo de telhado"
                  />
                </SigenFormField>
              </div>
              )}
          </SigenInputConnector>

          <SigenFormField
            id="capture"
            label="Captura"
            error={errors.capture}
          >
            <div className="flex items-center flex-wrap gap-y-2 pl-4 pt-2">

              {/* ITEM 1: Label Intra */}
              <label htmlFor="intra-checkbox" className="text-gray-700">
                Intra
              </label>

              {/* ITEM 2: Input Intra */}
              <input
                type="checkbox"
                id="intra-checkbox"
                checked={values.capture?.intra || false}
                onChange={(e) => handleCaptureChange('intra', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"   
              />

              {/* ITEM 3: Label Peri - com margem à esquerda para separar dos itens anteriores */}
              <label htmlFor="peri-checkbox" className="ml-6 text-gray-700">
                Peri
              </label>

              {/* ITEM 4: Input Peri */}
              <input
                type="checkbox"
                id="peri-checkbox"
                checked={values.capture?.peri || false}
                onChange={(e) => handleCaptureChange('peri', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"              
              />     
            </div>    
          </SigenFormField>
        </form>
      </SigenAppLayout>
    </>
  )
}
