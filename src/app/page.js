// // src/app/page.js
// 'use client';

// import { useState, useEffect } from 'react';
// import { Suspense } from 'react';
// import { Header } from './lp3/components/Header';
// import { HeroSection } from './lp3/components/HeroSection';
// import { PricingSection } from './lp3/components/pricing-section';
// import { FAQSection } from './lp3/components/FAQSection';
// import { Footer } from './lp3/components/Footer';
// import { StickyHeaderCTA } from './lp3/components/StickyHeaderCTA';
// // import { StickyBottomCTA } from './lp3/components/StickyBottomCTA';
// import { PlanningWizardModal } from './lp3/components/PlanningWizardModal';
// import { ProblemSection } from './lp3/components/problem-section';
// import { SolutionSection } from './lp3/components/solution-section';
// import { DeliverableSection } from './lp3/components/deliverable-section';
// import { HowItWorksSection } from './lp3/components/how-it-works-section';
// import { YourNeighbourSection } from './lp3/components/your-neighbour-section';
// import { TestimonialsSection } from './lp3/components/testinominal-section';
// // import { ExitIntentPopup } from './lp3/components/popups/ExitIntentPopup';
// // import { DiscountPopup } from './lp3/components/popups/DiscountPopup';
// // import { SocialProofPopup } from './lp3/components/popups/SocialProofPopup';
// import { WhatsAppBubble } from './lp3/components/WhatsAppBubble';
// import { X } from 'lucide-react';


// // Component that uses useSearchParams wrapped in Suspense
// function HomePageContent() {
//   const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
//   const [isWizardOpen, setIsWizardOpen] = useState(false);
//   const [selectedPackage, setSelectedPackage] = useState(null);
//   const [showNotification, setShowNotification] = useState(false);
//   const [currentNotification, setCurrentNotification] = useState(0);
//   const [isFadingOut, setIsFadingOut] = useState(false);
//   const [showExitPopup, setShowExitPopup] = useState(false);
//   const [showDiscountPopup, setShowDiscountPopup] = useState(false);
//   const [showSocialProofPopup, setShowSocialProofPopup] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   const notifications = [
//     "Ritu from Bangalore saved ₹87,000 with Starter",
//     "23 people chose ₹4,999 package today",
//     "Karan from Mumbai just started",
//     "6 packages delivered today"
//   ];

