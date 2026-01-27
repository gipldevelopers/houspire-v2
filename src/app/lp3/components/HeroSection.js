// // src\app\lp3\components\HeroSection.js
// 'use client';

// import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { PlanningWizardModal } from './PlanningWizardModal';

// export function HeroSection({ selectPackage }) {
//   const [isWizardOpen, setIsWizardOpen] = useState(false);
//   const [selectedPackage, setSelectedPackage] = useState(null);
//   const [isMobile, setIsMobile] = useState(false);
//   const [isMounted, setIsMounted] = useState(false);

//   // Use useEffect to handle mobile detection only on client side
//   useEffect(() => {
//     setIsMounted(true);
    
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     // Initial check
//     checkMobile();
    
//     // Add event listener for resize
//     window.addEventListener('resize', checkMobile);
    
//     // Cleanup
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Don't render video with dynamic height until mounted on client
//   const videoHeight = !isMounted ? '500px' : (isMobile ? '250px' : '500px');

//   return (
//     <section id='hero' className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-gray-50 to-white">
//       <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
//         {/* Main Heading */}
//         <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-3 sm:mb-4 text-balance text-[#1F2937] leading-tight">
//           Get Complete Interior Design
//           <br />
//           <span className="text-[#F97316]">Starting from Just ₹499</span>
//         </h1>

//         <p className="text-sm sm:text-base md:text-lg lg:text-xl text-center mb-6 sm:mb-8 text-gray-600 max-w-3xl mx-auto px-2">
//           48-72-hour delivery • <span className="font-bold text-green-600 bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded animate-pulse-glow relative inline-block text-xs sm:text-sm md:text-base">100% money-back guarantee</span> • No hidden costs
//         </p>

//         {/* Video showcase - Use consistent height until mounted */}
//         <div className="max-w-5xl mx-auto mb-6 sm:mb-8 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl bg-black">
//           <video
//             className="w-full h-auto"
//             style={{
//               height: videoHeight,
//               objectFit: 'cover'
//             }}
//             autoPlay
//             loop
//             muted
//             playsInline
//           >
//             <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BA-hero-SbLVwzg7KDyOxN8QhV4dnXsy33JHPy.webm" type="video/webm" />
//             Your browser does not support the video tag.
//           </video>
//         </div>

//         {/* CTA Buttons */}
//         <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-10 max-w-4xl mx-auto px-2">
//           {/* Room Trial Button */}
//           <div className="flex flex-col items-center w-full sm:w-auto">
//             <button
//               onClick={() => {
//                 setSelectedPackage(499);
//                 setIsWizardOpen(true);
//               }}
//               className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-purple-600 text-purple-600 rounded-xl text-base sm:text-lg font-semibold hover:bg-purple-50 transition-all shadow-md"
//             >
//               Start with Single Room - ₹499
//             </button>
//             <p className="text-xs sm:text-sm text-gray-500 mt-1.5 sm:mt-2">487 families started here</p>
//           </div>

//           {/* Complete Home Button */}
//           <div className="flex flex-col items-center w-full sm:w-auto">
//             <button
//               onClick={() => {
//                 setSelectedPackage(4999);
//                 setIsWizardOpen(true);
//               }}
//               className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#FF6B35] text-white rounded-xl font-bold text-base sm:text-lg hover:bg-[#ff7f4d] transition-all shadow-xl"
//             >
//               Design Complete Home - ₹4,999
//             </button>
//             <p className="text-xs sm:text-sm text-gray-500 mt-1.5 sm:mt-2">Most popular • Save ₹2,500</p>
//           </div>
//         </div>

//         <div className="max-w-4xl mx-auto mb-8 sm:mb-10 p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl sm:rounded-2xl border border-orange-200">
//           <div className="text-center mb-3 sm:mb-4">
//             <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1F2937] mb-1.5 sm:mb-2">
//               💡 Smart Start: <span className="text-[#FF6B35]">₹499</span> Risk-Free Room Trial
//             </h3>
//             <p className="text-sm sm:text-base text-gray-600">
//               {/* Join 487 families who tested us first—then designed their entire home */}
//               Full refund if not delivered on time
// 499 credit towards full home design

//             </p>
//           </div>
          
//           <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center text-gray-700 text-sm sm:text-base">
//             <span className="flex items-center gap-1.5 sm:gap-2">
//               <span className="text-green-500 text-lg sm:text-xl">✓</span> Full refund if not satisfied
//             </span>
//             <span className="flex items-center gap-1.5 sm:gap-2">
//               <span className="text-green-500 text-lg sm:text-xl">✓</span> ₹499 credit toward full home design
//             </span>
//           </div>
//         </div>

