"use client";

import { SigenAppLayout } from "@/components/sigen-app-layout";
import { SigenDateInput } from "@/components/sigen-date-picker";
import { SigenDialogProps } from "@/components/sigen-dialog";
import { SigenFormField } from "@/components/sigen-form-field";
import { SigenInput } from "@/components/sigen-input";
import { SigenLoadingButton } from "@/components/sigen-loading-button";
import { BugType } from "@/domain/entities/bug";
import { useForm, validators } from "@/hooks/useform";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PITRegisterForm {
  PITNumber: number;
  CRES?: string;
  city?: string;
  locationCode: number;
  residenceNumber: number;
  captureIntra?: boolean;
  capturePeri?: boolean;
  locationOfFind: string;
  nomeMorador?: string;
  nomeCapturador: string;
  bugType: BugType | undefined;
  bugTypeOther: string;
  nomeAgente: string;
  registerDate: Date;
}

export default function PITRegisterForm () {
  const router = useRouter();
    
  const mandatoryCaptureSelection = (_: any, allValues: PITRegisterForm) => {
    if (!allValues.captureIntra && !allValues.capturePeri)
      return "Selecione ao menos um tipo de captura";
  };

  const { values, errors, handleChange, validateForm, resetForm } = useForm(
    {
      PITNumber: 0,
      CRES: "Sobral",
      city: "Ipu",
      locationCode: 0,
      residenceNumber: 0,
      captureIntra: false,
      capturePeri: false,
      locationOfFind: "",
      nomeMorador: "",
      nomeCapturador: "",
      bugType: undefined,
      bugTypeOther: "",
      nomeAgente: "",
      registerDate: new Date(),
    } as PITRegisterForm,
    {
      PITNumber: [
        validators.required("Campo obrigatório"),
      ],
      locationCode: [
        validators.required("Campo obrigatório"),
      ],
      residenceNumber: [
        validators.required("Campo obrigatório"),
      ],
      captureIntra: [
        mandatoryCaptureSelection,
      ],
      capturePeri: [
        mandatoryCaptureSelection,
      ],
      locationOfFind: [
        validators.required("Campo obrigatório"),
      ],
      nomeCapturador: [
        validators.required("Campo obrigatório"),
      ],
      bugType: [
        validators.required("Campo obrigatório"),
      ],
      nomeAgente: [
        validators.required("Campo obrigatório"),
      ],
      registerDate: [
        validators.required("Campo obrigatório"),
      ],
    }
  );

  const [isLoading, setIsLoading] = useState(false);
  const [, setDialog] = useState<SigenDialogProps>({
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
      const response = await fetch('/api/pit/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values), 
      });
      
      if (response.ok) {
        setDialog({
          isOpen: true,
          type: 'success',
          message: 'Cadastro de PIT realizado com sucesso!',
        });
        resetForm();
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
        headerTitle="Cadastro de PIT"
        showBackButton
        onBackClick={() => router.back()}
      >
        <form onSubmit={handleSubmit} className="space-y-1 mt-2">
          <SigenFormField
            id="PITNumber"
            label="Numeração do PIT:"
            error={errors.PITNumber}
          >
            <SigenInput
              id="PITNumber"
              value={values.PITNumber}
              onChange={(e) => handleChange("PITNumber", e.target.value)}
              aria-invalid={!!errors.PITNumber}
              placeholder="Digite a numeração do PIT"
            />              
          </SigenFormField>

          <SigenFormField
            id="CRES"
            label="CRES:"
            error={errors.CRES}
            children={<p className="inline text-sm px-2">Sobral</p>}
          />
            <SigenFormField
            id="city"
            label="Município:"
            error={errors.city}
            children={<p className="inline text-sm px-2">Ipu</p>}
          />
          
          <SigenFormField
            id="locationCode"
            label="Código da Localidade:"
            error={errors.locationCode}
          >
            <SigenInput
              id="locationCode"
              value={values.locationCode}
              onChange={(e) => handleChange("locationCode", e.target.value)}
              aria-invalid={!!errors.locationCode}
              placeholder="Digite o código da localidade"
            />              
          </SigenFormField>

          <SigenFormField
            id="residenceNumber"
            label="Número da Residência:"
            error={errors.residenceNumber}
          >
            <SigenInput
              id="residenceNumber"
              value={values.residenceNumber}
              onChange={(e) => handleChange("residenceNumber", e.target.value)}
              aria-invalid={!!errors.residenceNumber}
              placeholder="Digite o número da residência"
            />              
          </SigenFormField>

          <SigenFormField
            id="capture"
            label="Captura"
            error={errors.captureIntra}
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
              id="locationOfFind"
              label="Local onde encontrou:"
              error={errors.locationOfFind}
            >
              <SigenInput
                id="locationOfFind"
                value={values.locationOfFind}
                onChange={(e) => handleChange("locationOfFind", e.target.value)}
                aria-invalid={!!errors.locationOfFind}
                placeholder="Digite o local de encontro"
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
            id="nomeCapturador"
            label="Nome do Capturador:"
            error={errors.nomeCapturador}
          >
            <SigenInput
              id="nomeCapturador"
              value={values.nomeCapturador}
              onChange={(e) => handleChange("nomeCapturador", e.target.value)}
              aria-invalid={!!errors.nomeCapturador}
              placeholder="Digite o nome do capturador"
            />
          </SigenFormField>

          <SigenFormField
            id="bugType"
            label="Tipo de Inseto"
            error={errors?.bugType}
          >
            <div className="flex items-center flex-wrap pl-1 pt-2 space-x-6">
              {Object.values(BugType).map((type) => (
                <div key={type} className="flex items-center">
                  <input
                    type="radio"
                    id={type}
                    name="bugType"
                    value={type}
                    checked={values.bugType === type}
                    onChange={() => handleChange('bugType', type)}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor={type} className="ml-2 text-sm text-gray-700">
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </SigenFormField>
          
          {values.bugType === BugType.outro && (
          <SigenFormField
            id="bugTypeOther"
            label="Qual?"
            error={errors?.bugTypeOther}
          >
            <SigenInput
              id="bugTypeOther"
              name="bugTypeOther"
              value={values.bugTypeOther || ''}
              onChange={(e) => handleChange('bugTypeOther', e.target.value)}
              placeholder="Especifique o tipo do inseto"
            />
          </SigenFormField>
          )}

          <SigenFormField
            id="nomeAgente"
            label="Nome do Recebedor: (agente)"
            error={errors.nomeAgente}
          >
            <SigenInput
              id="nomeAgente"
              value={values.nomeAgente}
              onChange={(e) => handleChange("nomeAgente", e.target.value)}
              aria-invalid={!!errors.nomeAgente}
              placeholder="Digite o nome do agente"
            />
          </SigenFormField>

          <SigenFormField
            id="registerDate"
            label="Data do Registro:"
            error={errors.registerDate}
          >
            <SigenDateInput 
              id="registerDate"
              value={values.registerDate}
              aria-invalid={!!errors.registerDate}
            />
          </SigenFormField>

          <div className="pt-4">
            <SigenLoadingButton type="submit" loading={isLoading}>
              Cadastrar
            </SigenLoadingButton>
          </div>
        </form>
      </SigenAppLayout>
    </>
  )
}