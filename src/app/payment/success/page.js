// src/app/payment/success/page.js
'use client';

import PaymentSuccessContent from '@/components/payment/PaymentSuccessContent';
import { Suspense } from 'react';


export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
