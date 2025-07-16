"use client"

import { SigenAppLayout } from "@/components/sigen-app-layout";
import { SigenDropdown } from "@/components/sigen-dropdown";
import { SigenFormField } from "@/components/sigen-form-field";
import { SigenInput } from "@/components/sigen-input";
import { SigenInputConnector } from "@/components/sigen-input-connector";
import { CeilingType } from "@/domain/entities/ceiling";
import { PendencyState } from "@/domain/entities/pendency";
import { WallType } from "@/domain/entities/wall";
import { SigenDialogProps } from "@/components/sigen-dialog";
import { useForm, validators } from "@/hooks/useform";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SigenLoadingButton } from "@/components/sigen-loading-button";
import { SigenDialog } from "@/components/sigen-dialog"; 

interface SearchForm {
  pendencyState?: PendencyState | undefined;
  nomeMorador: string;
  numberOfPeople: number;
  wallType: string;
  otherWallType: string;
  ceilingType: string;
  otherCeilingType: string;
  captureIntra?: boolean;
  capturePeri?: boolean;
  positiveAttachments: number;
  negativeAttachments: number;
  numberOfCats: number;
  numberOfDogs: number;
}

export default function SearchRegisterForm() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const residenciaId = searchParams.get('residenciaId');

  const mandatoryCaptureSelection = (_: any, allValues: SearchForm) => {
  if (!allValues.captureIntra && !allValues.capturePeri)
    return "Selecione ao menos um tipo de captura";
  };

  const { values, errors, handleChange, validateForm, resetForm } = useForm(
    {
      pendencyState: undefined,
      nomeMorador: "",
      numberOfPeople: 0,
      wallType: "",
      otherWallType: "",
      ceilingType: "",
      otherCeilingType: "",
      captureIntra: false,
      capturePeri: false,
      positiveAttachments: 0,
      negativeAttachments: 0,
      numberOfCats: 0,
      numberOfDogs: 0,
    } as SearchForm,
    {
      nomeMorador:[],
      numberOfPeople:[ validators.required("Campo obrigatório") ],
      wallType:[ validators.required("Campo obrigatório") ],
      otherWallType: [ 
        (value: unknown, allValues: SearchForm) => {
          if (allValues.wallType === WallType.others && !value) {
            return "Por favor, especifique o tipo de parede.";
          }
          return undefined;
        },
        (value) =>
          value && /\d/.test(String(value))
            ? "O campo não deve conter números"
            : undefined,
      ],
      ceilingType:[ validators.required("Campo obrigatório") ],
      otherCeilingType: [ 
        (value: unknown, allValues: SearchForm) => {
          if (allValues.ceilingType === CeilingType.others && !value) {
            return "Por favor, especifique o tipo de telhado.";
          }
          return undefined;
        },
        (value) =>
          value && /\d/.test(String(value))
            ? "O campo não deve conter números"
            : undefined,
      ],
      captureIntra: [
        mandatoryCaptureSelection,
      ],
      capturePeri: [
        mandatoryCaptureSelection,
      ],
      positiveAttachments:[ validators.required("Campo obrigatório"),
        (value) =>
          value && !/^\d+$/.test(String(value))
            ? "O campo anexos positivos deve conter apenas números"
            : undefined,
       ],
      negativeAttachments:[ validators.required("Campo obrigatório"),
        (value) =>
          value && !/^\d+$/.test(String(value))
            ? "O campo anexos negativos deve conter apenas números"
            : undefined,
       ],
      numberOfCats:[ validators.required("Campo obrigatório"),
        (value) =>
          value && !/^\d+$/.test(String(value))
            ? "O campo número de gatos deve conter apenas números"
            : undefined,
       ],
      numberOfDogs:[ validators.required("Campo obrigatório"),
        (value) =>
          value && !/^\d+$/.test(String(value))
            ? "O campo número de cachorros deve conter apenas números"
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

    const token = localStorage.getItem('seu_token_jwt');

    if (!token) {
        setDialog({
            isOpen: true,
            type: 'error',
            message: 'Sessão expirada ou usuário não autenticado. Por favor, faça login novamente.'
        });

        return;
    }

    if (!validateForm()) {
        setDialog({
            isOpen: true,
            type: 'error',
            message: 'Por favor, preencha os campos obrigatórios.'
        });
        return;
    }

    if (!residenciaId) {
        setDialog({
            isOpen: true,
            type: 'error',
            message: 'ID da residência não encontrado. Não é possível continuar.'
        });
        return;
    }

    setIsLoading(true);

    try {
        const response = await fetch('/api/search/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                ...values,
                residenciaId: residenciaId,
            }),
        });

        if (response.ok) {
            setDialog({
                isOpen: true,
                type: 'success',
                message: 'Cadastro realizado com sucesso!',
            });
            setTimeout(() => {
                router.push('/');
            }, 2000);
        } else if (response.status === 401 || response.status === 403) {
            setDialog({
                isOpen: true,
                type: 'error',
                message: 'Você não tem permissão para realizar esta ação.',
            });
        } else {
            const errorData = await response.json();
            setDialog({
                isOpen: true,
                type: 'error',
                message: errorData.message || 'Ocorreu um erro ao realizar o cadastro.',
            });
        }
    } catch {
        setDialog({
            isOpen: true,
            type: 'error',
            message: 'Não foi possível conectar ao servidor. Tente novamente mais tarde.'
        });
    } finally {
        setIsLoading(false);
    }
  };

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
                { value: PendencyState.nenhuma, label: PendencyState.nenhuma },
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

          <SigenInputConnector showLine={values.ceilingType === CeilingType.others}>
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
          >
            <div className="flex items-center flex-wrap pl-1 pt-2">
               <hr></hr>
              <label htmlFor="captureIntra" className="text-sm text-gray-700">Intra</label>
              <input
                type="checkbox"
                id="captureIntra"
                checked={values?.captureIntra || false}
                onChange={(e) => handleChange('captureIntra', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ml-1"   
              />

              <label htmlFor="capturePeri" className="text-sm ml-15 text-gray-700">Peri</label>
              <input
                type="checkbox"
                id="capturePeri"
                checked={values?.capturePeri || false}
                onChange={(e) => handleChange('capturePeri', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ml-1"              
              />     
            </div>    
          </SigenFormField>

          <SigenFormField
            id="positiveAttachments"
            label="Anexos Positivos:"
            error={errors.positiveAttachments}
          >
            <SigenInput
              id="positiveAttachments"
              value={values.positiveAttachments}
              onChange={(e) => handleChange("positiveAttachments", e.target.value)}
              aria-invalid={!!errors.positiveAttachments}
              placeholder="Digite o número de anexos positivos"
            />
          </SigenFormField>
        
          <SigenFormField
            id="negativeAttachments"
            label="Anexos Negativos:"
            error={errors.negativeAttachments}
          >
            <SigenInput
              id="negativeAttachments"
              value={values.negativeAttachments}
              onChange={(e) => handleChange("negativeAttachments", e.target.value)}
              aria-invalid={!!errors.negativeAttachments}
              placeholder="Digite o número de anexos negativos"
            />
          </SigenFormField>
          
          <SigenFormField
            id="numberOfCats"
            label="Número de Gatos:"
            error={errors.numberOfCats}
          >
            <SigenInput
              id="numberOfCats"
              value={values.numberOfCats}
              onChange={(e) => handleChange("numberOfCats", e.target.value)}
              aria-invalid={!!errors.numberOfCats}
              placeholder="Digite o número de gatos"
            />
          </SigenFormField>

          <SigenFormField
            id="numberOfDogs"
            label="Número de Cachorros:"
            error={errors.numberOfDogs}
          >
            <SigenInput
              id="numberOfDogs"
              value={values.numberOfDogs}
              onChange={(e) => handleChange("numberOfDogs", e.target.value)}
              aria-invalid={!!errors.numberOfDogs}
              placeholder="Digite o número de cachorros"
            />
          </SigenFormField>

          <div className="pt-4">
            <SigenLoadingButton type="submit" loading={isLoading}>
              Cadastrar
            </SigenLoadingButton>
          </div>
        </form>
      </SigenAppLayout>
      <SigenDialog
        isOpen={dialog.isOpen}
        type={dialog.type}
        message={dialog.message}
        onClose={() => setDialog({ ...dialog, isOpen: false })}
      />
    </>
  )
}
