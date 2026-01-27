'use client';

import { useState, useEffect } from 'react';
import { X, Clock, CheckCircle, Shield, Zap, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ExitIntentPopup = ({ onClose, onAction }) => {
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [showCountdown, setShowCountdown] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const benefits = [
    "Complete 3D Design Package",
    "Itemized Budget Breakdown",
    "5+ Verified Vendor Contacts",
    "Material Specifications Sheet",
    "Unlimited Revisions",
    "72-Hour Delivery Guarantee"
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl max-w-md w-full animate-scaleIn">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Wait! Don't Miss Out
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Timer */}
          {showCountdown && (
            <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-red-800">
                    Limited Time Offer
                  </span>
                </div>
                <div className="text-2xl font-bold text-red-600 font-mono">
                  {formatTime(timer)}
                </div>
              </div>
              <p className="text-xs text-red-600 mt-2">
                This special discount expires soon
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Offer */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full mb-4">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700">
                Exclusive 30% Discount Applied
              </span>
            </div>
            
            <div className="flex items-center justify-center gap-4 mb-2">
              <span className="text-3xl line-through text-gray-400">₹7,142</span>
              <span className="text-5xl font-bold text-gray-900">₹4,999</span>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              One-time payment • No hidden fees
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Complete Package Includes:
            </h3>
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-700">2,847+</div>
              <div className="text-xs text-blue-600">Happy Homes</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-700">₹87Cr+</div>
              <div className="text-xs text-green-600">Total Saved</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-xl font-bold text-purple-700">4.8★</div>
              <div className="text-xs text-purple-600">Rating</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onAction}
              className="w-full py-6 text-lg font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transition-all"
            >
              <Zap className="w-5 h-5 mr-2" />
              Claim Your Design for ₹4,999
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full text-gray-600 hover:text-gray-800"
            >
              No thanks, I'll pay 30% more later
            </Button>
          </div>

          {/* Security Badge */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <Shield className="w-3 h-3" />
              <span>Secure Payment • 7-Day Money Back Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};