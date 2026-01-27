// src\app\lp3\components\Header.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn } from "lucide-react";
import { PlanningWizardModal } from "./PlanningWizardModal";
import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const router = useRouter();

  const handleAuthAction = () => {
    router.push("/auth/signin");
  };

  const menuItems = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "What You Get", href: "#deliverables" },
    { label: "Pricing", href: "#pricing" },
    { label: "Reviews", href: "#testimonials" },
  ];

  return (
    <>
      <header className="lp3-landing fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/90 border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo with Image */}
            <a href="/" className="flex items-center group">
              <div className="h-8 md:h-10 w-auto group-hover:scale-110 transition-transform duration-300 flex items-center">
                <div className="relative w-32 h-8 md:w-40 md:h-10">
                  <Image
                    src="/logo_final.svg"
                    alt="Houspire"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </a>

            {/* Desktop Navigation with Enhanced Animations */}
            <nav className="hidden md:flex items-center gap-8">
              {menuItems.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="relative group py-2"
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <span
                    className={`text-sm font-semibold transition-all duration-500 relative z-10 ${
                      hoveredItem === index
                        ? "text-[hsl(var(--lp3-primary))] transform scale-105"
                        : "text-gray-800 hover:text-[hsl(var(--lp3-primary))]"
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Enhanced Hover Animation - Multiple Effects */}
                  <div className="absolute inset-0 overflow-hidden rounded-lg">
                  </div>

                  {/* Animated Underline - Only visible on hover */}
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-[hsl(var(--lp3-primary))] to-[hsl(var(--lp3-accent))] transition-all duration-700 ease-out transform ${
                        hoveredItem === index
                          ? "translate-x-0"
                          : "-translate-x-full"
                      }`}
                    />
                  </div>

                </a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              {/* Sign In Button */}
              <Button
                variant="outline"
                onClick={handleAuthAction}
                className="gap-2 group relative overflow-hidden transition-all duration-300 hover:border-[hsl(var(--lp3-primary))] hover:text-white lp3-hover-glow px-4"
              >
                <LogIn className="w-4 h-4 transition-all duration-300 group-hover:scale-110" />
                <span>Sign In</span>
                <div className="absolute inset-0 bg-[hsl(var(--lp3-primary)/0)] group-hover:bg-[hsl(var(--lp3-primary)/0.05)] rounded-md transition-all duration-300" />
              </Button>

              {/* Get Started Button */}
              <Button
                className="bg-[hsl(var(--lp3-primary))] hover:shadow-[0_10px_40px_hsl(var(--lp3-primary)/0.4)] hover:scale-105 transition-all duration-300 lp3-animate-pulse-strong group relative overflow-hidden text-[hsl(var(--lp3-primary-foreground))] px-6"
                onClick={() => setIsModalOpen(true)}
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--lp3-primary)/0.9)] to-[hsl(var(--lp3-accent)/0.9)] opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-800 hover:text-[hsl(var(--lp3-primary))] transition-colors duration-300 relative group lp3-hover-glow"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 transition-all duration-300 group-hover:scale-110" />
                ) : (
                  <Menu className="w-6 h-6 transition-all duration-300 group-hover:scale-110" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="md:hidden py-4 border-t border-gray-200 bg-white lp3-glass-card">
              <div className="flex flex-col gap-3">
                {menuItems.map((item, index) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm font-semibold text-gray-800 hover:text-[hsl(var(--lp3-primary))] transition-all duration-300 py-3 px-4 rounded-lg hover:bg-[hsl(var(--lp3-primary)/0.05)] group relative overflow-hidden"
                  >
                    <span className="relative z-10">{item.label}</span>

                    {/* Mobile Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--lp3-primary)/0.1)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Left Border Indicator */}
                    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[hsl(var(--lp3-primary))] to-[hsl(var(--lp3-accent))] transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
                  </a>
                ))}
                <div className="flex flex-col gap-2 px-4 pt-4 border-t border-gray-200">
                  <Button
                    className="w-full bg-[hsl(var(--lp3-primary))] hover:shadow-[0_8px_25px_hsl(var(--lp3-primary)/0.3)] hover:scale-105 transition-all duration-300 lp3-animate-pulse-strong group relative overflow-hidden text-[hsl(var(--lp3-primary-foreground))] py-3"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsModalOpen(true);
                    }}
                  >
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--lp3-primary)/0.9)] to-[hsl(var(--lp3-accent)/0.9)] opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full hover:border-[hsl(var(--lp3-primary))] hover:text-[hsl(var(--lp3-primary))] transition-all duration-300 group lp3-hover-glow py-3"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleAuthAction();
                    }}
                  >
                    <LogIn className="w-4 h-4 mr-2 transition-all duration-300 group-hover:scale-110" />
                    <span>Sign In</span>
                  </Button>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>
      <PlanningWizardModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};