//   // Check if mobile on mount
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
    
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   useEffect(() => {
//     // Check for wizard parameter
//     const urlParams = new URLSearchParams(window.location.search);
//     if (urlParams.get('openWizard') === 'true') {
//       setIsWizardOpen(true);
//     }
//   }, []);

//   useEffect(() => {
//     const hasEmail = localStorage.getItem("userEmail");
//     const urlParams = new URLSearchParams(window.location.search);
//     const shouldOpenWizard = urlParams.get('openWizard') === 'true';

//     if (!hasEmail && !shouldOpenWizard && !isWizardOpen) {
//       const timer = setTimeout(() => {
//         setIsLeadModalOpen(true);
//       }, 5000);

//       return () => clearTimeout(timer);
//     }
//   }, [isWizardOpen]);

//   useEffect(() => {
//     // Show discount popup after 5 seconds
//     const discountTimer = setTimeout(() => {
//       setShowDiscountPopup(true);
//     }, 5000);

//     return () => clearTimeout(discountTimer);
//   }, []);

//   useEffect(() => {
//     // Check if user has already seen the popups today
//     const today = new Date().toDateString();
//     const lastPopupDate = localStorage.getItem('lastPopupDate');
    
//     // Reset popup tracking if it's a new day
//     if (lastPopupDate !== today) {
//       localStorage.setItem('lastPopupDate', today);
//       localStorage.removeItem('exitPopupShown');
//       localStorage.removeItem('socialProofPopupShown');
//     }

//     // Show social proof popup after user scrolls 50%
//     const handleScroll = () => {
//       const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
//       const hasSeenSocialProof = localStorage.getItem('socialProofPopupShown');
      
//       if (scrollPercent > 50 && !hasSeenSocialProof && !showSocialProofPopup) {
//         setShowSocialProofPopup(true);
//         localStorage.setItem('socialProofPopupShown', 'true');
//         window.removeEventListener('scroll', handleScroll);
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [showSocialProofPopup]);

//   useEffect(() => {
//     // Only show notifications on desktop
//     if (isMobile) return;

//     let interval;
//     let fadeTimer;
//     let hideTimer;

//     const showNextNotification = () => {
//       setCurrentNotification(prev => (prev + 1) % notifications.length);
//       setShowNotification(true);
//       setIsFadingOut(false);

//       // Start fade out after 3 seconds of display
//       fadeTimer = setTimeout(() => {
//         setIsFadingOut(true);
//         // Hide completely after fade animation
//         hideTimer = setTimeout(() => {
//           setShowNotification(false);
//         }, 500);
//       }, 1500);
//     };

//     // Show first notification after 5 seconds
//     const initialTimer = setTimeout(() => {
//       showNextNotification();
      
//       // Then set interval for subsequent notifications
//       interval = setInterval(() => {
//         showNextNotification();
//       }, 10000);
//     }, 5000);

//     return () => {
//       clearTimeout(initialTimer);
//       clearInterval(interval);
//       clearTimeout(fadeTimer);
//       clearTimeout(hideTimer);
//     };
//   }, [notifications.length, isMobile]);

//   const handleCloseNotification = () => {
//     setIsFadingOut(true);
//     setTimeout(() => {
//       setShowNotification(false);
//       setIsFadingOut(false);
//     }, 300);
//   };

//   const handleNotificationClick = () => {
//     setIsWizardOpen(true);
//     handleCloseNotification();
//   };

//   const handlePackageSelect = (price) => {
//     setSelectedPackage(price);
//     setIsWizardOpen(true);
    
//     // Close all popups when a package is selected
//     setShowExitPopup(false);
//     setShowDiscountPopup(false);
//     setShowSocialProofPopup(false);
//   };

//   return (
//     <div className="min-h-screen">
     
//       <Header />
//       <StickyHeaderCTA />
//       <div className="pt-24 sm:pt-28 md:pt-32">
//         <HeroSection />
//         <ProblemSection />
//         <SolutionSection />
//         <DeliverableSection />
//         {/* <HowItWorksSection /> */}
//         <YourNeighbourSection />
//         <PricingSection
//           onPackageSelect={handlePackageSelect}
//         />
//         <TestimonialsSection />
//         <FAQSection />
//       </div>
//       <Footer />

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
      
//       {/* <StickyBottomCTA onPackageSelect={handlePackageSelect} /> */}
      
//       {/* WhatsApp Bubble */}
//       <WhatsAppBubble />

//       {/* Exit Intent Popup */}
//       {showExitPopup && (
//         <ExitIntentPopup
//           onClose={() => {
//             setShowExitPopup(false);
//             localStorage.setItem('exitPopupShown', 'true');
//           }}
//           onPackageSelect={handlePackageSelect}
//           isMobile={isMobile}
//         />
//       )}

//       {/* Discount Popup */}
//       {showDiscountPopup && (
//         <DiscountPopup
//           onClose={() => setShowDiscountPopup(false)}
//           onPackageSelect={handlePackageSelect}
//           isMobile={isMobile}
//         />
//       )}

//       {/* Social Proof Popup */}
//       {showSocialProofPopup && (
//         <SocialProofPopup
//           onClose={() => setShowSocialProofPopup(false)}
//           onPackageSelect={handlePackageSelect}
//           isMobile={isMobile}
//         />
//       )}

//       {/* Enhanced Notification Component - Bottom Left (Desktop only) */}
//       {!isMobile && showNotification && (
//         <div 
//           className={`fixed bottom-6 left-4 z-50 transition-all duration-500 ease-in-out ${
//             isFadingOut ? 'opacity-0 translate-x-[-20px]' : 'opacity-100 translate-x-0'
//           }`}
//         >
//           <div className="relative group">
//             <div 
//               className="bg-white rounded-lg shadow-2xl border border-purple-200 px-4 py-3 max-w-sm cursor-pointer hover:shadow-purple-300/30 transition-shadow duration-300"
//               onClick={handleNotificationClick}
//             >
//               <div className="flex items-center gap-3">
//                 {/* Notification indicator */}
//                 <div className="flex-shrink-0">
//                   <div className="relative">
//                     <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
//                       <div className="w-4 h-4 bg-purple-600 rounded-full animate-pulse"></div>
//                     </div>
//                     <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//                   </div>
//                 </div>
                
//                 {/* Notification text */}
//                 <div className="flex-1">
//                   <p className="text-xs text-gray-500 mb-0.5">Live Update</p>
//                   <p className="text-sm font-medium text-gray-800">{notifications[currentNotification]}</p>
//                 </div>
//               </div>
              
//               {/* Progress bar */}
//               <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
//                 <div 
//                   className={`h-full bg-purple-600 transition-all duration-3000 ease-linear ${
//                     isFadingOut ? 'w-0' : 'w-full'
//                   }`}
//                 />
//               </div>
//             </div>
            
//             {/* Close button */}
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleCloseNotification();
//               }}
//               className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-900 shadow-lg"
//               aria-label="Close notification"
//             >
//               <X className="w-3 h-3" />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Main page component with Suspense boundary
// export default function HomePage() {
//   return (
//     <Suspense fallback={
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     }>
//       <HomePageContent />
//     </Suspense>
//   );
// }

