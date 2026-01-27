// // src\app\lp3\components\popups\SocialProofPopup.js
// 'use client';

// import { useEffect, useState } from 'react';
// import { X, Users, Star, TrendingUp } from 'lucide-react';
// import Image from 'next/image';

// export function SocialProofPopup({ onClose, onPackageSelect }) {
//   const [show, setShow] = useState(false);
//   const [currentReview, setCurrentReview] = useState(0);

//   const reviews = [
//     {
//       name: "Ritu Sharma",
//       city: "Bangalore",
//       text: "Saved ₹3.2 lakhs compared to Livspace quote! Got 6 vendor options.",
//       rating: 5,
//       time: "2 hours ago"
//     },
//     {
//       name: "Arjun Verma",
//       city: "Mumbai",
//       text: "₹4,999 package was perfect for my 2BHK. Everything delivered in 72 hours!",
//       rating: 5,
//       time: "5 hours ago"
//     },
//     {
//       name: "Neha Patel",
//       city: "Delhi",
//       text: "From boring to breathtaking. My guests can't believe it's the same home!",
//       rating: 5,
//       time: "1 day ago"
//     }
//   ];

//   useEffect(() => {
//     // Show after user has scrolled 50% of page
//     const handleScroll = () => {
//       const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
//       if (scrollPercent > 50 && !show) {
//         setShow(true);
//         window.removeEventListener('scroll', handleScroll);
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [show]);

//   useEffect(() => {
//     if (!show) return;

//     const interval = setInterval(() => {
//       setCurrentReview(prev => (prev + 1) % reviews.length);
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [show, reviews.length]);

//   const handleStartNow = () => {
//     onPackageSelect(499);
//     if (onClose) onClose();
//   };

//   if (!show) return null;

//   return (
//     <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 animate-fadeIn">
//       <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-scaleIn">
//         <div className="p-6 sm:p-8">
//           <div className="flex justify-between items-start mb-6">
//             <div>
//               <div className="flex items-center gap-2 mb-2">
//                 <Users className="w-5 h-5 text-orange-500" />
//                 <h3 className="text-2xl font-bold text-gray-900">
//                   People Like You Are Saving Lakhs
//                 </h3>
//               </div>
//               <div className="flex items-center gap-2 text-sm text-gray-600">
//                 <TrendingUp className="w-4 h-4" />
//                 <span>2,847+ homes designed this month</span>
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 transition-colors"
//               aria-label="Close"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>

//           {/* Review Carousel */}
//           <div className="mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 min-h-[180px]">
//             <div className="flex items-start gap-4 mb-4">
//               <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
//                 {reviews[currentReview].name.charAt(0)}
//               </div>
//               <div className="flex-1">
//                 <div className="flex justify-between items-start mb-2">
//                   <div>
//                     <h4 className="font-bold text-gray-900">{reviews[currentReview].name}</h4>
//                     <p className="text-sm text-gray-600">{reviews[currentReview].city}</p>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     {[...Array(5)].map((_, i) => (
//                       <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                     ))}
//                   </div>
//                 </div>
//                 <p className="text-gray-700 italic mb-2">"{reviews[currentReview].text}"</p>
//                 <p className="text-xs text-gray-500">{reviews[currentReview].time}</p>
//               </div>
//             </div>

//             {/* Carousel indicators */}
//             <div className="flex justify-center gap-1.5">
//               {reviews.map((_, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setCurrentReview(idx)}
//                   className={`w-1.5 h-1.5 rounded-full transition-all ${currentReview === idx ? 'bg-orange-500 w-6' : 'bg-gray-300'}`}
//                   aria-label={`View review ${idx + 1}`}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Stats */}
//           <div className="grid grid-cols-3 gap-3 mb-6">
//             <div className="text-center bg-orange-50 p-3 rounded-lg">
//               <p className="text-2xl font-bold text-orange-600">487</p>
//               <p className="text-xs text-gray-600">Started Room Trial</p>
//             </div>
//             <div className="text-center bg-green-50 p-3 rounded-lg">
//               <p className="text-2xl font-bold text-green-600">445</p>
//               <p className="text-xs text-gray-600">Upgraded to Full Home</p>
//             </div>
//             <div className="text-center bg-purple-50 p-3 rounded-lg">
//               <p className="text-2xl font-bold text-purple-600">91%</p>
//               <p className="text-xs text-gray-600">Satisfaction Rate</p>
//             </div>
//           </div>

