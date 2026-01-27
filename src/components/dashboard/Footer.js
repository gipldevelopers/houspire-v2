// components/Footer.jsx
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-background/80 backdrop-blur-sm py-6 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Left: Logo & Company Info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <Image
                  src="/gipl.png"
                  alt="Gohil Infotech Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">
                  Powered by{" "}
                  <Link
                    href="https://www.gohilinfotech.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
                  >
                    Gohil Infotech
                  </Link>
                </span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  © {currentYear} All rights reserved
                </span>
              </div>
            </div>
          </div>

          {/* Center: Desktop Quick Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/legal/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Privacy & Policy
            </Link>
            <Link
              href="/legal/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/dashboard/support"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Support
            </Link>
            <Link
              href="/legal/disclaimer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Disclaimer
            </Link>
            <Link
              href="/legal/user-limitations"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              User Limitations
            </Link>
          </div>
        </div>

        {/* Mobile Quick Links */}
        <div className="flex md:hidden items-center justify-center gap-4 mt-4 pt-4 border-t border-border flex-wrap">
          <Link
            href="/legal/privacy"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Privacy
          </Link>
          <span className="text-muted-foreground/50">|</span>
          <Link
            href="/legal/terms"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Terms
          </Link>
          <span className="text-muted-foreground/50">|</span>
          <Link
            href="/legal/disclaimer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Disclaimer
          </Link>
          <span className="text-muted-foreground/50">|</span>
          <Link
            href="/legal/user-limitations"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Limits
          </Link>
          <span className="text-muted-foreground/50">|</span>
          <Link
            href="/dashboard/support"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
}