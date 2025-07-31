"use client";

import PITResults from "@/app_features/pit-results/pit-results";
import { Suspense } from "react";

export default function PITResultsPage() {
  return (
      <Suspense fallback={<div>Carregando...</div>}>
        <PITResults></PITResults>
      </Suspense>
    );
}
