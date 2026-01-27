// src/app/payment/success/page.js
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileView, setMobileView] = useState(false);
  const [countdown, setCountdown] = useState(3); // Countdown for auto-redirect

  // Check mobile view on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setMobileView(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Get payment data from localStorage or URL params
    const storedData = localStorage.getItem("paymentData");
    const paymentId = searchParams.get("payment_id");
    const orderId = searchParams.get("order_id");

    if (storedData) {
      try {
        setPaymentData(JSON.parse(storedData));
      } catch (error) {
        console.error("Error parsing payment data:", error);
      }
    }

    setLoading(false);
  }, [searchParams]);

  // Auto-redirect to dashboard after 3 seconds
  useEffect(() => {
    if (!loading) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/dashboard");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loading, router]);

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your payment confirmation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Auto-redirect Notification */}
        <div className="mb-4 sm:mb-6 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-blue-700">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm sm:text-base font-medium">
              Redirecting to dashboard in {countdown} second{countdown !== 1 ? 's' : ''}...
            </span>
          </div>
        </div>

        {/* Success Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Payment Successful! 🎉
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto">
            Thank you for your payment. Your interior design journey begins now!
          </p>
        </div>

        {/* Payment Details Card */}
        <Card className="mb-4 sm:mb-6 shadow-lg border-0">
          <CardHeader className="bg-green-50 border-b p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2 justify-center sm:justify-start">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Order Confirmation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {paymentData && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="text-center sm:text-left">
                    <p className="text-xs sm:text-sm text-gray-500">Order ID</p>
                    <p className="font-semibold text-sm sm:text-base">
                      {paymentData.orderId || "N/A"}
                    </p>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-xs sm:text-sm text-gray-500">Payment ID</p>
                    <p className="font-semibold text-sm sm:text-base">
                      {paymentData.paymentId || "N/A"}
                    </p>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-xs sm:text-sm text-gray-500">Amount Paid</p>
                    <p className="font-semibold text-green-600 text-sm sm:text-base">
                      ₹{paymentData.amount?.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-xs sm:text-sm text-gray-500">Date</p>
                    <p className="font-semibold text-sm sm:text-base">
                      {new Date(paymentData.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-3 sm:pt-4">
                  <p className="text-xs sm:text-sm text-gray-500 mb-2 text-center sm:text-left">Package Details</p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-semibold text-sm sm:text-base text-center sm:text-left">{paymentData.plan}</p>
                    {paymentData.enhancements &&
                      paymentData.enhancements.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">Add-ons:</p>
                          <ul className="text-xs sm:text-sm text-gray-700 ml-4 mt-1">
                            {paymentData.enhancements.map((enh, index) => (
                              <li key={index}>• {enh}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Steps Card */}
        <Card className="mb-4 sm:mb-6 border-0 shadow-lg">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2 justify-center sm:justify-start">
              <Calendar className="w-5 h-5" />
              What Happens Next?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base">Design Questionnaire</p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Complete your design preferences questionnaire (available immediately)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base">Design Generation</p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Get your personalized generated interior designs within 24-48 hours
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base">Detailed BOQ</p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Receive your comprehensive Bill of Quantities with vendor recommendations
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Button - Centered and prominent */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <Button
            onClick={handleGoToDashboard}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 h-12 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
            size={mobileView ? "default" : "lg"}
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Dashboard Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Support Info */}
        <div className="text-center text-xs sm:text-sm text-gray-500 bg-white/50 rounded-lg p-4 sm:p-6 border border-gray-100">
          <p className="font-medium text-gray-700 mb-2">Need help with your design project?</p>
          <p>Contact our support team at <span className="text-green-600">support@houspire.com</span></p>
          <p className="mt-1">Or call us at <span className="text-green-600">+91-XXXXX-XXXXX</span></p>
        </div>

        {/* Quick Tips */}
        <Card className="mt-4 sm:mt-6 border-0 bg-blue-50/50">
          <CardContent className="p-4 sm:p-6">
            <h3 className="font-semibold text-center text-gray-800 mb-3 text-sm sm:text-base">
              Quick Start Tips
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-gray-600">
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <p>Check your email for confirmation</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <p>Complete your design brief</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <p>Expect designs in 24-48 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}