// // src/app/page.js
// 'use client';

// import { useState, useEffect } from 'react';
// import { Suspense } from 'react';
// import { Header } from './lp3/components/Header';
// import { HeroSection } from './lp3/components/HeroSection';
// import { PricingSection } from './lp3/components/pricing-section';
// import { FAQSection } from './lp3/components/FAQSection';
// import { Footer } from './lp3/components/Footer';
// import { StickyHeaderCTA } from './lp3/components/StickyHeaderCTA';
// // import { StickyBottomCTA } from './lp3/components/StickyBottomCTA';
// import { PlanningWizardModal } from './lp3/components/PlanningWizardModal';
// import { ProblemSection } from './lp3/components/problem-section';
// import { SolutionSection } from './lp3/components/solution-section';
// import { DeliverableSection } from './lp3/components/deliverable-section';
// import { HowItWorksSection } from './lp3/components/how-it-works-section';
// import { YourNeighbourSection } from './lp3/components/your-neighbour-section';
// import { TestimonialsSection } from './lp3/components/testinominal-section';
// import { WhatsAppBubble } from './lp3/components/WhatsAppBubble';
// import { X } from 'lucide-react';

// // Component that uses useSearchParams wrapped in Suspense
// function HomePageContent() {
//   const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
//   const [isWizardOpen, setIsWizardOpen] = useState(false);
//   const [selectedPackage, setSelectedPackage] = useState(null);
//   const [showNotification, setShowNotification] = useState(false);
//   const [currentNotification, setCurrentNotification] = useState(0);
//   const [isFadingOut, setIsFadingOut] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   const notifications = [
//     "Ritu from Bangalore saved ₹87,000 with Starter",
//     "23 people chose ₹4,999 package today",
//     "Karan from Mumbai just started",
//     "6 packages delivered today"
//   ];