//         <div className="max-w-5xl mx-auto px-2">
//           {/* Social Proof Stats */}
//           <div className="text-center mb-6 sm:mb-8 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200">
//             <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 leading-relaxed">
//               🔥 2,847 homes designed this month •  487 tried room design → 445 upgraded to full home design
//             </p>
//           </div>

//           {/* Key Benefits - Single Row */}
//           <div className="flex flex-wrap gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 text-xs sm:text-sm font-medium text-gray-700">
//             <span className="flex items-center gap-1.5 sm:gap-2">
//               <span className="text-green-500">✓</span> One-time payment
//             </span>
//             <span className="flex items-center gap-1.5 sm:gap-2">
//               <span className="text-green-500">✓</span> 48-72-hour delivery
//             </span>
//             <span className="flex items-center gap-1.5 sm:gap-2">
//               <span className="text-green-500">✓</span> ₹499 credit on upgrade
//             </span>
//             <span className="flex items-center gap-1.5 sm:gap-2">
//               <span className="text-green-500">✓</span> Full refund guarantee
//             </span>
//           </div>

//           {/* Trust Badges - Minimal */}
//           <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
//             <div className="flex items-center gap-1.5 sm:gap-2">
//               <div className="flex text-yellow-400 text-sm sm:text-base">⭐⭐⭐⭐⭐</div>
//               <span className="text-xs sm:text-sm text-gray-600">4.8 (247 reviews)</span>
//             </div>
//             <span className="text-xs sm:text-sm text-gray-600">🔒 Secured by Razorpay</span>
//             <span className="text-xs sm:text-sm font-bold text-green-600 bg-green-50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full animate-pulse-glow relative inline-block">✓ 100% Money Back</span>
//           </div>

//           <div className="text-center pt-4 sm:pt-6 border-t border-gray-200">
//             <p className="text-xs text-gray-500 mb-2 sm:mb-3 uppercase tracking-wide">As Featured In</p>
//             <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 items-center justify-center opacity-60">
//               <div className="relative h-4 sm:h-5 w-20 sm:w-28 grayscale">
//                 <Image src="/media/times-of-india.png" alt="Times of India" fill className="object-contain" />
//               </div>
//               <div className="relative h-4 sm:h-5 w-20 sm:w-28 grayscale">
//                 <Image src="/media/economic-times.png" alt="Economic Times" fill className="object-contain" />
//               </div>
//               <div className="relative h-4 sm:h-5 w-20 sm:w-28 grayscale">
//                 <Image src="/media/yourstory.png" alt="YourStory" fill className="object-contain" />
//               </div>
//               <div className="relative h-4 sm:h-5 w-20 sm:w-28 grayscale">
//                 <Image src="/media/the-hindu.png" alt="The Hindu" fill className="object-contain" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Planning Wizard Modal */}
//       <PlanningWizardModal 
//         open={isWizardOpen} 
//         onOpenChange={(open) => {
//           setIsWizardOpen(open);
//           if (!open) {
//             setSelectedPackage(null);
//           }
//         }}
//         selectedPackage={selectedPackage}
//       />
//     </section>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PlanningWizardModal } from './PlanningWizardModal';

