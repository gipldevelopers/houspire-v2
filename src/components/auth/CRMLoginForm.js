'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Users, 
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { adminLoginSchema } from '@/lib/validations/auth';
import { useAuth } from '@/context/AuthContext';

export default function CRMLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(adminLoginSchema),
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
      // Use the generic login function, but pass isAdmin=true so it hits the admin endpoint
      // The backend should authenticate CRM_ADMIN role safely on this endpoint.
      const result = await login(data, true);
      
      if (result.success) {
        setError('root', {
          type: 'manual',
          message: 'CRM login successful! Redirecting...',
          variant: 'success'
        });
        
        // Wait a moment for cookie to be set and middleware to not intercept
        setTimeout(() => {
          router.push('/crm');
        }, 1000);
      } else {
        setError('root', {
          type: 'manual',
          message: result.message
        });
      }
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'An unexpected error occurred. Please try again later.'
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-background dark:to-muted/20">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="shadow-elegant border-0 bg-card/95 backdrop-blur">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold">CRM Portal</CardTitle>
              <CardDescription>
                Sign in to manage customers and projects
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {errors.root && (
              <div className={`p-3 rounded-lg border ${
                errors.root.variant === 'success' 
                  ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
              }`}>
                <div className={`flex items-center gap-2 ${
                  errors.root.variant === 'success' 
                    ? 'text-green-700 dark:text-green-300' 
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  {errors.root.variant === 'success' ? (
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  )}
                  <p className="text-sm font-medium">
                    {errors.root.variant === 'success' ? 'Success' : 'Error'}
                  </p>
                </div>
                <p className={`text-sm mt-1 ml-6 ${
                  errors.root.variant === 'success' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {errors.root.message}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  CRM Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="crm@houspire.com"
                    className={`pl-10 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                    disabled={loading}
                    {...register('email', {
                      onChange: () => handleInputChange('email')
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                    disabled={loading}
                    {...register('password', {
                      onChange: () => handleInputChange('password')
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link 
                  href="/auth/forgot-password" 
                  className="text-orange-600 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Sign In to CRM
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center">
              <Link 
                href="/auth/signin" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ← Back to User Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
