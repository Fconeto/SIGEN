"use client"

import { SigenAppLayout } from "@/components/sigen-app-layout";
import { SigenDropdown } from "@/components/sigen-dropdown";
import { SigenFormField } from "@/components/sigen-form-field";
import { SigenInput } from "@/components/sigen-input";
import { SigenInputConnector } from "@/components/sigen-input-connector";
import { CeilingType, CeilingTypeLabels } from "@/domain/entities/ceiling";
import { PendencyState, PendencyStateLabels } from "@/domain/entities/pendency";
import { WallType, WallTypeLabels } from "@/domain/entities/wall";
import { SigenDialog, SigenDialogProps } from "@/components/sigen-dialog";
import { useForm, validators } from "@/hooks/useform";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { SigenLoadingButton } from "@/components/sigen-loading-button";
import { TokenService } from "@/services/auth/token-service";
import { GlobalService } from "@/services/global-service";
import { API_BASE_URL } from "@/config/api-config";
import Cookies from "js-cookie";

interface SearchForm {
  pendencyState?: number | undefined;
  nomeMorador: string;
  numberOfPeople: string;
  wallType: number | undefined;
  otherWallType: string;
  ceilingType: number | undefined;
  otherCeilingType: string;
  captureIntra?: boolean;
  capturePeri?: boolean;
  positiveAttachments: number;
  negativeAttachments: number;
  numberOfCats: string;
  numberOfDogs: string;
}

