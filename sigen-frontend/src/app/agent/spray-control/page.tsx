import SprayControlForm from "@/app_features/spray/spray-control-form/spray-control-form";
import { Suspense } from "react";

export default function AgentRegisterSprayControl() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SprayControlForm></SprayControlForm>
    </Suspense>
  );
}
