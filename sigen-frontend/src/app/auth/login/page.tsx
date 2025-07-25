"use client";

import { useForm, validators } from "@/hooks/useform";
import { SigenFormField } from "@/components/sigen-form-field";
import { SigenLoadingButton } from "@/components/sigen-loading-button";
import { SigenAppLayout } from "@/components/sigen-app-layout";
import { SigenPasswordInput } from "@/components/sigen-password-input";
import { SigenInput } from "@/components/sigen-input";
import { useState } from "react";
import Cookies from "js-cookie";
import {
  defaultDialogs,
  SigenDialog,
  SigenDialogProps,
} from "@/components/sigen-dialog";
import { CPF } from "@/domain/entities/document";
import { API_BASE_URL } from "@/config/api-config";
import Image from "next/image";
import { useRouter } from "next/navigation"; 

interface LoginForm {
  cpf: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter(); 
  const { values, errors, handleChange, validateForm, resetForm } = useForm(
    {
      cpf: "",
      password: "",
    } as LoginForm,
    {
      cpf: [validators.condition((cpf) => CPF.isValid(cpf), "CPF inválido")],
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

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login?cpf=${values.cpf}&senha=${values.password}`, {
        method: "GET", 
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok && result.isSuccess) {
        if (result.data.token) {
          localStorage.setItem("agentId", result.data.id);
          Cookies.set("authToken", result.data.token, { expires: 0.5, secure: true, sameSite: "strict" });
        }
        const userType = result.data.tipoDeUsuario;
        if (userType === 0) {
          router.push("/agent"); 
        } else if (userType === 1) {
          router.push("/chief-agent"); 
        } else {
          throw new Error("Tipo de usuário desconhecido.");
        }
      } else {
        setDialog({
          isOpen: true,
          type: "error",
          message: result.Message || "CPF ou senha inválidos.",
        });
      }
    } catch (error) {
      setDialog({
        isOpen: true,
        type: "error",
        message: "Não foi possível conectar ao servidor. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SigenAppLayout hideHeader className="bg-[#222831]">
        <div className="text-center pt-4 pb-4">
          <h1 className="text-white text-4xl font-bold mb-2">LOGIN</h1>
          <p className="text-yellow-400 text-lg">Entre na sua conta</p>
        </div>

        <div className="flex justify-center py-2">
          <Image
            width={300}
            height={500}
            src="/images/login-illustration.png"
            alt="Ilustração da tela de Login"
            className="w-68 h-auto"
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 mt-3">
          <SigenFormField
            id="cpf"
            label="CPF:"
            labelStyle="text-white font-normal"
            error={errors.cpf}
          >
            <SigenInput
              id="cpf"
              value={values.cpf}
              mask={CPF.mask}
              onInput={(e) => handleChange("cpf", e.currentTarget.value)}
              className="bg-[#292F37] border-0 border-b border-white/70 text-gray-200"
              aria-invalid={!!errors.cpf}
            />
          </SigenFormField>

          <SigenFormField
            id="password"
            label="Senha:"
            labelStyle="text-white font-normal"
            error={errors.password}
          >
            <SigenPasswordInput
              id="password"
              value={values.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="bg-[#292F37] border-0 border-b border-white/70 text-gray-200"
              aria-invalid={!!errors.password}
            />
          </SigenFormField>

          <div className="pt-6">
            <SigenLoadingButton type="submit" loading={isLoading}>
              Confirmar
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