//           <div className="space-y-3">
//             <button
//               onClick={handleStartNow}
//               className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3.5 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
//             >
//               Start My Room Trial - ₹499
//             </button>
//             <p className="text-center text-sm text-gray-500">
//               ₹499 credited if you upgrade to full home
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// src\app\lp3\components\popups\SocialProofPopup.js
'use client';

import { useEffect, useState } from 'react';
import { X, Users, Star, TrendingUp } from 'lucide-react';

export function SocialProofPopup({ onClose, onPackageSelect }) {
  const [show, setShow] = useState(false);
  const [currentReview, setCurrentReview] = useState(0);

  const reviews = [
    {
      name: "Ritu Sharma",
      city: "Bangalore",
      text: "Saved ₹3.2 lakhs compared to Livspace quote! Got 6 vendor options.",
      rating: 5,
      time: "2 hours ago"
    },
    {
      name: "Arjun Verma",
      city: "Mumbai",
      text: "₹4,999 package was perfect for my 2BHK. Everything delivered in 72 hours!",
      rating: 5,
      time: "5 hours ago"
    },
    {
      name: "Neha Patel",
      city: "Delhi",
      text: "From boring to breathtaking. My guests can't believe it's the same home!",
      rating: 5,
      time: "1 day ago"
    }
  ];

  useEffect(() => {
    // Show after user has scrolled 50% of page
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 50 && !show) {
        setShow(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [show]);

  useEffect(() => {
    if (!show) return;

    const interval = setInterval(() => {
      setCurrentReview(prev => (prev + 1) % reviews.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [show, reviews.length]);

  const handleStartNow = () => {
    onPackageSelect(499);
    if (onClose) onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-2 animate-fadeIn">
      <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl w-full max-w-[280px] sm:max-w-md shadow-2xl animate-scaleIn">
        <div className="p-2.5 sm:p-4 md:p-6 lg:p-8">
          <div className="flex justify-between items-start mb-2.5 sm:mb-4">
            <div className="flex-1 mr-1.5">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-orange-500" />
                <h3 className="text-sm sm:text-base md:text-lg lg:text-2xl font-bold text-gray-900 leading-tight">
                  People Like You Are Saving Lakhs
                </h3>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
                <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>2,847+ homes designed this month</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 p-0.5"
              aria-label="Close"
            >
              <X className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
            </button>
          </div>

          {/* Review Carousel */}
          <div className="mb-2.5 sm:mb-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 min-h-[120px] sm:min-h-[140px] md:min-h-[160px]">
            <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg flex-shrink-0">
                {reviews[currentReview].name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-0.5 sm:mb-1">
                  <div>
                    <h4 className="text-xs sm:text-sm md:text-base font-medium sm:font-bold text-gray-900 leading-tight">
                      {reviews[currentReview].name}
                    </h4>
                    <p className="text-xs text-gray-600">{reviews[currentReview].city}</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 italic mb-0.5 sm:mb-1 line-clamp-2 leading-tight">
                  "{reviews[currentReview].text}"
                </p>
                <p className="text-xs text-gray-500">{reviews[currentReview].time}</p>
              </div>
            </div>

            {/* Carousel indicators */}
            <div className="flex justify-center gap-1">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentReview(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${currentReview === idx ? 'bg-orange-500 w-3' : 'bg-gray-300'}`}
                  aria-label={`View review ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-2.5 sm:mb-4">
            <div className="text-center bg-orange-50 p-1.5 sm:p-2 rounded">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-orange-600">487</p>
              <p className="text-xs text-gray-600">Room Trials</p>
            </div>
            <div className="text-center bg-green-50 p-1.5 sm:p-2 rounded">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-green-600">445</p>
              <p className="text-xs text-gray-600">Full Homes</p>
            </div>
            <div className="text-center bg-purple-50 p-1.5 sm:p-2 rounded">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-purple-600">91%</p>
              <p className="text-xs text-gray-600">Satisfaction</p>
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <button
              onClick={handleStartNow}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow hover:shadow-md sm:shadow-lg hover:sm:shadow-xl active:scale-[0.98]"
            >
              Start My Room Trial - ₹499
            </button>
            <p className="text-center text-xs text-gray-500 leading-tight">
              ₹499 credited if you upgrade to full home
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}