export default function SearchRegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { values, errors, handleChange, validateForm, resetForm } = useForm(
    {
      pendencyState: undefined,
      nomeMorador: "",
      numberOfPeople: "",
      wallType: undefined,
      otherWallType: "",
      ceilingType: undefined,
      otherCeilingType: "",
      captureIntra: false,
      capturePeri: false,
      positiveAttachments: 0,
      negativeAttachments: 0,
      numberOfCats: "",
      numberOfDogs: "",
    } as SearchForm,
    {
      nomeMorador: [
        (value) =>
          value && /\d/.test(String(value))
            ? "O campo não deve conter números"
            : undefined,
      ],
      numberOfPeople: [validators.required("Campo obrigatório")],
      wallType: [validators.required("Campo obrigatório")],
      otherWallType: [
        (value: unknown, allValues: SearchForm) => {
          if (allValues.wallType === WallType.Outros && !value) {
            return "Por favor, especifique o tipo de parede.";
          }
          return undefined;
        },
        (value) =>
          value && /\d/.test(String(value))
            ? "O campo não deve conter números"
            : undefined,
      ],
      ceilingType: [validators.required("Campo obrigatório")],
      otherCeilingType: [
        (value: unknown, allValues: SearchForm) => {
          if (allValues.ceilingType === CeilingType.Outros && !value) {
            return "Por favor, especifique o tipo de telhado.";
          }
          return undefined;
        },
        (value) =>
          value && /\d/.test(String(value))
            ? "O campo não deve conter números"
            : undefined,
      ],
      captureIntra: [],
      capturePeri: [],
      positiveAttachments: [
        validators.required("Campo obrigatório"),
        (value) =>
          value && !/^\d+$/.test(String(value))
            ? "O campo anexos positivos deve conter apenas números"
            : undefined,
      ],
      negativeAttachments: [
        validators.required("Campo obrigatório"),
        (value) =>
          value && !/^\d+$/.test(String(value))
            ? "O campo anexos negativos deve conter apenas números"
            : undefined,
      ],
      numberOfCats: [
        validators.required("Campo obrigatório"),
        (value) =>
          value && !/^\d+$/.test(String(value))
            ? "O campo número de gatos deve conter apenas números"
            : undefined,
      ],
      numberOfDogs: [
        validators.required("Campo obrigatório"),
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

    if (!validateForm()) {
      setDialog({
          isOpen: true,
          type: 'error',
          message: 'Por favor, preencha os campos obrigatórios.'
      });
      return;
    }

    setIsLoading(true);

    try {
      const token = Cookies.get('authToken');
      const response = await fetch(`${API_BASE_URL}/api/search/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          residenciaId: searchParams.get("id"),
          agentId: localStorage.getItem("agentId") || 0,
          data: new Date().toISOString(),
          pendencia: values.pendencyState,
          nomeDoMorador: values.nomeMorador,
          numeroDeHabitantes: Number(values.numberOfPeople),
          tipoDeParede: values.wallType,
          outrosTipoDeParede: values.otherWallType,
          tipoDeTeto: values.ceilingType,
          outrosTipoDeTeto: values.otherCeilingType,
          capturaIntra: values.captureIntra,
          capturaPeri: values.capturePeri,
          anexosPositivos: Number(values.positiveAttachments),
          anexosNegativos: Number(values.negativeAttachments),
          numGatos: Number(values.numberOfCats),
          numCachorros: Number(values.numberOfDogs),
        }),
      });
      
      if (response.ok) {
        setDialog({
          isOpen: true,
          type: 'success',
          message: 'Cadastro realizado com sucesso!',
        });
        resetForm();
        
        setTimeout(() => {
          setDialog({ isOpen: false, type: 'info', message: '' });
          router.push("/agent"); 
        }, 2000);
        
      } else {
        const errorData = await response.json();
        setDialog({
          isOpen: true,
          type: 'error',
          message: errorData.message || 'Ocorreu um erro ao realizar o cadastro.',
        });
      }
    } catch (error: any) {
      setDialog({
          isOpen: true,
          type: 'error',
          message: error.message || 'Não foi possível conectar ao servidor. Tente novamente mais tarde.'
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
                { value: PendencyState.Nenhuma, label: PendencyStateLabels[PendencyState.Nenhuma] },
                { value: PendencyState.Recusa, label: PendencyStateLabels[PendencyState.Recusa] },
                {
                  value: PendencyState.Fechado,
                  label: PendencyStateLabels[PendencyState.Fechado],
                },
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
              mask={{
                mask: Number,
                scale: 0,
              }}
              aria-invalid={!!errors.numberOfPeople}
              placeholder="Digite o número de habitantes"
            />
          </SigenFormField>

          <SigenInputConnector showLine={values.wallType === WallType.Outros}>
            <SigenFormField
              id="wallType"
              label="Tipo de parede:"
              error={errors.wallType}
            >
              <SigenDropdown
                value={values.wallType}
                onValueChange={(v) => handleChange("wallType", v)}
                options={[
                  {
                    value: WallType.AlvenariaComReboco,
                    label: WallTypeLabels[WallType.AlvenariaComReboco],
                  },
                  {
                    value: WallType.AlvenariaSemReboco,
                    label: WallTypeLabels[WallType.AlvenariaSemReboco],
                  },
                  { value: WallType.BarroComReboco, label: WallTypeLabels[WallType.BarroComReboco] },
                  {
                    value: WallType.BarroSemReboco,
                    label: WallTypeLabels[WallType.BarroSemReboco],
                  },
                  { value: WallType.Madeira, label: WallTypeLabels[WallType.Madeira] },
                  { value: WallType.Outros, label: WallTypeLabels[WallType.Outros] },
                ]}
              />
            </SigenFormField>

            {values.wallType === WallType.Outros && (
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

          <SigenInputConnector
            showLine={values.ceilingType === CeilingType.Outros}
          >
            <SigenFormField
              id="ceilingType"
              label="Tipo de telhado:"
              error={errors.ceilingType}
            >
              <SigenDropdown
                value={values.ceilingType}
                onValueChange={(v) => handleChange("ceilingType", v)}
                options={[
                  { value: CeilingType.Madeira, label: CeilingTypeLabels[CeilingType.Madeira] },
                  { value: CeilingType.Palha, label: CeilingTypeLabels[CeilingType.Palha] },
                  { value: CeilingType.Metalico, label: CeilingTypeLabels[CeilingType.Metalico] },
                  { value: CeilingType.Outros, label: CeilingTypeLabels[CeilingType.Outros] },
                ]}
              />
            </SigenFormField>

            {values.ceilingType === CeilingType.Outros && (
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

          <SigenFormField id="capture" label="Captura"
            error={errors.captureIntra || errors.capturePeri}>
            <div className="flex items-center flex-wrap pl-1 pt-2">
              <hr></hr>
              <label htmlFor="captureIntra" className="text-sm text-gray-700">
                Intra
              </label>
              <input
                type="checkbox"
                id="captureIntra"
                checked={values?.captureIntra || false}
                onChange={(e) => handleChange("captureIntra", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ml-1"
              />

              <label
                htmlFor="capturePeri"
                className="text-sm ml-15 text-gray-700"
              >
                Peri
              </label>
              <input
                type="checkbox"
                id="capturePeri"
                checked={values?.capturePeri || false}
                onChange={(e) => handleChange("capturePeri", e.target.checked)}
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
              onChange={(e) =>
                handleChange("positiveAttachments", Number(e.target.value))
              }
              mask={{
                mask: Number,
                scale: 0,
              }}
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
              onChange={(e) =>
                handleChange("negativeAttachments", Number(e.target.value))
              }
              mask={{
                mask: Number,
                scale: 0,
              }}
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
              mask={{
                mask: Number,
                scale: 0,
              }}
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
              onChange={(e) =>
                handleChange("numberOfDogs",e.target.value)
              }
              mask={{
                mask: Number,
                scale: 0,
              }}
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
              onClose={() => setDialog((prev) => ({ ...prev, isOpen: false }))}
              type={dialog.type}
              title={dialog.title}
              message={dialog.message}
            />
    </>
  );
}
