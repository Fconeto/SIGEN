"use client";

import { useForm, validators } from "@/hooks/useform";
import { SigenFormField } from "@/components/sigen-form-field";
import { SigenLoadingButton } from "@/components/sigen-loading-button";
import { SigenAppLayout } from "@/components/sigen-app-layout";
import { SigenPasswordInput } from "@/components/sigen-password-input";
import { SigenDropdown } from "@/components/sigen-dropdown";
import { SigenInput } from "@/components/sigen-input";
import { useEffect, useState } from "react";
import { AgentTeam, AgentTeamLabels } from "@/domain/entities/team";
import {
  defaultDialogs,
  SigenDialog,
  SigenDialogProps,
} from "@/components/sigen-dialog";
import { useRouter } from "next/navigation";
import { CPF } from "@/domain/entities/document";
import { API_BASE_URL } from "@/config/api-config";
import { run } from "node:test";
import { GlobalService } from "@/services/global-service";
import Cookies from 'js-cookie';

interface AgentForm {
  agentId: number;
  registration: string;
  agentName: string;
  team: number;
  cpf: string;
  password: string;
  confirmPassword: string;
  hierarchy: number;
}

export default function AgentRegistrationForm() {
  const router = useRouter();

  const {
    values,
    errors,
    handleChange,
    validateForm,
    resetForm,
    validateField,
  } = useForm(
    {
      agentId: 0,
      agentName: "",
      team: 0,
      password: "",
      confirmPassword: "",
      cpf: "",
      hierarchy: 0,
    } as AgentForm,
    {
      registration: [
        validators.required("Campo obrigatório"),
        validators.isNumber("Deve ser um número"),
        validators.condition<AgentForm, "registration">(
          (value) => Number(value) >= 0,
          "A matrícula é um valor positivo"
        ),
      ],
      agentName: [
        validators.required("Campo obrigatório"),
      ],
      team: [validators.required("Campo obrigatório")],
      cpf: [
        validators.required("Campo obrigatório"),
        validators.condition<AgentForm, "cpf">(
          (value) => CPF.isValid(value ?? ""),
          "CPF inválido"
        ),
      ],
      password: [
        validators.required("Campo obrigatório"),
        validators.minLength(8, "Mínimo 8 caracteres"),
        validators.condition<AgentForm, "password">((value) =>
          (/\d/.test(String(value))), 
          "A senha deve conter pelo menos um número"
        ),
        validators.condition<AgentForm, "password">((value) =>
          !/^\d+$/.test(String(value)), 
          "A senha deve conter pelo menos uma letra"
        ),
      ],
      confirmPassword: [
        validators.required("Campo obrigatório"),
        validators.equalField<AgentForm>("password", "As senhas não condizem"),
      ],
      hierarchy: [validators.required("Campo obrigatório"),]
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [dialog, setDialog] = useState<SigenDialogProps>({
    isOpen: false,
    type: "info",
    message: "",
  });

  useEffect(() => {
    if (values.confirmPassword) {
      validateField("confirmPassword");
    }
  }, [values.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const token = Cookies.get('authToken');
      const agentId = localStorage.getItem("agentId") || 0;

      const response = await fetch(`${API_BASE_URL}/api/Auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          agenteId: agentId,
          nomeDoAgente: values.agentName,
          turma: values.team,
          senha: values.password,
          matricula: values.registration,
          cpf: CPF.strip(values.cpf),
          hierarquia: values.hierarchy,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.Message || "Erro ao cadastrar agente");
      }

      setDialog({
        isOpen: true,
        type: "success",
        title: "Cadastro realizado",
        message: data.message || "Agente cadastrado com sucesso!",
      });

      resetForm();
    } catch (error: any) {
      setDialog({
        isOpen: true,
        type: "error",
        title: "Erro",
        message: error.message || "Erro ao cadastrar agente",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SigenAppLayout
        headerTitle="Cadastro de Agente"
        showBackButton
        onBackClick={() => router.back()}
      >
        <form onSubmit={handleSubmit} className="space-y-2 mt-8">
          <SigenFormField
            id="agentName"
            label="Nome do Agente:"
            error={errors.agentName}
          >
            <SigenInput
              id="agentName"
              value={values.agentName}
              onChange={(e) => handleChange("agentName", e.target.value)}
              aria-invalid={!!errors.agentName}
              placeholder="Digite o nome do agente"
            />
          </SigenFormField>

          <SigenFormField id="cpf" label="CPF do agente:" error={errors.cpf}>
            <SigenInput
              id="cpf"
              mask={CPF.mask}
              value={values.cpf}
              onChange={(e) => handleChange("cpf", e.target.value)}
              aria-invalid={!!errors.cpf}
              placeholder="Digite o CPF do agente"
            />
          </SigenFormField>

          <SigenFormField
            id="registration"
            label="Matrícula do agente:"
            error={errors.registration}
          >
            <SigenInput
              id="registration"
              value={values.registration}
              mask={{
                mask: Number,
                scale: 0,
              }}
              onChange={(e) => handleChange("registration", e.target.value)}
              aria-invalid={!!errors.registration}
              placeholder="Digite identificador do agente"
              inputMode="numeric"
            />
          </SigenFormField>

          <SigenFormField id="team" label="Equipe:" error={errors.team}>
            <SigenDropdown
              value={values.team}
              onValueChange={(v) => handleChange("team", v)}
              options={[
                {
                  value: AgentTeam.dengue,
                  label: AgentTeamLabels[AgentTeam.dengue],
                },
                {
                  value: AgentTeam.febreAmarela,
                  label: AgentTeamLabels[AgentTeam.febreAmarela],
                },
                {
                  value: AgentTeam.chagas,
                  label: AgentTeamLabels[AgentTeam.chagas],
                },
                {
                  value: AgentTeam.peste,
                  label: AgentTeamLabels[AgentTeam.peste],
                },
              ]}
            />
          </SigenFormField>

          <SigenFormField id="password" label="Senha:" error={errors.password}>
            <SigenPasswordInput
              id="password"
              value={values.password}
              onChange={(e) => {
                handleChange("password", e.target.value);
              }}
              aria-invalid={!!errors.password}
              placeholder="Digite a senha"
            />
          </SigenFormField>

          <SigenFormField
            id="confirmPassword"
            label="Confirme sua senha:"
            error={errors.confirmPassword}
          >
            <SigenPasswordInput
              id="confirmPassword"
              value={values.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              aria-invalid={!!errors.confirmPassword}
              placeholder="Digite confirme sua senha"
            />
          </SigenFormField>

          <SigenFormField id="hierarchy" label="Hierarquia:" error={errors.hierarchy}>
            <SigenDropdown
              value={values.hierarchy}
              onValueChange={(v) => handleChange("hierarchy", v)}
              options={[
                {
                  value: 0,
                  label: "Agente de campo",
                },
                {
                  value: 1,
                  label: "Agente chefe",
                },
              ]}
            />
          </SigenFormField>

          <div className="pt-8">
            <SigenLoadingButton
              type="submit"
              loading={isLoading}
              disabled={
                !!errors.registration ||
                !!errors.agentName ||
                !!errors.password ||
                !!errors.team ||
                !!errors.confirmPassword ||
                !!errors.cpf
              }
            >
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
