// src\app\auth\verify-otp\page.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, ArrowRight, RefreshCw, AlertCircle, Home, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const router = useRouter();
  const { user, verifyOtp } = useAuth();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef([]);

  // Redirect if already verified
  useEffect(() => {
    if (user?.isActive) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    // If user comes directly to OTP page without email, check if there's a pending verification
    if (!email) {
      const pendingEmail = localStorage.getItem('pendingVerificationEmail');
    }
  }, [email]);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedOtp = pastedData.slice(0, 6).split('');

    if (pastedOtp.every(char => /^\d?$/.test(char))) {
      const newOtp = [...otp];
      pastedOtp.forEach((char, index) => {
        if (index < 6) newOtp[index] = char;
      });
      setOtp(newOtp);

      // Focus last filled input
      const lastFilledIndex = pastedOtp.findIndex(char => !char) - 1;
      const focusIndex = lastFilledIndex >= 0 ? lastFilledIndex : Math.min(5, pastedOtp.length - 1);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const result = await verifyOtp(email, otpString);

      if (result.success) {
        const isLogin = searchParams.get('login') === 'true';

        if (isLogin) {
          toast.success('Signed in successfully! Redirecting to dashboard...');
          setTimeout(() => {
            router.push('/dashboard');
          }, 500);
        } else {
          toast.success('Email verified successfully! Redirecting to create your first project...');
          setTimeout(() => {
            router.push('/dashboard/projects/new');
          }, 500);
        }

      } else {
        toast.error(result.message || 'OTP verification failed');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0].focus();
      }
    } catch (error) {
      toast.error('OTP verification failed. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);

    try {
      const response = await api.post('/auth/resend-otp', {
        email
      });

      if (response.data.success) {
        toast.success('New OTP sent to your email!');
        setCountdown(30);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0].focus();
      } else {
        toast.error(response.data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  if (!email) {
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
                  Invalid Verification Session
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Please sign up again to receive a new verification email.
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
                Invalid Verification Session
              </h2>
              <p className="text-base text-muted-foreground mb-6">
                Please sign up again to receive a new verification email.
              </p>
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <span>Go to Sign Up</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
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
                Verify Your Email
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We've sent a 6-digit verification code to your email address. Please enter it below to complete your registration.
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
          <div className="mb-8 text-center">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 border-2 border-primary/20">
              <Mail className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              {searchParams.get('login') === 'true' ? 'Sign In with OTP' : 'Verify Your Email'}
            </h2>
            <p className="text-base text-muted-foreground mb-4">
              {searchParams.get('login') === 'true'
                ? "We've sent a 6-digit sign-in code to"
                : "We've sent a 6-digit verification code to"
              }
            </p>
            <div className="font-semibold text-base text-foreground bg-muted py-3 px-4 rounded-lg border border-border">
              {email}
            </div>
          </div>

          <div className="space-y-6">
            {/* OTP Input Section */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-foreground block text-center">
                Enter verification code
              </label>
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-14 h-14 text-center text-2xl font-bold text-foreground border-2 border-primary focus:border-primary focus:ring-2 focus:ring-primary/30 rounded-xl bg-background transition-all duration-200"
                    disabled={loading}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Tip: You can paste the entire 6-digit code
              </p>
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerifyOtp}
              disabled={loading || otp.join('').length !== 6}
              size="lg"
              className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Verify Email</span>
                </div>
              )}
            </Button>

            {/* Resend OTP Section */}
            <div className="text-center p-4 bg-muted rounded-xl border border-border">
              <p className="text-sm font-medium text-muted-foreground mb-3">
                Didn't receive the code?
              </p>
              <Button
                variant="outline"
                onClick={handleResendOtp}
                disabled={resending || countdown > 0}
                className="w-full h-12 text-base font-semibold border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                {resending ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : countdown > 0 ? (
                  <span className="font-semibold">
                    Resend OTP in {countdown}s
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    <span>Resend OTP</span>
                  </div>
                )}
              </Button>

              {countdown > 0 && (
                <div className="mt-3">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(countdown / 30) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Note Section */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <span className="font-semibold">Note:</span> Check your spam folder if you don't see the email.
                OTP is valid for 10 minutes.
              </p>
            </div>

            {/* Back to Sign In */}
            <div className="pt-6 border-t border-border">
              <Link href="/auth/signin">
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 font-medium"
                >
                  <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}