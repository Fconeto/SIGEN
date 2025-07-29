import SearchInfos from "@/app_features/search/search-infos/search-infos";
import { Suspense } from "react";

export default function SearchInfosPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SearchInfos />
    </Suspense>
  );
}
