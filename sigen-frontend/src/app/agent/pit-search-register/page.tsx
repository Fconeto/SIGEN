"use client";

import { Suspense } from "react";

import SearchRegisterPITForm from "@/app_features/search/pit-search-register/pit-search-register";

export default function SearchRegisterPITFormPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchRegisterPITForm></SearchRegisterPITForm>
    </Suspense>
  );
}
