// src\app\mobile-upload\page.js
import MobileUploadPageWrapper from "@/components/projects/uploads/MobileUploadPageWrapper";
import { Suspense } from "react";


export default function MobileUploadPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MobileUploadPageWrapper />
    </Suspense>
  );
}


