"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { userService } from "@/services/user.service";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function PhoneNumberModal({ isOpen, onPhoneNumberAdded }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { user, checkAuth } = useAuth();

  // Format phone number with +91 prefix
  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");
    
    // If starts with 91, remove it (we'll add +91)
    if (digits.startsWith("91")) {
      return digits.substring(2);
    }
    
    return digits;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const formatted = formatPhoneNumber(value);
    
    // Limit to 10 digits (Indian phone number without country code)
    if (formatted.length <= 10) {
      setPhoneNumber(formatted);
      setError("");
    }
  };

  const validatePhoneNumber = (phone) => {
    // Indian phone number should be 10 digits
    if (phone.length !== 10) {
      return "Phone number must be 10 digits";
    }
    
    // Should not start with 0 or 1
    if (phone.startsWith("0") || phone.startsWith("1")) {
      return "Please enter a valid 10-digit phone number";
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validatePhoneNumber(phoneNumber);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Format phone number with +91 prefix
      const formattedPhone = `+91${phoneNumber}`;
      
      // Update profile with phone number
      const response = await userService.updateProfile({ phone: formattedPhone });
      
      if (response.success) {
        // Store in localStorage to prevent showing popup again
        localStorage.setItem("phoneNumberReceived", "true");
        
        // Refresh user data
        await checkAuth();
        
        toast.success("Phone number added successfully!");
        
        // Call callback to close modal
        if (onPhoneNumberAdded) {
          onPhoneNumberAdded();
        }
      } else {
        throw new Error(response.message || "Failed to update phone number");
      }
    } catch (error) {
      console.error("Error updating phone number:", error);
      setError(error.message || "Failed to update phone number. Please try again.");
      toast.error(error.message || "Failed to update phone number");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPhoneNumber("");
      setError("");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal={true}>
      <DialogContent 
        className="sm:max-w-md"
        showCloseButton={false}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onInteractOutside={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onPointerDownOutside={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 shadow-lg">
            <Phone className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold text-foreground">
            Add Your Phone Number
          </DialogTitle>
          <DialogDescription className="text-center text-base text-muted-foreground">
            We need your phone number to keep you updated about your projects and provide better support.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-muted-foreground text-sm">+91</span>
              </div>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="Enter your 10-digit phone number"
                className={`pl-12 ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                disabled={isSubmitting}
                maxLength={10}
                autoFocus
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Enter your 10-digit mobile number without country code
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              disabled={isSubmitting || phoneNumber.length !== 10}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Save Phone Number
                </>
              )}
            </Button>
          </div>

          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-300">
                This phone number is required to continue. You won't be able to proceed without adding it.
              </p>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
