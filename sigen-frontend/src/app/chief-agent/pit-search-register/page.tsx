"use client";

import SearchRegisterPITForm from "@/app_features/search/pit-search-register/pit-search-register";
import { Suspense } from "react";

export default function SearchRegisterPITFormPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SearchRegisterPITForm></SearchRegisterPITForm>;
    </Suspense>);
}
