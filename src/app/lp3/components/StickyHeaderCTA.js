// // src\app\lp3\components\StickyHeaderCTA.js
// 'use client';

// import { useState } from "react";

// export const StickyHeaderCTA = () => {
//   const [showTopBar, setShowTopBar] = useState(true);

//   return (
//     <>
//       {showTopBar && (
//         <div className="fixed top-16 md:top-20 left-0 right-0 z-40 bg-[#FF6B35] text-white text-center py-2.5 px-4 shadow-lg">
//           <div className="max-w-7xl mx-auto relative">
//             <p className="text-xs sm:text-sm md:text-base font-medium">
//               🔥 2,847 Indian Homes Designed This Month • Your Turn!
//             </p>
//             <button
//               onClick={() => setShowTopBar(false)}
//               className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:opacity-80 text-xl font-bold transition-opacity w-6 h-6 flex items-center justify-center"
//               aria-label="Close banner"
//             >
//               ×
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// src\app\lp3\components\StickyHeaderCTA.js
'use client';

import { useState } from "react";

export const StickyHeaderCTA = () => {
  const [showTopBar, setShowTopBar] = useState(true);

  return (
    <>
      {showTopBar && (
        <div className="fixed top-16 md:top-20 left-0 right-0 z-40 bg-[#FF6B35] text-white text-center py-2.5 px-4 shadow-lg">
          <div className="max-w-7xl mx-auto relative">
            <div className="pr-8 sm:pr-10 md:pr-12"> {/* Add padding to prevent text overlap */}
              <p className="text-xs sm:text-sm md:text-base font-medium">
                🔥 2,847 Indian Homes Designed This Month • Your Turn!
              </p>
            </div>
            <button
              onClick={() => setShowTopBar(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:opacity-80 text-xl font-bold transition-opacity w-6 h-6 flex items-center justify-center"
              aria-label="Close banner"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};