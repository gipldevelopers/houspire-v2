// // src\app\lp3\components\popups\DiscountPopup.js
// 'use client';

// import { useEffect, useState } from 'react';
// import { X, Clock, CheckCircle } from 'lucide-react';

// export function DiscountPopup({ onClose, onPackageSelect }) {
//   const [show, setShow] = useState(false);
//   const [countdown, setCountdown] = useState({ minutes: 14, seconds: 59 });

//   useEffect(() => {
//     // Show popup after 30 seconds of page load
//     const timer = setTimeout(() => {
//       setShow(true);
//     }, 5000);

//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     if (!show) return;

//     const interval = setInterval(() => {
//       setCountdown(prev => {
//         if (prev.seconds > 0) {
//           return { ...prev, seconds: prev.seconds - 1 };
//         } else if (prev.minutes > 0) {
//           return { minutes: prev.minutes - 1, seconds: 59 };
//         }
//         return { minutes: 0, seconds: 0 };
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [show]);

//   const handleClaimDiscount = () => {
//     onPackageSelect(4999);
//     if (onClose) onClose();
//   };

//   if (!show) return null;

//   return (
//     <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 animate-fadeIn">
//       <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-scaleIn">
//         <div className="relative">
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
//             aria-label="Close"
//           >
//             <X className="w-5 h-5" />
//           </button>

//           <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-2xl">
//             <div className="flex items-center justify-center gap-2 mb-2">
//               <Clock className="w-5 h-5" />
//               <span className="text-sm font-semibold">LIMITED TIME OFFER</span>
//             </div>
//             <h3 className="text-2xl font-bold text-center">
//               Complete Home Design<br />
//               <span className="text-3xl">₹4,999 <span className="text-base line-through opacity-80">₹5,999</span></span>
//             </h3>
//           </div>

//           <div className="p-6">
//             <div className="flex justify-center mb-6">
//               <div className="bg-red-50 border-2 border-red-200 rounded-xl px-4 py-2">
//                 <div className="text-center">
//                   <p className="text-sm text-red-700 font-semibold">OFFER EXPIRES IN</p>
//                   <div className="flex items-center justify-center gap-2 mt-1">
//                     <div className="bg-white px-3 py-1 rounded-lg shadow">
//                       <span className="text-2xl font-bold text-red-600">
//                         {countdown.minutes.toString().padStart(2, '0')}:{countdown.seconds.toString().padStart(2, '0')}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-3 mb-6">
//               <div className="flex items-start gap-3">
//                 <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
//                 <span className="text-gray-700">5-7 room 3D designs</span>
//               </div>
//               <div className="flex items-start gap-3">
//                 <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
//                 <span className="text-gray-700">Complete budget breakdown</span>
//               </div>
//               <div className="flex items-start gap-3">
//                 <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
//                 <span className="text-gray-700">10-15 verified vendor contacts</span>
//               </div>
//             </div>

//             <div className="space-y-3">
//               <button
//                 onClick={handleClaimDiscount}
//                 className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3.5 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
//               >
//                 Claim Offer - ₹4,999
//               </button>
//               <button
//                 onClick={onClose}
//                 className="w-full text-gray-500 hover:text-gray-700 text-sm"
//               >
//                 Continue browsing at regular price
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// src\app\lp3\components\popups\DiscountPopup.js
'use client';

import { useEffect, useState } from 'react';
import { X, Clock, CheckCircle } from 'lucide-react';

export function DiscountPopup({ onClose, onPackageSelect }) {
  const [show, setShow] = useState(false);
  const [countdown, setCountdown] = useState({ minutes: 14, seconds: 59 });

  useEffect(() => {
    // Show popup after 5 seconds of page load
    const timer = setTimeout(() => {
      setShow(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!show) return;

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return { minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [show]);

  const handleClaimDiscount = () => {
    onPackageSelect(4999);
    if (onClose) onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-2 animate-fadeIn">
      <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl w-full max-w-[280px] sm:max-w-md shadow-2xl animate-scaleIn">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 text-gray-400 hover:text-gray-600 z-10 p-0.5"
            aria-label="Close"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </button>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-2.5 sm:p-4 md:p-6 rounded-t-lg sm:rounded-t-xl md:rounded-t-2xl">
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              <span className="text-xs font-semibold">LIMITED TIME OFFER</span>
            </div>
            <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-center leading-snug">
              Complete Home Design
              <br />
              <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
                ₹4,999 <span className="text-xs sm:text-sm md:text-base line-through opacity-80">₹5,999</span>
              </span>
            </h3>
          </div>

          <div className="p-2.5 sm:p-4 md:p-6">
            <div className="flex justify-center mb-2 sm:mb-4 md:mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2">
                <div className="text-center">
                  <p className="text-xs text-red-700 font-semibold">OFFER EXPIRES IN</p>
                  <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-0.5">
                    <div className="bg-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded shadow">
                      <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-red-600">
                        {countdown.minutes.toString().padStart(2, '0')}:{countdown.seconds.toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 md:space-y-3 mb-2.5 sm:mb-4 md:mb-6">
              <div className="flex items-start gap-1.5 sm:gap-2 md:gap-3">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm md:text-gray-700 leading-tight">5-7 room 3D designs</span>
              </div>
              <div className="flex items-start gap-1.5 sm:gap-2 md:gap-3">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm md:text-gray-700 leading-tight">Complete budget breakdown</span>
              </div>
              <div className="flex items-start gap-1.5 sm:gap-2 md:gap-3">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm md:text-gray-700 leading-tight">10-15 verified vendor contacts</span>
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
              <button
                onClick={handleClaimDiscount}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 sm:py-2.5 md:py-3 lg:py-3.5 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow hover:shadow-md sm:shadow-lg hover:sm:shadow-xl active:scale-[0.98]"
              >
                Claim Offer - ₹4,999
              </button>
              <button
                onClick={onClose}
                className="w-full text-gray-500 hover:text-gray-700 text-xs sm:text-sm"
              >
                Continue browsing at regular price
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}