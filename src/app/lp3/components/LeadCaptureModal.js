'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gift, FileText, Palette, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// import { supabase } from '@/integrations/supabase/client';

export const LeadCaptureModal = ({ open, onOpenChange }) => {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { toast } = useToast();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrors({});
    
    try {
      // Phone validation
      if (!phone.trim() || !/^\+?[1-9]\d{9,14}$/.test(phone)) {
        setErrors({ phone: "Please enter a valid phone number with country code (e.g., +911234567890)" });
        return;
      }
      
      setIsLoading(true);

      const { error } = await supabase.auth.signInWithOtp({
        phone: phone,
        options: {
          channel: 'sms',
        }
      });

      if (error) {
        console.error("Error sending OTP:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to send OTP. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "OTP Sent! 📱",
        description: "Check your phone for the verification code.",
      });
      
      setStep("otp");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please check your phone number.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrors({});
    
    try {
      // OTP validation
      if (!otp.trim() || otp.length !== 6 || !/^\d+$/.test(otp)) {
        setErrors({ otp: "OTP must be 6 digits" });
        return;
      }
      
      setIsLoading(true);

      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone,
        token: otp,
        type: 'sms'
      });

      if (error) {
        console.error("Error verifying OTP:", error);
        toast({
          title: "Invalid OTP",
          description: "Please check the code and try again.",
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        // Store discount code and phone
        localStorage.setItem("userPhone", phone);
        localStorage.setItem("discountCode", "HOUSPIRE20");
        localStorage.setItem("discountApplied", "true");
        
        toast({
          title: "Verified! 🎉",
          description: "You've unlocked 20% OFF on all packages!",
        });
        
        onOpenChange(false);
        
        // Reset form
        setPhone("");
        setOtp("");
        setStep("phone");
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Please try again or request a new code.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep("phone");
    setOtp("");
    setErrors({});
  };

  const handleMaybeLater = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="lp3-landing max-w-lg p-0 gap-0 overflow-hidden">
        {/* Hidden Dialog Title for accessibility */}
        <DialogHeader className="sr-only">
          <DialogTitle>Phone Verification</DialogTitle>
          <DialogDescription>
            Verify your phone number to unlock 20% discount on all packages
          </DialogDescription>
        </DialogHeader>

        {/* Promotional Header Banner */}
        <div className="relative bg-gradient-to-r from-[hsl(var(--lp3-primary))] via-[hsl(var(--lp3-primary)/0.9)] to-[hsl(var(--lp3-primary)/0.8)] px-6 py-4 text-[hsl(var(--lp3-primary-foreground))]">
          <div className="flex items-center justify-center gap-2">
            <Gift className="w-5 h-5" />
            <span className="text-lg font-bold">GET 20% OFF</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 p-6">
          {step === "phone" ? (
            <>
              {/* Hero Section */}
              <div className="text-center space-y-3">
                <h2 className="text-2xl md:text-3xl font-bold leading-tight text-[hsl(var(--lp3-foreground))]">
                  Verify Your Phone & Unlock 20% OFF
                </h2>
                <p className="text-[hsl(var(--lp3-muted-foreground))] text-sm">
                  Get instant access to exclusive benefits
                </p>
              </div>

              {/* Benefits Section */}
              <div className="bg-[hsl(var(--lp3-secondary)/0.5)] rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-lg text-center text-[hsl(var(--lp3-foreground))]">
                  What you'll get after verification:
                </h3>
                
                <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
                  <div className="flex items-center gap-1.5 text-[hsl(var(--lp3-primary))] font-medium">
                    <FileText className="w-4 h-4" />
                    <span>Budget templates</span>
                  </div>
                  <span className="text-[hsl(var(--lp3-muted-foreground))]">•</span>
                  <div className="flex items-center gap-1.5 text-[hsl(var(--lp3-primary))] font-medium">
                    <Palette className="w-4 h-4" />
                    <span>Design guides</span>
                  </div>
                  <span className="text-[hsl(var(--lp3-muted-foreground))]">•</span>
                  <div className="flex items-center gap-1.5 text-[hsl(var(--lp3-primary))] font-medium">
                    <Gift className="w-4 h-4" />
                    <span>20% OFF coupon</span>
                  </div>
                </div>

                <div className="bg-[hsl(var(--lp3-success)/0.1)] border border-[hsl(var(--lp3-success)/0.2)] rounded-lg p-4 text-center">
                  <p className="text-sm font-medium text-[hsl(var(--lp3-success))]">
                    <span className="font-bold">Limited time:</span> Save ₹2,000+ on any package
                  </p>
                </div>
              </div>

              {/* Phone Form */}
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+911234567890"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setErrors({ ...errors, phone: undefined });
                    }}
                    className={`h-12 ${errors.phone ? "border-[hsl(var(--lp3-destructive))]" : ""}`}
                    required
                    disabled={isLoading}
                  />
                  {errors.phone && (
                    <p className="text-sm text-[hsl(var(--lp3-destructive))]">{errors.phone}</p>
                  )}
                  <p className="text-xs text-[hsl(var(--lp3-muted-foreground))]">
                    Include country code (e.g., +91 for India)
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-[hsl(var(--lp3-primary))] to-[hsl(var(--lp3-primary)/0.8)] text-[hsl(var(--lp3-primary-foreground))] hover:shadow-lg hover:scale-105 transition-all duration-300" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send Verification Code"
                  )}
                </Button>

                <button
                  type="button"
                  onClick={handleMaybeLater}
                  className="w-full text-sm text-[hsl(var(--lp3-muted-foreground))] hover:text-[hsl(var(--lp3-foreground))] underline transition-colors"
                  disabled={isLoading}
                >
                  Maybe later
                </button>
              </form>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center gap-4 pt-2 text-xs text-[hsl(var(--lp3-muted-foreground))]">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[hsl(var(--lp3-success))]" />
                  <span>Secure verification</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[hsl(var(--lp3-success))]" />
                  <span>No spam</span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* OTP Verification */}
              <div className="space-y-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  disabled={isLoading}
                  className="mb-2 text-[hsl(var(--lp3-primary))] hover:text-[hsl(var(--lp3-primary)/0.8)] hover:bg-[hsl(var(--lp3-primary)/0.1)]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Change number
                </Button>
                
                <h2 className="text-2xl font-bold text-center text-[hsl(var(--lp3-foreground))]">
                  Enter Verification Code
                </h2>
                <p className="text-[hsl(var(--lp3-muted-foreground))] text-sm text-center">
                  We sent a 6-digit code to<br />
                  <span className="font-semibold text-[hsl(var(--lp3-foreground))]">{phone}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                      setErrors({ ...errors, otp: undefined });
                    }}
                    className={`h-12 text-center text-2xl tracking-widest ${errors.otp ? "border-[hsl(var(--lp3-destructive))]" : ""}`}
                    maxLength={6}
                    required
                    disabled={isLoading}
                    autoFocus
                  />
                  {errors.otp && (
                    <p className="text-sm text-[hsl(var(--lp3-destructive))] text-center">{errors.otp}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-[hsl(var(--lp3-primary))] to-[hsl(var(--lp3-primary)/0.8)] text-[hsl(var(--lp3-primary-foreground))] hover:shadow-lg hover:scale-105 transition-all duration-300" 
                  size="lg"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Get 20% OFF"
                  )}
                </Button>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full text-sm text-[hsl(var(--lp3-primary))] hover:text-[hsl(var(--lp3-primary)/0.8)] underline transition-colors"
                  disabled={isLoading}
                >
                  Resend code
                </button>
              </form>

              <div className="flex items-center justify-center gap-2 text-xs text-[hsl(var(--lp3-muted-foreground))]">
                <CheckCircle2 className="w-3 h-3 text-[hsl(var(--lp3-success))]" />
                <span>Code expires in 10 minutes</span>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};