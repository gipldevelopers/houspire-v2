// // src/app/lp3/components/WhatsAppBubble.js
// 'use client';

// import { useState, useEffect } from 'react';
// import { MessageCircle, X } from 'lucide-react';

// export const WhatsAppBubble = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const [hasInteracted, setHasInteracted] = useState(false);

//   useEffect(() => {
//     // Show bubble after 3 seconds
//     const timer = setTimeout(() => {
//       setIsVisible(true);
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, []);

//   const handleWhatsAppClick = () => {
//     // Open WhatsApp with a pre-filled message
//     const phoneNumber = '917075827625';
//     const message = encodeURIComponent("Hi, I'm interested in Houspire's interior design services. Can you help me get started?");
//     window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    
//     // Track interaction
//     setHasInteracted(true);
//     setIsOpen(false);
//   };

//   const handleClose = () => {
//     setIsOpen(false);
//     setHasInteracted(true);
//     setIsVisible(false);
    
//     // Hide permanently for 24 hours
//     localStorage.setItem('whatsappBubbleHidden', new Date().getTime());
//   };

//   if (!isVisible) return null;

//   return (
//     <>
//       {/* Main WhatsApp Bubble */}
//       <div className="fixed bottom-6 right-6 z-50">
//         {!isOpen ? (
//           <button
//             onClick={() => setIsOpen(true)}
//             className="group relative"
//             aria-label="Chat on WhatsApp"
//           >
//             {/* Outer glow effect */}
//             <div className="absolute -inset-4 bg-green-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
            
//             {/* Main bubble */}
//             <div className="relative bg-gradient-to-br from-green-500 to-green-600 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl hover:shadow-green-500/40 transition-all duration-300 hover:scale-110 group">
//               <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full opacity-90 group-hover:opacity-100 transition-opacity" />
//               <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-white relative z-10" />
              
//               {/* Notification dot */}
//               {!hasInteracted && (
//                 <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping" />
//               )}
//             </div>
            
//             {/* Tooltip */}
//             <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
//               Chat with us
//               <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
//             </div>
//           </button>
//         ) : (
//           // Expanded WhatsApp Panel
//           <div className="relative animate-in slide-in-from-bottom-5 duration-300">
//             {/* Panel */}
//             <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-5 w-80 md:w-96 border border-green-200">
//               {/* Header */}
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
//                     <MessageCircle className="w-5 h-5 text-white" />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-gray-900 text-sm md:text-base">Chat with Houspire</h3>
//                     <p className="text-xs text-green-600 font-medium flex items-center gap-1">
//                       <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
//                       Online now
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={handleClose}
//                   className="text-gray-400 hover:text-gray-600 transition-colors p-1"
//                   aria-label="Close chat"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               {/* Message Preview */}
//               <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
//                 <p className="text-xs text-gray-600 mb-2">Typing...</p>
//                 <div className="flex items-start gap-2">
//                   <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0">
//                     <span className="text-xs font-bold text-green-700">H</span>
//                   </div>
//                   <div className="flex-1">
//                     <div className="bg-white p-2 rounded-lg border border-green-200">
//                       <p className="text-sm text-gray-700">Hi! Need help choosing the right package? I can guide you through our interior design options! 🏠</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Quick Actions */}
//               <div className="space-y-2 mb-4">
//                 <p className="text-xs font-medium text-gray-500">Quick questions:</p>
//                 <div className="flex flex-wrap gap-2">
//                   {[
//                     "What's the difference between packages?",
//                     "How long does delivery take?",
//                     "Can I see examples?",
//                     "What if I'm not satisfied?"
//                   ].map((question, index) => (
//                     <button
//                       key={index}
//                       onClick={() => {
//                         const encodedQuestion = encodeURIComponent(question);
//                         window.open(`https://wa.me/917075827625?text=${encodedQuestion}`, '_blank');
//                         setIsOpen(false);
//                       }}
//                       className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors duration-200"
//                     >
//                       {question}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* CTA Button */}
//               <button
//                 onClick={handleWhatsAppClick}
//                 className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
//               >
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411" />
//                 </svg>
//                 <span>Start Chat on WhatsApp</span>
//               </button>

