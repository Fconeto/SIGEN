import SprayInfos from "@/app_features/spray/spray-infos/spray-infos";
import { Suspense } from "react";

export default function SprayInfosPage() {
  return (<Suspense fallback={<div>Carregando...</div>}>
          <SprayInfos></SprayInfos>
        </Suspense>)
}
