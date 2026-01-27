// src/components/payment/GSTDetailsForm.js
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Check, 
  X, 
  AlertCircle, 
  Loader2,
  FileText,
  IndianRupee
} from "lucide-react";
import { toast } from "sonner";
import { gstService } from "@/services/gst.service";

const GSTDetailsForm = ({ 
  onGSTDetailsChange, 
  initialData = null,
  showInCheckout = false 
}) => {
  const [isBusinessUser, setIsBusinessUser] = useState(initialData?.isBusinessUser || false);
  const [gstNumber, setGstNumber] = useState(initialData?.gstNumber || "");
  const [businessName, setBusinessName] = useState(initialData?.businessName || "");
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null);
  const [savedDetails, setSavedDetails] = useState(initialData);

  useEffect(() => {
    if (initialData) {
      setSavedDetails(initialData);
      setIsBusinessUser(initialData.isBusinessUser);
      setGstNumber(initialData.gstNumber || "");
      setBusinessName(initialData.businessName || "");
    }
  }, [initialData]);

  const handleBusinessToggle = (checked) => {
    setIsBusinessUser(checked);
    if (!checked) {
      setGstNumber("");
      setBusinessName("");
      setValidationStatus(null);
      onGSTDetailsChange?.(null);
    }
  };

  const validateGSTNumber = async () => {
    if (!gstNumber.trim()) {
      toast.error("Please enter GST number");
      return;
    }

    if (!gstService.validateGSTFormat(gstNumber)) {
      toast.error("Invalid GST number format");
      setValidationStatus("INVALID");
      return;
    }

    setIsValidating(true);
    try {
      const result = await gstService.validateGSTNumber(gstNumber);
      
      if (result.success) {
        setValidationStatus("VALID");
        toast.success("GST number validated successfully");
        
        // Auto-fill business name if available from validation
        if (result.data.businessName && !businessName) {
          setBusinessName(result.data.businessName);
        }
      } else {
        setValidationStatus("INVALID");
        toast.error(result.message || "GST number validation failed");
      }
    } catch (error) {
      setValidationStatus("FAILED");
      toast.error("GST validation service unavailable");
    } finally {
      setIsValidating(false);
    }
  };

  const saveGSTDetails = async () => {
    if (!gstNumber.trim() || !businessName.trim()) {
      toast.error("Please fill all business details");
      return;
    }

    if (validationStatus !== "VALID") {
      toast.error("Please validate your GST number first");
      return;
    }

    try {
      const result = await gstService.saveGSTDetails({
        gstNumber,
        businessName,
        isBusinessUser: true
      });

      if (result.success) {
        setSavedDetails(result.data);
        onGSTDetailsChange?.(result.data);
        toast.success("GST details saved successfully");
      } else {
        toast.error(result.message || "Failed to save GST details");
      }
    } catch (error) {
      toast.error("Failed to save GST details");
    }
  };

  const removeGSTDetails = async () => {
    try {
      const result = await gstService.removeGSTDetails();
      
      if (result.success) {
        setSavedDetails(null);
        setIsBusinessUser(false);
        setGstNumber("");
        setBusinessName("");
        setValidationStatus(null);
        onGSTDetailsChange?.(null);
        toast.success("GST details removed");
      } else {
        toast.error(result.message || "Failed to remove GST details");
      }
    } catch (error) {
      toast.error("Failed to remove GST details");
    }
  };

  const getValidationBadge = () => {
    switch (validationStatus) {
      case "VALID":
        return <Badge className="bg-green-100 text-green-800 border-green-200">
          <Check className="w-3 h-3 mr-1" /> Valid
        </Badge>;
      case "INVALID":
        return <Badge className="bg-red-100 text-red-800 border-red-200">
          <X className="w-3 h-3 mr-1" /> Invalid
        </Badge>;
      case "FAILED":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">
          <AlertCircle className="w-3 h-3 mr-1" /> Validation Failed
        </Badge>;
      default:
        return null;
    }
  };

  if (showInCheckout && savedDetails) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Building className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-900">{savedDetails.businessName}</p>
                <p className="text-sm text-green-700">GST: {savedDetails.gstNumber}</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-300">
              <Check className="w-3 h-3 mr-1" /> Business
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Building className="w-5 h-5" />
          Business Details (Optional)
        </CardTitle>
        <p className="text-sm text-slate-600">
          Add GST details for business purchases and tax benefits
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Business User Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="business-user" className="text-sm font-medium">
            This is a business purchase
          </Label>
          <Switch
            id="business-user"
            checked={isBusinessUser}
            onCheckedChange={handleBusinessToggle}
          />
        </div>

        {isBusinessUser && (
          <div className="space-y-4 border-t pt-4">
            {/* GST Number Input */}
            <div className="space-y-2">
              <Label htmlFor="gst-number">GST Number</Label>
              <div className="flex gap-2">
                <Input
                  id="gst-number"
                  placeholder="e.g., 07AABCU9603R1ZM"
                  value={gstNumber}
                  onChange={(e) => {
                    setGstNumber(e.target.value.toUpperCase());
                    setValidationStatus(null);
                  }}
                  className="flex-1 font-mono"
                  maxLength={15}
                />
                <Button
                  onClick={validateGSTNumber}
                  disabled={!gstNumber.trim() || isValidating}
                  variant="outline"
                  className="whitespace-nowrap"
                >
                  {isValidating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Validate"
                  )}
                </Button>
              </div>
              {getValidationBadge()}
              <p className="text-xs text-slate-500">
                Format: 2-digit state code + 10-digit PAN + 1-digit entity + 1-digit checksum
              </p>
            </div>

            {/* Business Name */}
            <div className="space-y-2">
              <Label htmlFor="business-name">Business Name</Label>
              <Input
                id="business-name"
                placeholder="Enter your registered business name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={saveGSTDetails}
                disabled={!gstNumber || !businessName || validationStatus !== "VALID"}
                className="flex-1"
              >
                <FileText className="w-4 h-4 mr-2" />
                Save Details
              </Button>
              
              {savedDetails && (
                <Button
                  onClick={removeGSTDetails}
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>

            {/* Benefits Info */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2 text-sm text-blue-700">
                <IndianRupee className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Benefits of adding GST:</p>
                  <ul className="mt-1 space-y-1">
                    <li>• Input Tax Credit (ITC) available for businesses</li>
                    <li>• Professional invoices for accounting</li>
                    <li>• Tax-compliant documentation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GSTDetailsForm;