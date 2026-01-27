// src\app\checkout\page.js
import { Suspense } from 'react';
import CheckoutContent from './CheckoutContent';
import CheckoutLoading from './loading';

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  );
}

// Optional: Generate metadata for better SEO
export const metadata = {
  title: 'Secure Checkout - Houspire',
  description: 'Complete your interior design package purchase securely',
};