import SprayConsult from "@/app_features/spray/spray-consult/spray-consult";
import { Suspense } from "react";

export default function SprayConsultPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SprayConsult />
    </Suspense>
  );
}
