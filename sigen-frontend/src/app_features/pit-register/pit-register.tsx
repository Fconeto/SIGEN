"use client";

import { SigenAppLayout } from "@/components/sigen-app-layout";
import { SigenDateInput } from "@/components/sigen-date-picker";
import { SigenDialog, SigenDialogProps } from "@/components/sigen-dialog";
import { SigenFormField } from "@/components/sigen-form-field";
import { SigenInput } from "@/components/sigen-input";
import { SigenLoadingButton } from "@/components/sigen-loading-button";
import { BugType } from "@/domain/entities/bug";
import { useForm, validators } from "@/hooks/useform";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/config/api-config";

interface PITRegisterForm {
  PITNumber: number | undefined;
  CRES?: string;
  city?: string;
  locationCode: number | undefined;
  residenceNumber: number | undefined;
  captureIntra?: boolean;
  capturePeri?: boolean;
  locationOfFind: string;
  nomeMorador?: string;
  nomeCapturador: string;
  bugType: BugType;
  bugTypeOther: string;
  nomeAgente: string;
  registerDate: Date;
}

const BugNumber = {
  Barbeiro: 0,
  NaoSabe: 1,
  Outro: 2
}

export default function PITRegisterForm() {
  const router = useRouter();
  const [captureBug, setCaptureBug] = useState(false);
  const [captureError, setCaptureError] = useState<string | undefined>(
    undefined
  );
  const [firstCapture, setFirstCapture] = useState(false);
  const [bugTypeOtherSelected, setBugTypeOtherSelected] = useState(false)

  const mandatoryCaptureSelection = () => {
    if (!captureBug) {
      return "Selecione ao menos um tipo de captura";
    }
    return undefined;
  };

  const { values, errors, handleChange, validateForm, resetForm } = useForm(
    {
      PITNumber: undefined,
      CRES: "Sobral",
      city: "Ipu",
      locationCode: undefined,
      residenceNumber: undefined,
      captureIntra: false,
      capturePeri: false,
      locationOfFind: "",
      nomeMorador: "",
      nomeCapturador: "",
      bugType: BugType.Barbeiro,
      bugTypeOther: "",
      nomeAgente: "",
      registerDate: new Date(),
    } as PITRegisterForm,
    {
      PITNumber: [
        validators.required("Campo obrigatório"),
        (value) =>
          value && !/^\d+$/.test(String(value))
            ? "O campo Numeração do PIT deve conter apenas números"
            : undefined,
      ],
      locationCode: [
        validators.required("Campo obrigatório"),
        (value) =>
          value && !/^\d+$/.test(String(value))
            ? "O campo Código da Localidade deve conter apenas números"
            : undefined,
      ],
      residenceNumber: [
        validators.required("Campo obrigatório"),
        (value) =>
          value && !/^\d+$/.test(String(value))
            ? "O campo Número da Residência deve conter apenas números"
            : undefined,
      ],
      captureIntra: [mandatoryCaptureSelection],
      capturePeri: [mandatoryCaptureSelection],
      locationOfFind: [validators.required("Campo obrigatório")],
      nomeMorador: [
        (value) =>
          value && /\d/.test(String(value))
            ? "O campo Nome do morador deve conter apenas letras"
            : undefined,
      ],
      nomeCapturador: [
        validators.required("Campo obrigatório"),
        (value) =>
          value && /\d/.test(String(value))
            ? "O campo Nome do Capturador deve conter apenas letras"
            : undefined,
      ],
      bugType: [validators.required("Campo obrigatório")],
      bugTypeOther: [validators.condition<PITRegisterForm, "bugTypeOther">(
        (value) => !(bugTypeOtherSelected && value === ""), 
        "Especifique o nome do inseto"
      )],
      nomeAgente: [
        validators.required("Campo obrigatório"),
        (value) =>
          value && /\d/.test(String(value))
            ? "O campo Nome do Recebedor deve conter apenas letras"
            : undefined,
      ],
      registerDate: [validators.required("Campo obrigatório")],
    }
  );

  useEffect(() => {
      setBugTypeOtherSelected(values.bugType == BugType.Outro)
    }, [values.bugType])

  const validateCaptureSelection = () => {
    if (values.captureIntra || values.capturePeri) {
      setCaptureBug(true);
      setCaptureError(undefined);
    } else {
      setCaptureBug(false);
      if (firstCapture) {
        setCaptureError("Selecione ao menos um tipo de captura");
      }
      setFirstCapture(true);
    }
  };

  useEffect(() => {
    validateCaptureSelection();
  }, [values.captureIntra, values.capturePeri]);

  const [isLoading, setIsLoading] = useState(false);
  const [dialog, setDialog] = useState<SigenDialogProps>({
    isOpen: false,
    type: "info",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    validateCaptureSelection();

    if (!validateForm()) {
      setDialog({
        isOpen: true,
        type: "error",
        message: "Por favor, preencha os campos obrigatórios.",
      });
      return;
    }

    setIsLoading(true);

    const payload = {
      agenteId: localStorage.getItem("agentId"),
      numeracaoDoPit: values.PITNumber,
      cres: values.CRES ?? "",
      municipio: values.city ?? "",
      codigoDaLocalidade: values.locationCode,
      numeroDaCasa: values.residenceNumber,
      capturaIntra: values.captureIntra,
      capturaPeri: values.capturePeri,
      localOndeEncontrou: values.locationOfFind,
      nomeDoMorador: values.nomeMorador ?? "",
      nomeDoCapturador: values.nomeCapturador,
      tipoDoInseto: Object.values(BugType).indexOf(values.bugType) ?? 0,
      outroTipoDeInseto: values.bugTypeOther,
      nomeDoRecebedor: values.nomeAgente,
    };

    try {
      const token = Cookies.get("authToken");
      
      const response = await fetch(`${API_BASE_URL}/api/PIT/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.isSuccess) {
        setDialog({
          isOpen: true,
          type: "success",
          title: "Sucesso",
          message: "Cadastro de PIT realizado com sucesso!",
        });
        resetForm();
      } else {
        setDialog({
          isOpen: true,
          type: "error",
          message: data.Message || "Erro ao realizar o cadastro.",
        });
      }
    } catch {
      setDialog({
        isOpen: true,
        type: "error",
        message: "Erro de conexão. Tente novamente mais tarde.",
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
              onChange={(e) =>
                handleChange("PITNumber", Number(e.target.value))
              }
              mask={{
                mask: Number,
                scale: 0,
              }}
              aria-invalid={!!errors.PITNumber}
              placeholder="Digite a numeração do PIT"
            />
          </SigenFormField>

          <SigenFormField id="CRES" label="CRES:" error={errors.CRES}>
            {<p className="inline text-sm px-2">Sobral</p>}
          </SigenFormField>
          <SigenFormField id="city" label="Município:" error={errors.city}>
            {<p className="inline text-sm px-2">Ipu</p>}
          </SigenFormField>

          <SigenFormField
            id="locationCode"
            label="Código da Localidade:"
            error={errors.locationCode}
          >
            <SigenInput
              id="locationCode"
              value={values.locationCode}
              onChange={(e) =>
                handleChange("locationCode", Number(e.target.value))
              }
              mask={{
                mask: Number,
                scale: 0,
              }}
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
              onChange={(e) =>
                handleChange("residenceNumber", Number(e.target.value))
              }
              mask={{
                mask: Number,
                scale: 0,
              }}
              aria-invalid={!!errors.residenceNumber}
              placeholder="Digite o número da residência"
            />
          </SigenFormField>

          <SigenFormField id="capture" label="Captura" error={captureError}>
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
                    onChange={() => handleChange("bugType", type)}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor={type} className="ml-2 text-sm text-gray-700">
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </SigenFormField>

          {values.bugType === BugType.Outro && (
            <SigenFormField
              id="bugTypeOther"
              label="Qual?"
              error={errors?.bugTypeOther}
            >
              <SigenInput
                id="bugTypeOther"
                name="bugTypeOther"
                value={values.bugTypeOther || ""}
                onChange={(e) => handleChange("bugTypeOther", e.target.value)}
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
              type="text"
              value={values.registerDate}
              readOnly
              disabled
              tabIndex={-1}
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
