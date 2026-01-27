// src\app\packages\page.js
"use client";

import PackagesContentPage from "@/components/packges/PackegesContnet";

import { Suspense } from "react";

export default function PackagesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PackagesContentPage />
    </Suspense>
  );
}
