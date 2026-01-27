// src/app/auth/AuthLayoutClient.js
'use client';
import { PublicRoute } from '@/components/auth/ProtectedRoute';

export default function AuthLayoutClient({ children }) {
  return (
    <PublicRoute>
      {children}
    </PublicRoute>
  );
}