export function HeroSection({ selectPackage }) {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Use useEffect to handle mobile detection only on client side
  useEffect(() => {
    setIsMounted(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Function to store selected plan in localStorage
  const storeSelectedPlan = (price) => {
    let planName = '';
    
    switch (price) {
      case 499:
        planName = 'Single Room Trial';
        break;
      case 4999:
        planName = 'Complete Home';
        break;
      case 9999:
        planName = 'Premium Home';
        break;
      case 14999:
        planName = 'Luxury Home';
        break;
      default:
        planName = 'Custom Package';
    }
    
    const planData = {
      price: price,
      name: planName,
      timestamp: Date.now(),
      source: 'landing_page_hero'
    };
    
    localStorage.setItem('selectedPlanFromLanding', JSON.stringify(planData));
    console.log(`✅ Stored plan in localStorage: ${price} - ${planName}`);
  };

  // Handle Room Trial button click
  const handleRoomTrialClick = () => {
    storeSelectedPlan(499);
    setSelectedPackage(499);
    setIsWizardOpen(true);
  };

  // Handle Complete Home button click
  const handleCompleteHomeClick = () => {
    storeSelectedPlan(4999);
    setSelectedPackage(4999);
    setIsWizardOpen(true);
  };

  // Handle additional plan selections (if you add more buttons later)
  const handlePlanSelect = (price) => {
    storeSelectedPlan(price);
    setSelectedPackage(price);
    setIsWizardOpen(true);
    
    // Call external selectPackage if provided
    if (selectPackage) {
      selectPackage(price);
    }
  };

  // Don't render video with dynamic height until mounted on client
  const videoHeight = !isMounted ? '500px' : (isMobile ? '250px' : '500px');

  return (
    <section id='hero' className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Main Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-3 sm:mb-4 text-balance text-[#1F2937] leading-tight">
          Get Complete Interior Design
          <br />
          <span className="text-[#F97316]">Starting from Just ₹499</span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-center mb-6 sm:mb-8 text-gray-600 max-w-3xl mx-auto px-2">
          48-72-hour delivery • <span className="font-bold text-green-600 bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded animate-pulse-glow relative inline-block text-xs sm:text-sm md:text-base">100% money-back guarantee</span> • No hidden costs
        </p>

        {/* Video showcase - Use consistent height until mounted */}
        <div className="max-w-5xl mx-auto mb-6 sm:mb-8 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl bg-black">
          <video
            className="w-full h-auto"
            style={{
              height: videoHeight,
              objectFit: 'cover'
            }}
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BA-hero-SbLVwzg7KDyOxN8QhV4dnXsy33JHPy.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-10 max-w-4xl mx-auto px-2">
          {/* Room Trial Button */}
          <div className="flex flex-col items-center w-full sm:w-auto">
            <button
              onClick={handleRoomTrialClick}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-purple-600 text-purple-600 rounded-xl text-base sm:text-lg font-semibold hover:bg-purple-50 transition-all shadow-md"
            >
              Start with Single Room - ₹499
            </button>
            <p className="text-xs sm:text-sm text-gray-500 mt-1.5 sm:mt-2">487 families started here</p>
          </div>

          {/* Complete Home Button */}
          <div className="flex flex-col items-center w-full sm:w-auto">
            <button
              onClick={handleCompleteHomeClick}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#FF6B35] text-white rounded-xl font-bold text-base sm:text-lg hover:bg-[#ff7f4d] transition-all shadow-xl"
            >
              Design Complete Home - ₹4,999
            </button>
            <p className="text-xs sm:text-sm text-gray-500 mt-1.5 sm:mt-2">Most popular • Save ₹2,500</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-8 sm:mb-10 p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl sm:rounded-2xl border border-orange-200">
          <div className="text-center mb-3 sm:mb-4">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1F2937] mb-1.5 sm:mb-2">
              💡 Smart Start: <span className="text-[#FF6B35]">₹499</span> Risk-Free Room Trial
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Full refund if not delivered on time • ₹499 credit towards full home design
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center text-gray-700 text-sm sm:text-base">
            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-green-500 text-lg sm:text-xl">✓</span> Full refund if not satisfied
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-green-500 text-lg sm:text-xl">✓</span> ₹499 credit toward full home design
            </span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-2">
          {/* Social Proof Stats */}
          <div className="text-center mb-6 sm:mb-8 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200">
            <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 leading-relaxed">
              🔥 2,847 homes designed this month • 487 tried room design → 445 upgraded to full home design
            </p>
          </div>

          {/* Key Benefits - Single Row */}
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 text-xs sm:text-sm font-medium text-gray-700">
            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-green-500">✓</span> One-time payment
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-green-500">✓</span> 48-72-hour delivery
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-green-500">✓</span> ₹499 credit on upgrade
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-green-500">✓</span> Full refund guarantee
            </span>
          </div>

          {/* Trust Badges - Minimal */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex text-yellow-400 text-sm sm:text-base">⭐⭐⭐⭐⭐</div>
              <span className="text-xs sm:text-sm text-gray-600">4.8 (247 reviews)</span>
            </div>
            <span className="text-xs sm:text-sm text-gray-600">🔒 Secured by Razorpay</span>
            <span className="text-xs sm:text-sm font-bold text-green-600 bg-green-50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full animate-pulse-glow relative inline-block">✓ 100% Money Back</span>
          </div>

          <div className="text-center pt-4 sm:pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2 sm:mb-3 uppercase tracking-wide">As Featured In</p>
            <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 items-center justify-center opacity-60">
              <div className="relative h-4 sm:h-5 w-20 sm:w-28 grayscale">
                <Image src="/media/times-of-india.png" alt="Times of India" fill className="object-contain" />
              </div>
              <div className="relative h-4 sm:h-5 w-20 sm:w-28 grayscale">
                <Image src="/media/economic-times.png" alt="Economic Times" fill className="object-contain" />
              </div>
              <div className="relative h-4 sm:h-5 w-20 sm:w-28 grayscale">
                <Image src="/media/yourstory.png" alt="YourStory" fill className="object-contain" />
              </div>
              <div className="relative h-4 sm:h-5 w-20 sm:w-28 grayscale">
                <Image src="/media/the-hindu.png" alt="The Hindu" fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Planning Wizard Modal */}
      <PlanningWizardModal 
        open={isWizardOpen} 
        onOpenChange={(open) => {
          setIsWizardOpen(open);
          if (!open) {
            setSelectedPackage(null);
          }
        }}
        selectedPackage={selectedPackage}
      />
    </section>
  );
}