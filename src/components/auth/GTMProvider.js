// components/GTMProvider.js
'use client';

import { useEffect } from 'react';

export default function GTMProvider({ children }) {
  useEffect(() => {
    // Skip GTM in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('[GTMProvider] Disabled in development mode');
      // Still create an empty dataLayer to prevent errors from code that expects it
      window.dataLayer = window.dataLayer || [];
      return;
    }

    // Ensure dataLayer exists
    window.dataLayer = window.dataLayer || [];
    
    // Initialize GTM (if not already initialized)
    if (!window.gtmInitialized) {
      const script = document.createElement('script');
      script.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
      `;
      document.head.appendChild(script);
      window.gtmInitialized = true;
    }
  }, []);

  return children;
}