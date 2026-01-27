// src/components/auth/SignupForm.js
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, AlertCircle, Loader2, Home } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { userSignupSchema } from '@/lib/validations/auth';
import { GoogleSignInButton } from './GoogleSignInButton';
import { AppleSignInButton } from './AppleSignInButton';

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  
  const { signup, googleAuth, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(userSignupSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  const onSubmit = async (data) => {
    clearErrors('root');
    
    try {
      const result = await signup({
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        password: data.password
      });
      
      if (result.success) {
        if (result.data.requiresVerification) {
          if (result.data.isExistingUser) {
            toast.success('We\'ve sent a new verification code to your email.');
          } else {
            toast.success('Account created! Please check your email for the verification OTP.');
          }
          router.push('/auth/verify-otp?email=' + encodeURIComponent(data.email));
        } else {
          toast.success('Account created successfully!');
          router.push('/dashboard/projects/new');
        }
      } else {
        setError('root', { 
          type: 'manual', 
          message: result.message || 'Signup failed. Please try again.' 
        });
      }
    } catch (error) {
      setError('root', { 
        type: 'manual', 
        message: 'Signup failed. Please try again.' 
      });
      console.error('Signup error:', error);
    }
  };

  const handleSocialSignIn = async (provider) => {
    setSocialLoading(provider);
    clearErrors('root');
    
    try {
      if (provider === 'google') {
        const mockGoogleToken = 'mock_google_token_' + Date.now();
        const result = await googleAuth(mockGoogleToken);
        
        if (result.success) {
          toast.success('Google sign in successful!');
        } else {
          toast.error(result.message || 'Google sign in failed');
        }
      } else if (provider === 'apple') {
        setTimeout(() => {
          setSocialLoading(null);
          toast.info('Apple Sign In would be implemented here');
        }, 1000);
      }
    } catch (error) {
      toast.error(`${provider} sign in failed`);
      setSocialLoading(null);
    }
  };

  const handleMagicLink = async () => {
    if (!watchedValues.email) {
      setError('email', { message: 'Email is required to send magic link' });
      return;
    }
    
    const emailResult = userSignupSchema.shape.email.safeParse(watchedValues.email);
    if (!emailResult.success) {
      setError('email', { message: 'Please enter a valid email address' });
      return;
    }

    toast.info('Magic link feature would be implemented here');
  };

  if (authLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
                Join Houspire today
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Start your interior design journey with AI-powered solutions. Create beautiful spaces that reflect your style and vision.
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
              Create your account
            </h2>
            <p className="text-base text-muted-foreground">
              Get started with your free account today
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

            {/* Social Sign In Buttons */}
            <div className="grid grid-cols-1 gap-3">
              <GoogleSignInButton 
                onSuccess={(user) => {
                  const message = user.isNewUser 
                    ? 'Welcome to Houspire! Your account has been created.' 
                    : 'Welcome back!';
                  toast.success(message);
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
                  const message = user.isNewUser 
                    ? 'Welcome to Houspire! Your account has been created.' 
                    : 'Welcome back!';
                  toast.success(message);
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2.5">
                <Label htmlFor="name" className="text-sm font-semibold text-foreground">
                  Full Name
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className={`pl-10 h-12 bg-background border-input text-foreground text-base ${
                      errors.name ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : 'focus:ring-primary/20'
                    }`}
                    disabled={isSubmitting}
                    {...register('name')}
                  />
                </div>
                {errors.name && (
                  <p className="text-destructive text-xs flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    {errors.name.message}
                  </p>
                )}
              </div>

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
                    disabled={isSubmitting}
                    {...register('email')}
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
                <Label htmlFor="phone" className="text-sm font-semibold text-foreground">
                  Phone Number
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    className={`pl-10 h-12 bg-background border-input text-foreground text-base ${
                      errors.phone ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : 'focus:ring-primary/20'
                    }`}
                    disabled={isSubmitting}
                    {...register('phone')}
                  />
                </div>
                {errors.phone && (
                  <p className="text-destructive text-xs flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    {errors.phone.message}
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
                    placeholder="Create a strong password"
                    className={`pl-10 pr-10 h-12 bg-background border-input text-foreground text-base ${
                      errors.password ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : 'focus:ring-primary/20'
                    }`}
                    disabled={isSubmitting}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
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

              <div className="space-y-2.5">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground">
                  Confirm Password
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className={`pl-10 pr-10 h-12 bg-background border-input text-foreground text-base ${
                      errors.confirmPassword ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : 'focus:ring-primary/20'
                    }`}
                    disabled={isSubmitting}
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-destructive text-xs flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="flex items-start space-x-3 pt-2">
                <Checkbox
                  id="terms"
                  checked={watch('terms')}
                  onCheckedChange={(checked) => {
                    setValue('terms', checked === true, { shouldValidate: true });
                  }}
                  disabled={isSubmitting}
                  className="mt-0.5"
                />
                <div className="grid gap-1.5 leading-none flex-1">
                  <label
                    htmlFor="terms"
                    className="text-sm leading-relaxed text-foreground cursor-pointer"
                  >
                    I agree to the{' '}
                    <Link href="/legal/terms" className="text-primary hover:text-primary/80 hover:underline font-medium">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/legal/privacy" className="text-primary hover:text-primary/80 hover:underline font-medium">
                      Privacy Policy
                    </Link>
                  </label>
                  {errors.terms && (
                    <p className="text-destructive text-xs flex items-center gap-1.5 mt-1">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      {errors.terms.message}
                    </p>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                size="lg"
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Create Account</span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center text-sm pt-6 border-t border-border">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/auth/signin" className="text-primary hover:text-primary/80 hover:underline font-semibold transition-colors">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;