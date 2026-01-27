// src\components\auth\ForgotPasswordForm.js
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Home, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { forgotPasswordSchema } from '@/lib/validations/auth';

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: ''
    }
  });

  const email = watch('email');

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      const result = await forgotPassword(data.email);
      
      if (result.success) {
        setIsSubmitted(true);
        toast.success('Password reset link sent! Check your email.');
      } else {
        setError('root', {
          type: 'manual',
          message: result.message || 'Failed to send reset link'
        });
        toast.error(result.message || 'Failed to send reset link');
      }
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'Failed to send reset link. Please try again.'
      });
      toast.error('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      const result = await forgotPassword(email);
      if (result.success) {
        toast.success('Reset link sent again!');
      } else {
        toast.error(result.message || 'Failed to resend reset link');
      }
    } catch (error) {
      toast.error('Failed to resend reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/auth/signin');
  };

  // Clear errors when user starts typing
  const handleInputChange = () => {
    if (errors.root) {
      clearErrors('root');
    }
  };

  if (isSubmitted) {
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
                  Check your email
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
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

            {/* Success Content */}
            <div className="text-center mb-8">
              <div className="mx-auto w-20 h-20 bg-green-50 dark:bg-green-950/20 rounded-full flex items-center justify-center mb-6 border-2 border-green-200 dark:border-green-800">
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                Check your email
              </h2>
              <p className="text-base text-muted-foreground mb-4">
                We've sent a password reset link to
              </p>
              <div className="font-semibold text-base text-foreground bg-muted py-3 px-4 rounded-lg border border-border mb-6">
                {email}
              </div>
            </div>

            <div className="space-y-6">
              <div className="text-center text-sm text-muted-foreground">
                <p>Didn't receive the email? Check your spam folder or</p>
              </div>
              
              <Button 
                onClick={handleResend}
                variant="outline"
                className="w-full h-12 text-base font-semibold border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Resending...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    <span>Resend reset link</span>
                  </div>
                )}
              </Button>

              {/* Security Note */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <span className="font-semibold">Security Note:</span> The reset link will expire in 1 hour for your security.
                </p>
              </div>

              <div className="text-center">
                <Button 
                  variant="ghost" 
                  onClick={handleBackToLogin}
                  className="text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 font-medium"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to login
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                Reset your password
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Enter your email address and we'll send you a link to reset your password securely.
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
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 border-2 border-primary/20">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2 text-center">
              Reset your password
            </h2>
            <p className="text-base text-muted-foreground text-center">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>
          
          <div className="space-y-6">
            {/* Root Error Display */}
            {errors.root && (
              <div className="p-3 rounded-lg border bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-600 dark:text-red-400" />
                  <p className="text-sm text-red-800 dark:text-red-300">
                    {errors.root.message}
                  </p>
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
                    className={`pl-10 h-12 bg-background border-input text-foreground text-base ${
                      errors.email ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : 'focus:ring-primary/20'
                    }`}
                    disabled={loading}
                    {...register('email', {
                      onChange: () => handleInputChange()
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

              <Button 
                type="submit" 
                size="lg"
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Sending reset link...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    <span>Send reset link</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Info Note */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <span className="font-semibold">Note:</span> You'll receive an email with a link to reset your password. 
                If you don't see it, please check your spam folder.
              </p>
            </div>

            <div className="text-center text-sm pt-6 border-t border-border">
              <span className="text-muted-foreground">Remember your password? </span>
              <Link 
                href="/auth/signin" 
                className="text-primary hover:text-primary/80 hover:underline font-semibold transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}