// src/app/checkout/CheckoutContent.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, CreditCard, Shield, Lock, Calendar, User, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { projectService } from '@/services/project.service';
import { packageService } from '@/services/package.service';

const InfoBlock = ({ title, icon: Icon, children }) => (
  <Card className="shadow-sm border-border bg-card">
    <CardHeader className="pb-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-primary" />}
        {title}
      </h2>
    </CardHeader>
    <CardContent className="pt-0">{children}</CardContent>
  </Card>
);

const CheckoutOrderSummary = ({ 
  plan,
  planData,
  originalPrice,
  enhancements = [],
  enhancementData = [],
  discount = 0, 
  onApplyDiscount,
  onCompletePayment,
  isProcessing,
  isLoading 
}) => {
  if (isLoading) {
    return (
      <Card className="shadow-lg border-2 border-primary/20 bg-card sticky top-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate prices from actual data
  const planPrice = planData?.price || 0;
  const actualOriginalPrice = planData?.originalPrice || originalPrice;

  // Calculate enhancements total from actual enhancement data
  const enhancementsTotal = enhancementData.reduce((total, enhancement) => {
    return total + (enhancement.price || 0);
  }, 0);

  const subtotal = planPrice + enhancementsTotal;
  const total = Math.max(0, subtotal - discount);
  const savings = actualOriginalPrice ? actualOriginalPrice - planPrice : 0;

  return (
    <Card className="shadow-lg border-2 border-primary/20 bg-card sticky top-8">
      <CardHeader className="pb-4">
        <h3 className="text-xl font-bold text-foreground">Order Summary</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Property Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Property:</span>
            <span className="font-medium text-foreground">3BHK</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Location:</span>
            <span className="font-medium text-foreground">Nagpur</span>
          </div>
        </div>

        <Separator />

        {/* Package Detail */}
        <div className="flex justify-between items-start text-base">
          <div>
            <p className="font-semibold text-foreground">{planData?.name || plan}</p>
            <p className="text-sm text-muted-foreground">
              {planData?.description || 'Interior planning package'}
            </p>
            {savings > 0 && (
              <div className="text-green-600 font-medium text-sm mt-1">
                Save ₹{savings.toLocaleString('en-IN')}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="font-semibold text-foreground">₹{planPrice.toLocaleString('en-IN')}</div>
            {actualOriginalPrice && actualOriginalPrice > planPrice && (
              <div className="text-slate-500 line-through text-sm">
                ₹{actualOriginalPrice.toLocaleString('en-IN')}
              </div>
            )}
          </div>
        </div>

        {/* Enhancements */}
        {enhancementData.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Enhancements:</p>
              {enhancementData.map((enhancement) => (
                <div key={enhancement.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">+ {enhancement.name}</span>
                  <span className="text-foreground">
                    +₹{enhancement.price?.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        <Separator />

        {/* Discount Code */}
        <div className="space-y-2">
          <Label htmlFor="discount" className="text-sm text-foreground">Discount Code</Label>
          <div className="flex space-x-2">
            <Input 
              id="discount"
              placeholder="Enter discount code" 
              className="flex-grow border-border"
              onKeyPress={(e) => {
                if (e.key === 'Enter') onApplyDiscount(e.target.value);
              }}
            />
            <Button 
              variant="outline" 
              className="px-4 border-border hover:bg-accent"
              onClick={() => {
                const input = document.getElementById('discount');
                onApplyDiscount(input.value);
              }}
            >
              Apply
            </Button>
          </div>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Discount Applied</span>
            <span className="text-green-600">-₹{discount.toLocaleString('en-IN')}</span>
          </div>
        )}

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-2xl font-bold">
          <span className="text-foreground">Total</span>
          <span className="text-primary">₹{total.toLocaleString('en-IN')}</span>
        </div>

        <Separator className="my-4" />

        {/* Security and Payment Button */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-green-600" />
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center gap-1">
              <Lock className="w-4 h-4 text-green-600" />
              <span>Secure</span>
            </div>
          </div>
          
          <Button 
            onClick={onCompletePayment}
            disabled={isProcessing || !planData}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-lg transition-all duration-200 hover:scale-105 disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </div>
            ) : (
              `Complete Payment - ₹${total.toLocaleString('en-IN')}`
            )}
          </Button>
          
          <div className="text-sm text-muted-foreground space-y-1 pt-1">
            <p className="flex items-center justify-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Money-back guarantee
            </p>
            <p className="flex items-center justify-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Planning-only service
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({
    fullName: 'abhishek khanna',
    email: 'akhanna4781@gmail.com',
    phone: '+91 9053002252',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    address: '',
    city: '',
    postalCode: '',
    specialRequests: ''
  });

  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedPlanData, setSelectedPlanData] = useState(null);
  const [selectedEnhancements, setSelectedEnhancements] = useState([]);
  const [selectedEnhancementsData, setSelectedEnhancementsData] = useState([]);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [projectDetails, setProjectDetails] = useState(null);

  useEffect(() => {
    loadCheckoutData();
  }, []);

  const loadCheckoutData = async () => {
    setIsLoading(true);
    try {
      // Get data from localStorage
      const packageSelection = JSON.parse(localStorage.getItem('packageSelection') || '{}');
      const projectData = JSON.parse(localStorage.getItem('projectPaymentData') || '{}');
      
      const planName = packageSelection.plan || 'Premium Plan';
      const enhancementNames = packageSelection.enhancements || [];
      
      setSelectedPlan(planName);
      setProjectDetails(projectData);

      // Fetch actual plan and enhancement data from API
      const [plansResponse, addonsResponse] = await Promise.all([
        packageService.getPackages(),
        packageService.getAddons()
      ]);

      if (plansResponse.success) {
        const planData = plansResponse.data.packages.find(pkg => 
          pkg.name === planName || pkg.id === planName
        );
        setSelectedPlanData(planData);
        setOriginalPrice(planData?.originalPrice || 0);
      }

      if (addonsResponse.success && enhancementNames.length > 0) {
        const enhancementData = addonsResponse.data.addons.filter(addon =>
          enhancementNames.some(enhName => 
            addon.name === enhName || addon.id === enhName
          )
        );
        setSelectedEnhancementsData(enhancementData);
        setSelectedEnhancements(enhancementNames);
      }

    } catch (error) {
      console.error('Error loading checkout data:', error);
      toast.error('Failed to load package data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.cardNumber.trim() || formData.cardNumber.replace(/\s/g, '').length !== 16) newErrors.cardNumber = 'Valid card number is required';
    if (!formData.expiryDate.trim() || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) newErrors.expiryDate = 'Valid expiry date (MM/YY) is required';
    if (!formData.cvv.trim() || formData.cvv.length !== 3) newErrors.cvv = 'Valid CVV is required';
    if (!formData.cardName.trim()) newErrors.cardName = 'Name on card is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyDiscount = (code) => {
    if (code.toUpperCase() === 'WELCOME100') {
      setDiscount(100);
      toast.success("Discount Applied!", {
        description: "₹100 discount has been applied to your order.",
      });
    } else if (code.toUpperCase() === 'SAVE500') {
      setDiscount(500);
      toast.success("Discount Applied!", {
        description: "₹500 discount has been applied to your order.",
      });
    } else if (code) {
      toast.error("Invalid Code", {
        description: "The discount code you entered is invalid.",
      });
    }
  };

  const handleCompletePayment = async () => {
    if (!validateForm()) {
      toast.error("Validation Error", {
        description: "Please fill all required fields correctly.",
      });
      return;
    }

    if (!selectedPlanData) {
      toast.error("Package Error", {
        description: "Unable to load package information. Please try again.",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Calculate total amount from actual data
      const planPrice = selectedPlanData.price || 0;
      const enhancementsTotal = selectedEnhancementsData.reduce((total, enhancement) => {
        return total + (enhancement.price || 0);
      }, 0);

      const totalAmount = Math.max(0, planPrice + enhancementsTotal - discount);

      // Get project ID from localStorage
      const projectData = JSON.parse(localStorage.getItem('projectPaymentData') || '{}');
      const projectId = projectData.projectId;

      if (!projectId) {
        throw new Error('Project ID not found');
      }

      // Store payment data locally (simulate payment)
      const paymentData = {
        plan: selectedPlanData.name,
        originalPrice: selectedPlanData.originalPrice,
        enhancements: selectedEnhancementsData.map(enh => enh.name),
        amount: totalAmount,
        discount: discount,
        customer: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone
        },
        property: {
          type: projectDetails?.projectType || '3BHK',
          location: projectDetails?.city || 'Nagpur'
        },
        timestamp: new Date().toISOString(),
        paymentId: 'pay_' + Math.random().toString(36).substr(2, 9)
      };

      localStorage.setItem('paymentData', JSON.stringify(paymentData));
      localStorage.setItem('paymentCompleted', 'true');
      localStorage.setItem('paymentProjectId', projectId) 

    // In CheckoutContent.js - update the payment completion
    await projectService.updateProject(projectId, {
      selectedPlan: selectedPlanData.name,
      selectedAddons: selectedEnhancementsData.map(enh => enh.name),
      paymentStatus: 'COMPLETED',
      status: 'PAYMENT_COMPLETED' // Add this line
    });

      toast.success("Payment Successful!", {
        description: "Your interior planning package has been activated.",
      });

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Redirect to success page or dashboard
      setTimeout(() => {
        router.push('/dashboard?payment=success');
      }, 1500);

    } catch (error) {
      console.error('Payment failed:', error);
      toast.error("Payment Failed", {
        description: error.message || "Please try again or use a different payment method.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header and Back Button */}
        <div className="mb-8">
          <Link 
            href="/packages"
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-2 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Packages</span>
          </Link>
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Secure Checkout</h1>
              <p className="text-sm text-muted-foreground">Complete your interior planning package purchase</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* === LEFT COLUMN: FORM SECTIONS === */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Customer Information */}
            <InfoBlock title="Customer Information" icon={User}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
                  <Input 
                    id="fullName"
                    placeholder="Enter your full name" 
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={errors.fullName ? 'border-destructive' : 'border-border'}
                  />
                  {errors.fullName && <span className="text-xs text-destructive">{errors.fullName}</span>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email Address</Label>
                  <Input 
                    id="email"
                    placeholder="Enter your email address" 
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={errors.email ? 'border-destructive' : 'border-border'}
                  />
                  {errors.email && <span className="text-xs text-destructive">{errors.email}</span>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                  <Input 
                    id="phone"
                    placeholder="Enter your phone number" 
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={errors.phone ? 'border-destructive' : 'border-border'}
                  />
                  {errors.phone && <span className="text-xs text-destructive">{errors.phone}</span>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="property" className="text-foreground">Property Details</Label>
                  <Input 
                    id="property"
                    placeholder="Property Details" 
                    value={`${projectDetails?.projectType || '3BHK'} in ${projectDetails?.city || 'Nagpur'}`} 
                    disabled 
                    className="border-border bg-muted"
                  />
                </div>
              </div>
            </InfoBlock>
            
            {/* 2. Payment Information */}
            <InfoBlock title="Payment Information" icon={CreditCard}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber" className="text-foreground">Card Number</Label>
                  <Input 
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                    maxLength={19}
                    className={errors.cardNumber ? 'border-destructive' : 'border-border'}
                  />
                  {errors.cardNumber && <span className="text-xs text-destructive">{errors.cardNumber}</span>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate" className="text-foreground">Expiry Date</Label>
                    <Input 
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                      maxLength={5}
                      className={errors.expiryDate ? 'border-destructive' : 'border-border'}
                    />
                    {errors.expiryDate && <span className="text-xs text-destructive">{errors.expiryDate}</span>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cvv" className="text-foreground">CVV</Label>
                    <Input 
                      id="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
                      maxLength={3}
                      className={errors.cvv ? 'border-destructive' : 'border-border'}
                    />
                    {errors.cvv && <span className="text-xs text-destructive">{errors.cvv}</span>}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cardName" className="text-foreground">Name on Card</Label>
                  <Input 
                    id="cardName"
                    placeholder="Full name as on card"
                    value={formData.cardName}
                    onChange={(e) => handleInputChange('cardName', e.target.value)}
                    className={errors.cardName ? 'border-destructive' : 'border-border'}
                  />
                  {errors.cardName && <span className="text-xs text-destructive">{errors.cardName}</span>}
                </div>
              </div>
            </InfoBlock>

            {/* 3. Billing Address */}
            <InfoBlock title="Billing Address" icon={User}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-foreground">Address</Label>
                  <Textarea 
                    id="address"
                    placeholder="Enter your billing address" 
                    rows={3}
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={errors.address ? 'border-destructive' : 'border-border'}
                  />
                  {errors.address && <span className="text-xs text-destructive">{errors.address}</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-foreground">City</Label>
                    <Input 
                      id="city"
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={errors.city ? 'border-destructive' : 'border-border'}
                    />
                    {errors.city && <span className="text-xs text-destructive">{errors.city}</span>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="postalCode" className="text-foreground">Postal Code</Label>
                    <Input 
                      id="postalCode"
                      placeholder="Enter postal code"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className={errors.postalCode ? 'border-destructive' : 'border-border'}
                    />
                    {errors.postalCode && <span className="text-xs text-destructive">{errors.postalCode}</span>}
                  </div>
                </div>
              </div>
            </InfoBlock>

            {/* 4. Special Requests */}
            <InfoBlock title="Special Requests (Optional)" icon={User}>
              <Label htmlFor="specialRequests" className="text-foreground">Special Requests</Label>
              <Textarea 
                id="specialRequests"
                placeholder="Any special requirements or preferences for your interior planning..."
                rows={4}
                value={formData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                className="border-border mt-2"
              />
            </InfoBlock>
          </div>

          {/* === RIGHT COLUMN: ORDER SUMMARY === */}
          <div className="lg:col-span-1">
            <CheckoutOrderSummary 
              plan={selectedPlan}
              planData={selectedPlanData}
              originalPrice={originalPrice}
              enhancements={selectedEnhancements}
              enhancementData={selectedEnhancementsData}
              discount={discount}
              onApplyDiscount={handleApplyDiscount}
              onCompletePayment={handleCompletePayment}
              isProcessing={isProcessing}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}