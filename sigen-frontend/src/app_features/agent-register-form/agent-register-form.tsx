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

interface AgentForm {
  agentId: string;
  matricula: string;
  agentName: string;
  team: number;
  cpf: string;
  password: string;
  confirmPassword: string;
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
      agentId: "",
      matricula: "",
      agentName: "",
      team: 0,
      password: "",
      confirmPassword: "",
      cpf: "",
    } as AgentForm,
    {
      matricula: [
        validators.required("Campo obrigatório"),
        validators.minLength(6, "Mínimo 6 caracteres"),
        validators.isNumber("Deve ser um número"),
      ],
      agentName: [
        validators.required("Campo obrigatório"),
        validators.minLength(6, "Mínimo 6 caracteres"),
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
        validators.minLength(6, "Mínimo 6 caracteres"),
      ],
      confirmPassword: [
        validators.required("Campo obrigatório"),
        validators.equalField<AgentForm>("password", "As senhas não condizem"),
      ],
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
      const agentId = GlobalService.getInstance().getUser()?.id;
      const response = await fetch(`${API_BASE_URL}/api/Auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agenteId: agentId,
          nomeDoAgente: values.agentName,
          turma: values.team,
          senha: values.password,
          matricula: Number(values.matricula),
          cpf: CPF.strip(values.cpf),
          hierarquia: 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao cadastrar agente");
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
            id="matricula"
            label="Matrícula do agente:"
            error={errors.matricula}
          >
            <SigenInput
              id="matricula"
              value={values.matricula}
              mask={{
                mask: Number,
                scale: 0,
              }}
              onChange={(e) => handleChange("matricula", e.target.value)}
              aria-invalid={!!errors.matricula}
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

          <div className="pt-8">
            <SigenLoadingButton
              type="submit"
              loading={isLoading}
              disabled={
                !!errors.matricula ||
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
