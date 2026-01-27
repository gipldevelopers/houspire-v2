// src\app\layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./lp3/lp3-styles.css";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import GoogleAuthProvider from "@/components/auth/GoogleOAuthProvider";
import { TourProvider } from "@/context/TourContext";
import Script from "next/script";
import GoogleOneTapAuto from "@/components/auth/GoogleOneTapAutoV2";
import GTMProvider from "@/components/auth/GTMProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Houspire – India's First Transparent Interior Design Platform",
  description:
    "Plan, visualize & execute your interior projects with powered budgeting, 3D designs & verified contractors. Houspire brings transparency to home interiors.",
  keywords: [
    "interior design",
    "home renovation",
    "Indian interior platform",
    "3D home design",
    "home decor",
    "budget estimation interiors",
    "interior contractors India",
    "modern interiors",
    "Houspire",
  ],
  authors: [{ name: "Houspire" }],
  publisher: "Houspire",
  robots: "index, follow",
  metadataBase: new URL("https://houspire.ai"),
  openGraph: {
    title:
      "Houspire – India's First Transparent Powered Interior Design Platform",
    description:
      "powered interior design, instant budgeting, 3D project visualization & verified execution partners.",
    url: "https://houspire.ai",
    siteName: "Houspire",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Houspire – Transparent Interior Design Platform",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Houspire – Powered Interior Design Platform",
    description:
      "Plan & visualize your interiors with budgeting, 3D design & reliable contractors.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

// Check if we're in production mode
const isProduction = process.env.NODE_ENV === 'production';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google One Tap Script - Only load in production */}
        {isProduction && (
          <Script
            src="https://accounts.google.com/gsi/client"
            strategy="afterInteractive"
          />
        )}

        {/* Google Tag Manager Script - Only load in production */}
        {isProduction && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-W9Z8CLS9');`,
            }}
          />
        )}

        {/* Microsoft Clarity Tracking Code - Only load in production */}
        {isProduction && (
          <Script
            id="microsoft-clarity"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "v3xycqdwhd");
              `,
            }}
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) - Only load in production */}
        {isProduction && (
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-W9Z8CLS9"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}

        <ThemeProvider>
          <GoogleAuthProvider>
            <GTMProvider>
              <AuthProvider>
                {/* Google One Tap - Only render in production */}
                {isProduction && <GoogleOneTapAuto />}
                <TourProvider>
                  {children}
                  <Toaster position="top-right" richColors />
                </TourProvider>
              </AuthProvider>
            </GTMProvider>
          </GoogleAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
