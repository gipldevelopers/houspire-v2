// src/components/payment/PaymentModal.js
'use client'

import { useState, useEffect } from 'react'
import { Loader2, CheckCircle, X, CreditCard, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  project, 
  boqAmount,
  onPaymentSuccess 
}) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState('idle') // idle, processing, success, failed
  const [selectedPlan, setSelectedPlan] = useState('full') // full, advance, milestone

  const paymentPlans = [
    {
      id: 'full',
      name: 'Full Payment',
      description: 'Pay entire amount upfront',
      amount: boqAmount,
      discount: 0.05, // 5% discount for full payment
      features: ['5% discount', 'Priority scheduling', 'Dedicated project manager']
    },
    {
      id: 'advance',
      name: '50% Advance',
      description: 'Pay 50% now, 50% on completion',
      amount: boqAmount * 0.5,
      discount: 0,
      features: ['Flexible payment', 'Standard scheduling']
    },
    {
      id: 'milestone',
      name: 'Milestone Based',
      description: 'Pay as work progresses',
      amount: boqAmount * 0.3, // 30% initial
      discount: 0,
      features: ['Maximum flexibility', 'Pay per milestone']
    }
  ]

  const selectedPlanData = paymentPlans.find(plan => plan.id === selectedPlan)
  const finalAmount = selectedPlanData ? 
    selectedPlanData.amount * (1 - selectedPlanData.discount) : 
    boqAmount

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  const initiatePayment = async () => {
    setIsProcessing(true)
    setPaymentStatus('processing')

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load')
      }

      // Create order on your backend
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(finalAmount * 100), // Convert to paise
          currency: 'INR',
          projectId: project?.id,
          planType: selectedPlan
        })
      })

      const orderData = await orderResponse.json()

      if (!orderData.success) {
        throw new Error('Order creation failed')
      }

      // Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Your test key
        amount: Math.round(finalAmount * 100),
        currency: 'INR',
        name: 'Houspire Designs',
        description: `Project: ${project?.title || 'Interior Design Project'}`,
        image: '/logo.png',
        order_id: orderData.orderId,
        handler: async function (response) {
          // Verify payment on your backend
          const verificationResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              projectId: project?.id
            })
          })

          const verificationData = await verificationResponse.json()

          if (verificationData.success) {
            setPaymentStatus('success')
            // Call success callback after a delay
            setTimeout(() => {
              onPaymentSuccess({
                paymentId: response.razorpay_payment_id,
                amount: finalAmount,
                planType: selectedPlan
              })
            }, 2000)
          } else {
            setPaymentStatus('failed')
          }
        },
        prefill: {
          name: 'Customer Name', // You can prefill from user data
          email: 'customer@example.com',
          contact: '9999999999'
        },
        notes: {
          project: project?.title,
          plan: selectedPlan
        },
        theme: {
          color: '#F59E0B' // Amber color matching your theme
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
      
    } catch (error) {
      console.error('Payment error:', error)
      setPaymentStatus('failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    if (paymentStatus === 'success') {
      onPaymentSuccess() // If user closes after success
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <CreditCard className="h-5 w-5 text-primary" />
              Complete Your Payment
            </DialogTitle>
            {paymentStatus !== 'success' && (
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <DialogDescription className="text-muted-foreground">
            Secure payment processed by Razorpay
          </DialogDescription>
        </DialogHeader>

        {paymentStatus === 'success' ? (
          <div className="text-center py-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Payment Successful!
            </h3>
            <p className="text-muted-foreground mb-4">
              Your project is now confirmed. Our team will contact you within 24 hours.
            </p>
            <div className="bg-muted rounded-lg p-4 text-sm">
              <div className="flex justify-between mb-1">
                <span>Amount Paid:</span>
                <span className="font-semibold">₹{finalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Plan:</span>
                <span className="font-semibold capitalize">{selectedPlan}</span>
              </div>
            </div>
          </div>
        ) : paymentStatus === 'failed' ? (
          <div className="text-center py-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
              <X className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Payment Failed
            </h3>
            <p className="text-muted-foreground mb-4">
              There was an issue processing your payment. Please try again.
            </p>
            <Button onClick={initiatePayment} className="w-full">
              Try Again
            </Button>
          </div>
        ) : (
          <>
            {/* Project Summary */}
            <div className="bg-muted rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-foreground mb-2">Project Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Project:</span>
                  <span className="font-medium">{project?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">BOQ Amount:</span>
                  <span className="font-medium">₹{boqAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Plan Selection */}
            <div className="mb-6">
              <h4 className="font-semibold text-foreground mb-3">Choose Payment Plan</h4>
              <div className="space-y-3">
                {paymentPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedPlan === plan.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h5 className="font-medium text-foreground">{plan.name}</h5>
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                      </div>
                      {plan.discount > 0 && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Save {plan.discount * 100}%
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-foreground">
                        ₹{Math.round(plan.amount * (1 - plan.discount)).toLocaleString()}
                      </span>
                      <div className="flex gap-1">
                        {plan.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Amount */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-foreground">Amount to Pay:</span>
                <span className="text-2xl font-bold text-primary">
                  ₹{Math.round(finalAmount).toLocaleString()}
                </span>
              </div>
              {selectedPlanData?.discount > 0 && (
                <p className="text-sm text-green-600 mt-1">
                  You save ₹{(selectedPlanData.amount * selectedPlanData.discount).toLocaleString()}
                </p>
              )}
            </div>

            {/* Security Features */}
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-green-600" />
                <span>SSL Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-blue-600" />
                <span>Razorpay</span>
              </div>
            </div>

            {/* Payment Button */}
            <Button 
              onClick={initiatePayment}
              disabled={isProcessing}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay ₹{Math.round(finalAmount).toLocaleString()}
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-3">
              By proceeding, you agree to our Terms of Service and Privacy Policy
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default PaymentModal