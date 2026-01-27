// src\components\auth\GoogleOneTapWrapper.js
'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function GoogleOneTapWrapper() {
  const { googleAuth } = useAuth();
  const router = useRouter();
  const initialized = useRef(false);

  useEffect(() => {
    // Skip in development mode - analytics and one-tap are disabled
    if (process.env.NODE_ENV === 'development') {
      console.log('[GoogleOneTapWrapper] Disabled in development mode');
      return;
    }

    if (initialized.current) return;
    
    const initializeGoogleOneTap = () => {
      if (!window.google) {
        return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: async (response) => {
            try {
              const result = await googleAuth(response.credential);
              
              if (result.success) {
                const message = result.isNewUser 
                  ? 'Welcome to Houspire! Your account has been created.' 
                  : 'Welcome back!';
                toast.success(message);
                
                setTimeout(() => {
                  router.push('/dashboard');
                }, 1000);
              } else {
                toast.error(result.message || 'Google sign in failed');
              }
            } catch (error) {
              console.error('Google One Tap error:', error);
              // toast.error('Google authentication failed');
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
          context: 'signin'
        });

        // Only prompt on signin/signup pages
        const pathname = window.location.pathname;
        if (pathname.includes('/auth/signin') || pathname.includes('/auth/signup')) {
          window.google.accounts.id.prompt((notification) => {
          });
        }

        initialized.current = true;
      } catch (error) {
        console.error('Error initializing Google One Tap:', error);
      }
    };

    // Load Google library if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleOneTap;
      document.head.appendChild(script);
    } else {
      initializeGoogleOneTap();
    }

    return () => {
      // Cleanup if needed
      if (window.google) {
        window.google.accounts.id.cancel();
      }
    };
  }, [googleAuth, router]);

  return null;
}