// src/app/lp3/components/wizard/Step4.js
'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, AlertCircle, CheckCircle2, RefreshCw, Badge, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { userSignupSchema } from "@/lib/validations/auth";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
const FORM_STORAGE_KEY = 'houspire_wizard_form_data';

export const Step4 = ({ 
  formData, 
  onUpdate, 
  onNext, 
  onOtpVerificationStart,
  onOtpVerificationComplete,
  onOtpVerificationBack,
  isInPopup = false,
  isOtpVerification = false,
  selectedPackage = null,
  isCreatingProject = false,
  onClose,
  setIsCreatingProject
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  
  const { signup, verifyOtp, loading: authLoading } = useAuth();
  const router = useRouter();

  // Initialize OTP step based on parent state
  useEffect(() => {
    if (isOtpVerification) {
      setOtpStep(true);
    }
  }, [isOtpVerification]);

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    watch,
    setValue,
    trigger,
  } = useForm({
    resolver: zodResolver(userSignupSchema),
    mode: 'onChange',
    defaultValues: {
      name: formData.name || '',
      email: formData.email || '',
      phone: formData.phone || '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Update parent form data when values change
  useEffect(() => {
    const subscription = watch((value) => {
      onUpdate(value);
    });
    return () => subscription.unsubscribe();
  }, [watch, onUpdate]);

  // Handle successful Google sign-in
  const handleGoogleSuccess = async (userData) => {    
    if (isInPopup) {
      if (selectedPackage === 499) {
        // For ₹499 plan, create project and redirect to packages
        await handle499PlanAfterAuth(userData);
      } else {
        // Save wizard data to localStorage for popup users
        const wizardData = {
          propertyType: formData.propertyType,
          title: formData.title,
          description: formData.description,
          address: formData.address || '',
          city: formData.city,
          pincode: formData.pincode,
          areaSqFt: formData.areaSqFt,
          budgetRange: formData.budgetRange,
          timeline: formData.timeline
        };
        
        localStorage.setItem('pendingProject', JSON.stringify(wizardData));
        
        toast.success('Welcome! Redirecting to complete your project...');
        
        // Redirect to project creation page
        setTimeout(() => {
          router.push('/dashboard/projects/new');
        }, 1000);
      }
    } else {
      // Regular flow - proceed to next step
      toast.success('Google sign in successful!');
      onNext();
    }
  };

const handle499PlanAfterAuth = async (userData) => {
    if (setIsCreatingProject) {
      setIsCreatingProject(true);
    }
    
    try {
      const projectService = (await import('@/services/project.service')).projectService;
      const uploadService = (await import('@/services/upload.service')).uploadService;

      // Create project first
      const projectData = {
        title: formData.title || 'Single Room Design',
        description: 'Single room design project',
        projectType: 'CUSTOM',
        address: formData.address || '',
        city: formData.city || '',
        pincode: formData.pincode || null,
        country: 'India',
        areaSqFt: null,
        selectedStyleId: null,
      };

      const projectResponse = await projectService.createProject(projectData);

      if (projectResponse.success) {
        const projectId = projectResponse.data.project.id;
        
        // If user uploaded an image, move it from temporary to permanent
        if (formData.uploadedImage && formData.uploadedImage.temporaryId) {

          const moveResponse = await uploadService.moveTemporaryFile(
            formData.uploadedImage.temporaryId, 
            projectId, 
            formData.uploadedImage.fileName,
            'LIVING_ROOM'
          );

          if (moveResponse.success) {
            formData.uploadedImage.url = moveResponse.data.permanentUrl;
          } else {
            console.warn('⚠️ Failed to move temporary image:', moveResponse.message);
          }
        }
        
        // Save project ID and package info for packages page
        const packageSelection = {
          projectId: projectId,
          packageType: '499',
          formData: {
            title: formData.title,
            address: formData.address,
            city: formData.city,
            pincode: formData.pincode,
            uploadedImage: formData.uploadedImage
          },
          timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('packageSelection', JSON.stringify(packageSelection));
        
        // Clear wizard data
        localStorage.removeItem(FORM_STORAGE_KEY);
        
        // Close the popup using the prop
        if (onClose) {
          onClose();
        }
        
        toast.success('Project created successfully! Redirecting to payment...');
        
        // Redirect to packages page for ₹499 only
        setTimeout(() => {
          router.push(`/packages?type=499-only&projectId=${projectId}`);
        }, 500);
        
      } else {
        throw new Error(projectResponse.message || 'Failed to create project');
      }
      
    } catch (error) {
      console.error('Error creating project for ₹499:', error);
      toast.error('Failed to create project. Please try again.');
    } finally {
      // Reset creating state
      if (setIsCreatingProject) {
        setIsCreatingProject(false);
      }
    }
  };
   

  // Handle Google sign-in error
  const handleGoogleError = (error) => {
    console.error('Google sign-in error:', error);
    toast.error(error || 'Google sign in failed. Please try again.');
  };

  // Handle form submission
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
          setUserEmail(data.email);
          setOtpStep(true);
          // Notify parent about OTP verification start
          if (onOtpVerificationStart) {
            onOtpVerificationStart();
          }
          if (result.data.isExistingUser) {
            toast.success('We\'ve sent a new verification code to your email.');
          } else {
            toast.success('Account created! Please check your email for the verification OTP.');
          }
        } else {
          toast.success('Account created successfully!');
          
          if (isInPopup) {
            if (selectedPackage === 499) {
              // For ₹499 plan, create project and redirect to packages
              await handle499PlanAfterAuth(data);
            } else {
              // For other packages, save data and redirect to project creation
              const wizardData = {
                propertyType: formData.propertyType,
                title: formData.title,
                description: formData.description,
                address: formData.address || '',
                city: formData.city,
                pincode: formData.pincode,
                areaSqFt: formData.areaSqFt,
                budgetRange: formData.budgetRange,
                timeline: formData.timeline
              };
              
              localStorage.setItem('pendingProject', JSON.stringify(wizardData));
              
              setTimeout(() => {
                router.push('/dashboard/projects/new');
              }, 1000);
            }
          } else {
            // Regular flow
            onNext();
          }
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

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setOtpLoading(true);
    
    try {
      const result = await verifyOtp(userEmail, otpString);

      if (result.success) {
        toast.success('Email verified successfully!');
        
        // Notify parent about OTP verification completion
        if (onOtpVerificationComplete) {
          onOtpVerificationComplete();
        }
        
        if (isInPopup && selectedPackage === 499) {
          // For ₹499 plan, create project and redirect to packages
          await handle499PlanAfterAuth({ email: userEmail });
        } else if (isInPopup) {
          // For other packages in popup
          const wizardData = {
            propertyType: formData.propertyType,
            title: formData.title,
            description: formData.description,
            address: formData.address || '',
            city: formData.city,
            pincode: formData.pincode,
            areaSqFt: formData.areaSqFt,
            budgetRange: formData.budgetRange,
            timeline: formData.timeline
          };
          
          localStorage.setItem('pendingProject', JSON.stringify(wizardData));
          
          setTimeout(() => {
            router.push('/dashboard/projects/new');
          }, 1000);
        } else {
          // Regular flow
          setTimeout(() => {
            onNext();
          }, 1000);
        }
      } else {
        toast.error(result.message || 'OTP verification failed');
        setOtp(['', '', '', '', '', '']);
      }
    } catch (error) {
      toast.error('OTP verification failed. Please try again.');
      setOtp(['', '', '', '', '', '']);
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle OTP resend
  const handleResendOtp = async () => {
    setResending(true);
    
    try {
      // Simulate OTP resend - you'll need to implement this in your AuthContext
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (response.ok) {
        toast.success('New OTP sent to your email!');
        setCountdown(30);
        setOtp(['', '', '', '', '', '']);
      } else {
        toast.error('Failed to resend OTP');
      }
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  // Handle back from OTP verification
  const handleBackFromOtp = () => {
    setOtpStep(false);
    setOtp(['', '', '', '', '', '']);
    if (onOtpVerificationBack) {
      onOtpVerificationBack();
    }
  };

  // OTP Verification UI
  if (otpStep) {
    return (
      <div className="animate-fade-in max-h-[calc(85vh-200px)] overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#e48b53]/10 rounded-2xl flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6 text-[#e48b53]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#042939]">
              Verify Your Email
            </h2>
            <p className="text-[#042939] text-sm">
              We've sent a 6-digit verification code to
            </p>
            <p className="font-semibold text-[#042939]">{userEmail}</p>
            {selectedPackage === 499 && (
              <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
                ₹499 Single Room Plan
              </Badge>
            )}
          </div>

          {/* OTP Input */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-[#042939] text-center block">
              Enter verification code
            </label>
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-xl font-semibold border-[#e48b53]/30 focus:border-[#e48b53]"
                  disabled={otpLoading}
                />
              ))}
            </div>
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerifyOtp}
            disabled={otpLoading || otp.join('').length !== 6}
            className="w-full h-10 bg-[#e48b53] hover:bg-[#d47b43] text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {otpLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
                {selectedPackage === 499 ? 'Verify & Continue' : 'Verify Email'}
              </>
            )}
          </Button>

          {/* Resend OTP */}
          <div className="text-center">
            <p className="text-sm text-[#042939] mb-2">
              Didn't receive the code?
            </p>
            <Button
              variant="outline"
              onClick={handleResendOtp}
              disabled={resending || countdown > 0}
              className="w-full h-8 text-[#e48b53] border-[#e48b53]/30 hover:bg-[#e48b53]/5"
            >
              {resending ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : countdown > 0 ? (
                `Resend OTP in ${countdown}s`
              ) : (
                <>
                  <RefreshCw className="h-3.5 w-3.5 mr-2" />
                  Resend OTP
                </>
              )}
            </Button>
          </div>

          {/* Back to Signup */}
          <div className="text-center pt-2 border-t border-gray-200">
            <Button 
              variant="ghost" 
              onClick={handleBackFromOtp}
              className="text-[#e48b53] hover:text-[#d47b43] hover:bg-[#e48b53]/5 text-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Back to Sign Up
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Signup Form UI
  return (
    <div className="animate-fade-in max-h-[calc(85vh-200px)] overflow-y-auto">
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#e48b53]/10 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6 text-[#e48b53]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#042939]">
            Create Your Account
          </h2>
          <p className="text-[#042939] text-sm">
            {selectedPackage === 499 
              ? 'Complete your account to start your single room design' 
              : isInPopup 
              ? 'Complete your account to continue with your project' 
              : 'Join thousands of homeowners transforming their spaces'
            }
          </p>
          {selectedPackage === 499 && (
            <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-sm">
              ₹499 Single Room Plan • Quick Design
            </Badge>
          )}
        </div>

        {/* Creating Project Loader */}
        {isCreatingProject && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <div>
                <p className="text-blue-800 font-medium">Creating your project...</p>
                <p className="text-blue-700 text-sm">Setting up your single room design</p>
              </div>
            </div>
          </div>
        )}

        {/* Server Error Message */}
        {errors.root && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-red-700 text-sm">{errors.root.message}</p>
          </div>
        )}

        {/* Social Sign In Buttons */}
        <div className="grid grid-cols-1 gap-3">
          <GoogleSignInButton 
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            className="h-10 text-sm"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-gray-500">Or continue with email</span>
          </div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Name Field */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-[#042939]">
                Full Name *
              </Label>
              <div className="relative">
                <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Full name"
                  className={`h-9 pl-9 text-sm ${
                    errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
                  }`}
                  {...register('name')}
                />
              </div>
              {errors.name && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-[#042939]">
                Email *
              </Label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  className={`h-9 pl-9 text-sm ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
                  }`}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Phone Field */}
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs font-semibold text-[#042939]">
              Phone (Optional)
            </Label>
            <div className="relative">
              <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="Phone number"
                className={`h-9 pl-9 text-sm ${
                  errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
                }`}
                {...register('phone')}
              />
            </div>
            {errors.phone && (
              <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-[#042939]">
                Password *
              </Label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className={`h-9 pl-9 pr-9 text-sm ${
                    errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
                  }`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-semibold text-[#042939]">
                Confirm Password *
              </Label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  className={`h-9 pl-9 pr-9 text-sm ${
                    errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
                  }`}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-2 pt-1">
            <Checkbox
              id="terms"
              checked={watch('terms')}
              onCheckedChange={(checked) => {
                setValue('terms', checked === true, { shouldValidate: true });
              }}
              className="mt-0.5"
            />
            <div className="space-y-0.5">
              <Label
                htmlFor="terms"
                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{' '}
                <a href="/terms" className="text-[#e48b53] hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-[#e48b53] hover:underline">
                  Privacy Policy
                </a>
              </Label>
              {errors.terms && (
                <p className="text-red-600 text-xs flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.terms.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full h-10 bg-[#e48b53] hover:bg-[#d47b43] text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
            disabled={isSubmitting || isCreatingProject}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Account...
              </div>
            ) : isCreatingProject ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Setting Up...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {selectedPackage === 499 ? 'Start Single Room Design' : 'Sign Up'}
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            )}
          </Button>
        </form>

        {/* Magic Link Option */}
        <div className="text-center pt-2">
          <Button 
            variant="ghost" 
            onClick={() => toast.info('Magic link feature would be implemented here')}
            className="w-full h-8 text-[#e48b53] hover:text-[#d47b43] hover:bg-[#e48b53]/5 text-xs transition-all duration-200"
            disabled={isSubmitting || isCreatingProject}
          >
            <Mail className="h-3.5 w-3.5 mr-1.5" />
            Send Magic Link Instead
          </Button>
        </div>

        {/* Sign In Link */}
        <div className="text-center text-xs pt-2 border-t border-gray-200">
          <span className="text-gray-600">Already have an account? </span>
          <a
            href="/auth/signin"
            className="text-[#e48b53] hover:underline font-medium"
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};