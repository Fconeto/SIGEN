"use client";

import { useForm, validators } from "@/hooks/useform";
import { SigenFormField } from "@/components/sigen-form-field";
import { SigenLoadingButton } from "@/components/sigen-loading-button";
import { SigenAppLayout } from "@/components/sigen-app-layout";
import { SigenPasswordInput } from "@/components/sigen-password-input";
import { SigenDropdown } from "@/components/sigen-dropdown";
import { SigenInput } from "@/components/sigen-input";
import { useState } from "react";
import { AgentTeams } from "@/domain/entities/team";
import {
  defaultDialogs,
  SigenDialog,
  SigenDialogProps,
} from "@/components/sigen-dialog";
import { useRouter } from "next/navigation";
import { CPF } from "@/domain/entities/document";

interface AgentForm {
  agentId: string;
  agentName: string;
  team: AgentTeam | undefined;
  cpf: string;
  password: string;
  confirmPassword: string;
}

export default function AgentRegistrationForm() {
  const { values, errors, handleChange, validateForm, resetForm } = useForm(
    {
      agentId: "",
      agentName: "",
      team: "",
      password: "",
      confirmPassword: "",
      cpf: "",
    } as AgentForm,
    {
      agentId: [
        validators.required("Campo obrigatório"),
        validators.minLength(6, "Mínimo 6 caracteres"),
      ],
      agentName: [
        validators.required("Campo obrigatório"),
        validators.minLength(6, "Mínimo 6 caracteres"),
      ],
      team: [validators.required("Campo obrigatório")],
      cpf: [
        validators.required("Campo obrigatório"),
        validators.condition(
          (value) => CPF.isValid(value ?? ""),
          "CPF inválido"
        ),
      ],
      password: [
        validators.required("Campo obrigatório"),
        validators.minLength(6, "Mínimo 6 caracteres"),
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
        headerTitle="Cadastro de Agente"
        showBackButton
        onBackClick={() => {}}
      >
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
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
            id="agentId"
            label="Matrícula do agente:"
            error={errors.agentId}
          >
            <SigenInput
              id="agentId"
              value={values.agentId}
              onChange={(e) => handleChange("agentId", e.target.value)}
              aria-invalid={!!errors.agentId}
            />
          </SigenFormField>

          <SigenFormField id="team" label="Equipe:" error={errors.team}>
            <SigenDropdown
              value={values.team}
              onValueChange={(v) => handleChange("team", v)}
              options={[
                { value: AgentTeams.dengue, label: AgentTeams.dengue },
                {
                  value: AgentTeams.febreAmarela,
                  label: AgentTeams.febreAmarela,
                },
                { value: AgentTeams.chagas, label: AgentTeams.chagas },
              ]}
            />
          </SigenFormField>

          <SigenFormField id="password" label="Senha:" error={errors.password}>
            <SigenPasswordInput
              id="password"
              value={values.password}
              onChange={(e) => handleChange("password", e.target.value)}
              aria-invalid={!!errors.password}
            />
          </SigenFormField>

          <div className="pt-8">
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
