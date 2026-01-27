'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export function ExitIntentPopup({ onClose, onPackageSelect }) {
  const [show, setShow] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !show && !isClosing) {
        setShow(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [show, isClosing]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShow(false);
      setIsClosing(false);
      if (onClose) onClose();
    }, 300);
  };

  const handleStartTrial = () => {
    onPackageSelect(499);
    handleClose();
  };

  if (!show) return null;

  return (
    <div className={`fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div className={`bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-transform duration-300 ${isClosing ? 'scale-95' : 'scale-100'}`}>
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              🎁 Get ₹500 Off Your First Room
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-lg">✓</span>
              </div>
              <p className="text-gray-700">
                Try our Single Room Trial for <span className="font-bold text-green-600">₹499</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-lg">✓</span>
              </div>
              <p className="text-gray-700">
                If you love it, upgrade to Complete Home Design
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-lg">✓</span>
              </div>
              <p className="text-gray-700">
                Get ₹499 credited toward your full package
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleStartTrial}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3.5 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
            >
              Start Room Trial - ₹499
            </button>
            <button
              onClick={handleClose}
              className="w-full text-gray-500 hover:text-gray-700 text-sm"
            >
              No thanks, I'll continue browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}