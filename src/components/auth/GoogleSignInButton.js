// src/components/auth/GoogleSignInButton.js
'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function GoogleSignInButton({ 
  variant = 'outline', 
  size = 'default', 
  className = '',
  onSuccess,
  onError
}) {
  const { googleAuth } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      // Use Google Identity Services directly
      if (!window.google) {
        const errorMsg = 'Google sign in not available. Please refresh the page.';
        toast.error(errorMsg);
        if (onError) onError(errorMsg);
        setLoading(false);
        return;
      }

      window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        scope: 'email profile openid',
        callback: async (tokenResponse) => {
          try {
            if (tokenResponse && tokenResponse.access_token) {
              const result = await googleAuth(tokenResponse.access_token);
              
              if (result.success) {
                const message = result.isNewUser 
                  ? 'Welcome to Houspire! Your account has been created.' 
                  : 'Welcome back!';
                toast.success(message);
                
                // ✅ CALL SUCCESS CALLBACK IF PROVIDED (for popup wizard)
                if (onSuccess) {
                  onSuccess(result.user);
                } else {
                  // ✅ DEFAULT BEHAVIOR (for main signup)
                  setTimeout(() => {
                    router.push('/dashboard');
                  }, 1000);
                }
              } else {
                const errorMsg = result.message || 'Google sign in failed';
                toast.error(errorMsg);
                if (onError) onError(errorMsg);
              }
            } else {
              const errorMsg = 'Google authentication failed';
              toast.error(errorMsg);
              if (onError) onError(errorMsg);
            }
          } catch (error) {
            console.error('Google login error:', error);
            const errorMsg = 'Google authentication failed';
            toast.error(errorMsg);
            if (onError) onError(errorMsg);
          } finally {
            setLoading(false);
          }
        },
        error_callback: (error) => {
          console.error('Google OAuth error:', error);
          setLoading(false);
          if (error.type === 'user_logged_out' || error.type === 'popup_closed_by_user') {
            // User closed the popup or logged out, no need to show error
            if (onError) onError('Sign in cancelled');
            return;
          }
          const errorMsg = 'Google sign in failed. Please try again.';
          toast.error(errorMsg);
          if (onError) onError(errorMsg);
        }
      }).requestAccessToken();
      
    } catch (error) {
      console.error('Google login initialization error:', error);
      setLoading(false);
      const errorMsg = 'Google sign in failed. Please try again.';
      toast.error(errorMsg);
      if (onError) onError(errorMsg);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleGoogleLogin}
      disabled={loading}
      className={`w-full flex items-center cursor-pointer justify-center gap-3 h-11 border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-all duration-200 hover:shadow-lg ${className}`}
      type="button"
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          {/* Google Logo SVG */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </>
      )}
    </Button>
  );
}