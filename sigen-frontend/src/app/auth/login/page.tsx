"use client";

import { useForm, validators } from "@/hooks/useform";
import { SigenFormField } from "@/components/sigen-form-field";
import { SigenLoadingButton } from "@/components/sigen-loading-button";
import { SigenAppLayout } from "@/components/sigen-app-layout";
import { SigenPasswordInput } from "@/components/sigen-password-input";
import { SigenInput } from "@/components/sigen-input";
import { useState } from "react";
import {
  defaultDialogs,
  SigenDialog,
  SigenDialogProps,
} from "@/components/sigen-dialog";

interface LoginForm {
  user: string;
  password: string;
}

export default function LoginForm() {
  const { values, errors, handleChange, validateForm, resetForm } = useForm(
    {
      user: "",
      password: "",
    } as LoginForm,
    {
      user: [
        validators.required("Campo obrigatório"),
        validators.minLength(6, "Mínimo 6 caracteres"),
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
      <SigenAppLayout className="bg-[#222831]">
        <div className="text-center pt-4 pb-4">
          <h1 className="text-white text-4xl font-bold mb-2">LOGIN</h1>
          <p className="text-yellow-400 text-lg">Entre na sua conta</p>
        </div>

        <div className="flex justify-center py-2">
          <img
            src="/images/login-illustration.png"
            alt="Ilustração da tela de Login"
            className="w-68 h-auto"
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 mt-3">
          <SigenFormField
            id="user"
            label="Usuário:"
            labelStyle="text-white font-normal"
            error={errors.user}
          >
            <SigenInput
              id="user"
              value={values.user}
              onChange={(e) => handleChange("user", e.target.value)}
              className="bg-[#292F37] border-0 border-b border-white/70 text-gray-200"
              aria-invalid={!!errors.user}
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
