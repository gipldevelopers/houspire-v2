// src/components/auth/SigninForm.js
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  Home
} from 'lucide-react';
import { userLoginSchema } from '@/lib/validations/auth';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { GoogleSignInButton } from './GoogleSignInButton';
import { AppleSignInButton } from './AppleSignInButton';

export function SigninForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const router = useRouter();
  const { login, googleAuth } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(userLoginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    clearErrors('root');

    try {
      const result = await login(data, false);

      if (result.success) {
        setError('root', {
          type: 'manual',
          message: 'Login successful! Redirecting...',
          variant: 'success'
        });

        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        setError('root', {
          type: 'manual',
          message: result.message
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setError('root', {
        type: 'manual',
        message: 'An unexpected error occurred. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtpFromSignin = async () => {
    const email = watch('email');

    if (!email) {
      toast.error('Please enter your email address first');
      return;
    }

    const emailError = userLoginSchema.shape.email.safeParse(email);
    if (!emailError.success) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/resend-otp', { email });

      if (response.data.success) {
        toast.success('New OTP sent to your email! Redirecting to verification...');
        setTimeout(() => {
          router.push('/auth/verify-otp?email=' + encodeURIComponent(email));
        }, 1500);
      } else {
        toast.error(response.data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider) => {
    setSocialLoading(provider);
    clearErrors('root');

    try {
      if (provider === 'google') {
        const result = await googleAuth('google_token_placeholder');

        if (result.success) {
          setError('root', {
            type: 'manual',
            message: 'Google sign in successful! Redirecting...',
            variant: 'success'
          });
          setTimeout(() => router.push('/dashboard'), 1000);
        } else {
          setError('root', {
            type: 'manual',
            message: result.message || 'Google sign in failed'
          });
        }
      } else if (provider === 'apple') {
        setError('root', {
          type: 'manual',
          message: 'Apple Sign In is not yet available. Please use email or Google sign in.'
        });
      }
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: `${provider} sign in failed. Please try again.`
      });
    } finally {
      setSocialLoading(null);
    }
  };

  const handleOtpLogin = async () => {
    const emailInput = document.querySelector('input[name="email"]');
    const email = emailInput?.value;

    if (!email) {
      setError('email', {
        type: 'manual',
        message: 'Please enter your email address first'
      });
      return;
    }

    const emailError = userLoginSchema.shape.email.safeParse(email);
    if (!emailError.success) {
      setError('email', {
        type: 'manual',
        message: 'Please enter a valid email address'
      });
      return;
    }

    setLoading(true);
    clearErrors('root');

    try {
      const response = await api.post('/auth/resend-otp', { email });

      if (response.data.success) {
        toast.success('OTP sent to your email! Redirecting to verification...');
        setTimeout(() => {
          router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}&login=true`);
        }, 1500);
      } else {
        setError('root', {
          type: 'manual',
          message: response.data.message || 'Failed to send OTP. Please try again.'
        });
      }
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: error.response?.data?.message || 'Failed to send OTP. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => {
    if (errors[field]) {
      clearErrors(field);
    }
    if (errors.root) {
      clearErrors('root');
    }
  };

  const sendMagicLink = async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Magic link sent successfully' });
      }, 1000);
    });
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Branding/Visual Section */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 dark:from-primary/20 dark:via-primary/10 dark:to-accent/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.15) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div>
            <Link href="/" className="inline-flex items-center space-x-2 mb-12 transition-opacity hover:opacity-80">
              <img
                src="/logo_final.svg"
                alt="Houspire"
                className="h-8"
              />
            </Link>
            <div className="max-w-md">
              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
                Welcome back to Houspire
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Transform your space with AI-powered interior design. Sign in to continue your design journey and bring your vision to life.
              </p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Houspire. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Logo & Home Button */}
          <div className="lg:hidden mb-8 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
              <img
                src="/logo_final.svg"
                alt="Houspire"
                className="h-7"
              />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
          </div>

          {/* Desktop Home Button */}
          <div className="hidden lg:flex mb-8 justify-end">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 group"
            >
              <Home className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              <span>Home</span>
            </Link>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              Sign in to your account
            </h2>
            <p className="text-base text-muted-foreground">
              Enter your credentials to access your dashboard
            </p>
          </div>

          <div className="space-y-6">
            {/* Social Sign In Buttons */}
            <div className="grid grid-cols-1 gap-3">
              <GoogleSignInButton
                onSuccess={(user) => {
                  setTimeout(() => router.push('/dashboard'), 1000);
                }}
                onError={(error) => {
                  if (error !== 'Sign in cancelled') {
                    toast.error(error || 'Google sign in failed');
                  }
                }}
              />

              <AppleSignInButton
                onSuccess={(user) => {
                  toast.success('Welcome back! Redirecting...');
                  setTimeout(() => router.push('/dashboard'), 1000);
                }}
                onError={(error) => {
                  if (error !== 'Sign in cancelled') {
                    // toast.error(error || 'Apple sign in failed');
                  }
                }}
              />
            </div>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider">
                <span className="bg-background px-4 text-muted-foreground font-medium">Or continue with email</span>
              </div>
            </div>

            {/* Root Error Display */}
            {errors.root && (
              <div className={`p-3 rounded-lg border ${errors.root.message?.includes('verify your email')
                ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800'
                : errors.root.variant === 'success'
                  ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800'
                  : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
                }`}>
                <div className={`flex items-center ${errors.root.message?.includes('verify your email')
                  ? 'justify-between'
                  : 'justify-start gap-2'
                  }`}>
                  <div className="flex items-start gap-2">
                    <AlertCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${errors.root.message?.includes('verify your email')
                      ? 'text-blue-600 dark:text-blue-400'
                      : errors.root.variant === 'success'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                      }`} />
                    <p className={`text-sm ${errors.root.message?.includes('verify your email')
                      ? 'text-blue-800 dark:text-blue-300'
                      : errors.root.variant === 'success'
                        ? 'text-green-800 dark:text-green-300'
                        : 'text-red-800 dark:text-red-300'
                      }`}>
                      {errors.root.message}
                    </p>
                  </div>

                  {errors.root.message?.includes('verify your email') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResendOtpFromSignin}
                      disabled={loading}
                      className="text-blue-600 border-blue-300 hover:bg-blue-100 dark:text-blue-400 dark:border-blue-600 dark:hover:bg-blue-900/30 whitespace-nowrap"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </div>
                      ) : (
                        'Resend OTP'
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                  Email Address
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className={`pl-10 h-12 bg-background border-input text-foreground text-base ${errors.email ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : 'focus:ring-primary/20'
                      }`}
                    disabled={loading}
                    {...register('email', {
                      onChange: () => handleInputChange('email')
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-destructive text-xs flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                  Password
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className={`pl-10 pr-10 h-12 bg-background border-input text-foreground text-base ${errors.password ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : 'focus:ring-primary/20'
                      }`}
                    disabled={loading}
                    {...register('password', {
                      onChange: () => handleInputChange('password')
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-xs flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end text-sm pt-1">
                <Link
                  href="/auth/forgot-password"
                  className="text-primary hover:text-primary/80 hover:underline transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Sign In</span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </Button>
            </form>

            {/* Login without password Option */}
            <div className="text-center pt-2">
              <Button
                variant="ghost"
                onClick={handleOtpLogin}
                className="w-full text-primary hover:text-primary/90 hover:bg-primary/10 transition-all duration-200"
                disabled={loading}
              >
                <Mail className="h-4 w-4 mr-2" />
                Login without password
              </Button>
            </div>

            <div className="text-center text-sm pt-6 border-t border-border">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link href="/auth/signup" className="text-primary hover:text-primary/80 hover:underline font-semibold transition-colors">
                Sign up
              </Link>
            </div>

            {/* Privacy Policy Link */}
            <div className="text-center pt-4">
              <Link
                href="/legal/privacy"
                className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SigninForm;