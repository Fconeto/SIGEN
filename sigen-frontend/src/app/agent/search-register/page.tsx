"use client";

import SearchRegisterForm from "@/app_features/search/search-register/search-register";
import { Suspense } from "react";

export default function AgentSearchRegisterFormPage() {
  return (<Suspense fallback={<div>Carregando...</div>}>
        <SearchRegisterForm></SearchRegisterForm>
      </Suspense>);
}
