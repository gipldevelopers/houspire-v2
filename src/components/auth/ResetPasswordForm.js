// src\components\auth\ResetPasswordForm.js
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff, Check, X, Home, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { resetPasswordSchema } from '@/lib/validations/auth';

export function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState('');
  const { resetPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    setError,
    clearErrors,
    trigger
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  });

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    } else {
      toast.error('Invalid or missing reset token');
      router.push('/auth/forgot-password');
    }
  }, [searchParams, router]);

  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Invalid reset token');
      return;
    }

    const isValid = await trigger();
    if (!isValid) {
      toast.error('Please fix the validation errors before submitting');
      return;
    }

    clearErrors('root');
    setLoading(true);
    
    try {
      const result = await resetPassword({
        token,
        newPassword: data.newPassword
      });
      
      if (result.success) {
        setIsSuccess(true);
        toast.success('Password reset successfully!');
        
        setTimeout(() => {
          router.push('/auth/signin');
        }, 3000);
      } else {
        setError('root', {
          type: 'manual',
          message: result.message || 'Failed to reset password'
        });
        toast.error(result.message || 'Failed to reset password');
      }
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'Failed to reset password. Please try again.'
      });
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/auth/signin');
  };

  if (!token) {
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
                  Invalid Reset Link
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  This reset link is invalid or has expired. Please request a new password reset link.
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

            {/* Error Content */}
            <div className="text-center mb-8">
              <div className="mx-auto w-20 h-20 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center mb-6 border-2 border-red-200 dark:border-red-800">
                <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                Invalid Reset Link
              </h2>
              <p className="text-base text-muted-foreground mb-6">
                This reset link is invalid or has expired. Please request a new one.
                </p>
                <Button 
                  onClick={handleBackToLogin} 
                size="lg"
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200"
                >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span>Back to Login</span>
                </Button>
              </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
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
                  Password Reset Successfully!
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Your password has been updated successfully. You can now sign in with your new password.
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
                Password Reset Successfully!
              </h2>
              <p className="text-base text-muted-foreground mb-4">
                Your password has been updated successfully.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Redirecting you to login page in a few seconds...
              </p>
              </div>
              
            <div className="space-y-6">
              {/* Security Success Note */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <span className="font-semibold">Security Updated:</span> Your password has been changed successfully. 
                  For security, you'll need to sign in with your new password.
                </p>
              </div>
              
              <Button 
                onClick={handleBackToLogin}
                size="lg"
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span>Go to Login</span>
              </Button>
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
                Create new password
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Enter a strong, secure password to protect your account. Make sure it's unique and memorable.
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
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2 text-center">
              Create new password
            </h2>
            <p className="text-base text-muted-foreground text-center">
              Enter your new password below
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
              {/* New Password */}
              <div className="space-y-2.5">
                <Label htmlFor="newPassword" className="text-sm font-semibold text-foreground">
                  New Password
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className={`pl-10 pr-10 h-12 bg-background border-input text-foreground text-base ${
                      errors.newPassword 
                        ? 'border-destructive focus:border-destructive focus:ring-destructive/20' 
                        : 'focus:ring-primary/20'
                    }`}
                    disabled={loading}
                    {...register('newPassword')}
                  />
                  <button
                    type="button"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-destructive text-xs flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Password Requirements - Visual indicators only */}
              {newPassword && (
                <div className="space-y-2 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">Password requirements:</p>
                  <div className="space-y-1.5 text-xs">
                    <div className={`flex items-center gap-2 ${newPassword.length >= 6 ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                      {newPassword.length >= 6 ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                      At least 6 characters
                    </div>
                    <div className={`flex items-center gap-2 ${/[A-Z]/.test(newPassword) ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                      {/[A-Z]/.test(newPassword) ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                      One uppercase letter
                    </div>
                    <div className={`flex items-center gap-2 ${/[a-z]/.test(newPassword) ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                      {/[a-z]/.test(newPassword) ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                      One lowercase letter
                    </div>
                    <div className={`flex items-center gap-2 ${/\d/.test(newPassword) ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                      {/\d/.test(newPassword) ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                      One number
                    </div>
                  </div>
                </div>
              )}

              {/* Confirm Password */}
              <div className="space-y-2.5">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground">
                  Confirm New Password
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className={`pl-10 pr-10 h-12 bg-background border-input text-foreground text-base ${
                      errors.confirmPassword 
                        ? 'border-destructive focus:border-destructive focus:ring-destructive/20' 
                        : 'focus:ring-primary/20'
                    }`}
                    disabled={loading}
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-destructive text-xs flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    {errors.confirmPassword.message}
                  </p>
                )}
                
                {/* Visual match indicator */}
                {confirmPassword && newPassword && (
                  <div className={`text-xs flex items-center gap-1.5 font-medium mt-1.5 ${
                    newPassword === confirmPassword 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-destructive'
                  }`}>
                    {newPassword === confirmPassword ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Passwords match
                      </>
                    ) : (
                      <>
                        <X className="h-3.5 w-3.5" />
                        Passwords do not match
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Security Note */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <span className="font-semibold">Security Tip:</span> Use a strong, unique password that you don't use elsewhere.
                </p>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                size="lg"
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Resetting password...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    <span>Reset Password</span>
                  </div>
                )}
              </Button>
            </form>

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