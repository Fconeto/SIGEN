"use client";

import LocalityConsult from "@/app_features/locality-consult/locality-consult";
import { Suspense } from "react";

export default function SearchRegisterPITFormPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LocalityConsult></LocalityConsult>;
    </Suspense>);
}
