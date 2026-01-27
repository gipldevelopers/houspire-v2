'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function GoogleOneTapAuto() {
  const { googleAuth, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const initialized = useRef(false);

  useEffect(() => {
    // Skip in development mode - analytics and one-tap are disabled
    if (process.env.NODE_ENV === 'development') {
      console.log('[GoogleOneTap] Disabled in development mode');
      return;
    }

    // Don't initialize if already authenticated, still loading auth state, or already initialized
    if (initialized.current || loading || isAuthenticated) return;

    const init = () => {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: async ({ credential }) => {
          const result = await googleAuth(credential);
          if (result?.success) router.push('/dashboard');
        },
        // Force FedCM to stay ahead of the deprecation
        use_fedcm_for_prompt: true,
        auto_select: true,
        itp_support: true,
      });

      // Added longer delay to ensure the browser is ready for FedCM
      setTimeout(() => {
        window.google.accounts.id.prompt();
      }, 2000);

      initialized.current = true;
    };

    // Use the script loaded by next/script in layout.js
    if (window.google) {
      init();
    } else {
      // Fallback if script isn't ready
      const checkInterval = setInterval(() => {
        if (window.google) {
          init();
          clearInterval(checkInterval);
        }
      }, 500);
      return () => clearInterval(checkInterval);
    }
  }, [googleAuth, router, isAuthenticated, loading]);

  return null;
}