//   // Check if mobile on mount
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
    
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   useEffect(() => {
//     // Check for wizard parameter
//     const urlParams = new URLSearchParams(window.location.search);
//     if (urlParams.get('openWizard') === 'true') {
//       setIsWizardOpen(true);
//     }
//   }, []);

//   useEffect(() => {
//     const hasEmail = localStorage.getItem("userEmail");
//     const urlParams = new URLSearchParams(window.location.search);
//     const shouldOpenWizard = urlParams.get('openWizard') === 'true';

//     if (!hasEmail && !shouldOpenWizard && !isWizardOpen) {
//       const timer = setTimeout(() => {
//         setIsLeadModalOpen(true);
//       }, 5000);

//       return () => clearTimeout(timer);
//     }
//   }, [isWizardOpen]);

//   useEffect(() => {
//     // Only show notifications on desktop
//     if (isMobile) return;

//     let interval;
//     let fadeTimer;
//     let hideTimer;

//     const showNextNotification = () => {
//       setCurrentNotification(prev => (prev + 1) % notifications.length);
//       setShowNotification(true);
//       setIsFadingOut(false);

//       // Start fade out after 3 seconds of display
//       fadeTimer = setTimeout(() => {
//         setIsFadingOut(true);
//         // Hide completely after fade animation
//         hideTimer = setTimeout(() => {
//           setShowNotification(false);
//         }, 500);
//       }, 1500);
//     };

//     // Show first notification after 5 seconds
//     const initialTimer = setTimeout(() => {
//       showNextNotification();
      
//       // Then set interval for subsequent notifications
//       interval = setInterval(() => {
//         showNextNotification();
//       }, 10000);
//     }, 5000);

//     return () => {
//       clearTimeout(initialTimer);
//       clearInterval(interval);
//       clearTimeout(fadeTimer);
//       clearTimeout(hideTimer);
//     };
//   }, [notifications.length, isMobile]);

//   const handleCloseNotification = () => {
//     setIsFadingOut(true);
//     setTimeout(() => {
//       setShowNotification(false);
//       setIsFadingOut(false);
//     }, 300);
//   };

//   const handleNotificationClick = () => {
//     setIsWizardOpen(true);
//     handleCloseNotification();
//   };

//   const handlePackageSelect = (price) => {
//     setSelectedPackage(price);
//     setIsWizardOpen(true);
//   };

//   return (
//     <div className="min-h-screen">
     
//       <Header />
//       <StickyHeaderCTA />
//       <div className="pt-24 sm:pt-28 md:pt-32">
//         <HeroSection />
//         <ProblemSection />
//         <SolutionSection />
//         <DeliverableSection />
//         {/* <HowItWorksSection /> */}
//         <YourNeighbourSection />
//         <PricingSection
//           onPackageSelect={handlePackageSelect}
//         />
//         <TestimonialsSection />
//         <FAQSection />
//       </div>
//       <Footer />

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
      
//       {/* <StickyBottomCTA onPackageSelect={handlePackageSelect} /> */}
      
//       {/* WhatsApp Bubble */}
//       <WhatsAppBubble />

//       {/* Enhanced Notification Component - Bottom Left (Desktop only) */}
//       {!isMobile && showNotification && (
//         <div 
//           className={`fixed bottom-6 left-4 z-50 transition-all duration-500 ease-in-out ${
//             isFadingOut ? 'opacity-0 translate-x-[-20px]' : 'opacity-100 translate-x-0'
//           }`}
//         >
//           <div className="relative group">
//             <div 
//               className="bg-white rounded-lg shadow-2xl border border-purple-200 px-4 py-3 max-w-sm cursor-pointer hover:shadow-purple-300/30 transition-shadow duration-300"
//               onClick={handleNotificationClick}
//             >
//               <div className="flex items-center gap-3">
//                 {/* Notification indicator */}
//                 <div className="flex-shrink-0">
//                   <div className="relative">
//                     <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
//                       <div className="w-4 h-4 bg-purple-600 rounded-full animate-pulse"></div>
//                     </div>
//                     <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//                   </div>
//                 </div>
                
//                 {/* Notification text */}
//                 <div className="flex-1">
//                   <p className="text-xs text-gray-500 mb-0.5">Live Update</p>
//                   <p className="text-sm font-medium text-gray-800">{notifications[currentNotification]}</p>
//                 </div>
//               </div>
              
//               {/* Progress bar */}
//               <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
//                 <div 
//                   className={`h-full bg-purple-600 transition-all duration-3000 ease-linear ${
//                     isFadingOut ? 'w-0' : 'w-full'
//                   }`}
//                 />
//               </div>
//             </div>
            
//             {/* Close button */}
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleCloseNotification();
//               }}
//               className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-900 shadow-lg"
//               aria-label="Close notification"
//             >
//               <X className="w-3 h-3" />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Main page component with Suspense boundary
// export default function HomePage() {
//   return (
//     <Suspense fallback={
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     }>
//       <HomePageContent />
//     </Suspense>
//   );
// }

// src/app/page.js
'use client';

import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import { Header } from './lp3/components/Header';
import { HeroSection } from './lp3/components/HeroSection';
import { PricingSection } from './lp3/components/pricing-section';
import { FAQSection } from './lp3/components/FAQSection';
import { Footer } from './lp3/components/Footer';
import { StickyHeaderCTA } from './lp3/components/StickyHeaderCTA';
// import { StickyBottomCTA } from './lp3/components/StickyBottomCTA';
import { PlanningWizardModal } from './lp3/components/PlanningWizardModal';
import { ProblemSection } from './lp3/components/problem-section';
import { SolutionSection } from './lp3/components/solution-section';
import { DeliverableSection } from './lp3/components/deliverable-section';
import { HowItWorksSection } from './lp3/components/how-it-works-section';
import { YourNeighbourSection } from './lp3/components/your-neighbour-section';
import { TestimonialsSection } from './lp3/components/testinominal-section';
import { WhatsAppBubble } from './lp3/components/WhatsAppBubble';

// Component that uses useSearchParams wrapped in Suspense
function HomePageContent() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    // Check for wizard parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('openWizard') === 'true') {
      setIsWizardOpen(true);
    }
  }, []);

  useEffect(() => {
    const hasEmail = localStorage.getItem("userEmail");
    const urlParams = new URLSearchParams(window.location.search);
    const shouldOpenWizard = urlParams.get('openWizard') === 'true';

    if (!hasEmail && !shouldOpenWizard && !isWizardOpen) {
      const timer = setTimeout(() => {
        setIsLeadModalOpen(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isWizardOpen]);

  const handlePackageSelect = (price) => {
    setSelectedPackage(price);
    setIsWizardOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <StickyHeaderCTA />
      <div className="pt-24 sm:pt-28 md:pt-32">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <DeliverableSection />
        {/* <HowItWorksSection /> */}
        <YourNeighbourSection />
        <PricingSection
          onPackageSelect={handlePackageSelect}
        />
        <TestimonialsSection />
        <FAQSection />
      </div>
      <Footer />

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
      
      {/* <StickyBottomCTA onPackageSelect={handlePackageSelect} /> */}
      
      {/* WhatsApp Bubble */}
      <WhatsAppBubble />
    </div>
  );
}

// Main page component with Suspense boundary
export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}