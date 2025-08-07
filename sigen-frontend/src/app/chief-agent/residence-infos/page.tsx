import ResidenceInfos from "@/app_features/residence-infos/residence-infos";
import { Suspense } from "react";

export default function ResidenceInfosPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ResidenceInfos />
    </Suspense>
  );
}