//               {/* Footer note */}
//               <p className="text-xs text-gray-500 text-center mt-3">
//                 Typically replies within few minutes
//               </p>
//             </div>

//             {/* Arrow pointing to bubble */}
//             <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white transform rotate-45 border-r border-b border-green-200" />
//           </div>
//         )}
//       </div>

//       {/* Mobile WhatsApp Bar (Alternative for very small screens) */}
//       <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-40 shadow-lg">
//         <button
//           onClick={handleWhatsAppClick}
//           className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
//         >
//           <MessageCircle className="w-5 h-5" />
//           <span>Chat on WhatsApp</span>
//         </button>
//       </div>
//     </>
//   );
// };

// src/app/lp3/components/WhatsAppBubble.js
'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Show bubble after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleWhatsAppClick = () => {
    // Open WhatsApp with a pre-filled message
    const phoneNumber = '917075827625';
    const message = encodeURIComponent("Hi, I'm interested in Houspire's interior design services. Can you help me get started?");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    
    // Track interaction
    setHasInteracted(true);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setHasInteracted(true);
    setIsVisible(false);
    
    // Hide permanently for 24 hours
    localStorage.setItem('whatsappBubbleHidden', new Date().getTime());
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Main WhatsApp Bubble */}
      <div className={`fixed ${isMobile ? 'bottom-4 right-4' : 'bottom-6 right-6'} z-50`}>
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative"
            aria-label="Chat on WhatsApp"
          >
            {/* Outer glow effect */}
            <div className="absolute -inset-4 bg-green-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
            
            {/* Main bubble */}
            <div className="relative bg-gradient-to-br from-green-500 to-green-600 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl hover:shadow-green-500/40 transition-all duration-300 hover:scale-110 group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full opacity-90 group-hover:opacity-100 transition-opacity" />
              <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-white relative z-10" />
              
              {/* Notification dot */}
              {!hasInteracted && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping" />
              )}
            </div>
            
            {/* Tooltip - Desktop only */}
            {!isMobile && (
              <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                Chat with us
                <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
              </div>
            )}
          </button>
        ) : (
          // Expanded WhatsApp Panel
          <div className="relative animate-in slide-in-from-bottom-5 duration-300">
            {/* Panel */}
            <div className={`bg-white rounded-2xl shadow-2xl p-4 ${isMobile ? 'w-72' : 'w-80 md:w-96'} border border-green-200`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm md:text-base">Chat with Houspire</h3>
                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Online now
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Message Preview */}
              <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
                <p className="text-xs text-gray-600 mb-2">Typing...</p>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-green-700">H</span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-white p-2 rounded-lg border border-green-200">
                      <p className="text-sm text-gray-700">Hi! Need help choosing the right package? I can guide you through our interior design options! 🏠</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions - Desktop only */}
              {!isMobile && (
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-medium text-gray-500">Quick questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "What's the difference between packages?",
                      "How long does delivery take?",
                      "Can I see examples?",
                      "What if I'm not satisfied?"
                    ].map((question, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          const encodedQuestion = encodeURIComponent(question);
                          window.open(`https://wa.me/917075827625?text=${encodedQuestion}`, '_blank');
                          setIsOpen(false);
                        }}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors duration-200"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Button */}
              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411" />
                </svg>
                <span>{isMobile ? 'WhatsApp' : 'Start Chat on WhatsApp'}</span>
              </button>

              {/* Footer note */}
              <p className="text-xs text-gray-500 text-center mt-3">
                Typically replies within few minutes
              </p>
            </div>

            {/* Arrow pointing to bubble */}
            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white transform rotate-45 border-r border-b border-green-200" />
          </div>
        )}
      </div>
    </>
  );
};