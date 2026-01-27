'use client';

import { useEffect, useState } from "react";
import { Flame, ArrowRight, Zap, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlanningWizardModal } from "./PlanningWizardModal";

export const FloatingCountdown = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 29,
    seconds: 59
  });

  const handleClaimOffer = () => {
    localStorage.setItem("discountCode", "HOUSPIRE20");
    localStorage.setItem("discountApplied", "true");
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("countdownCompleted", "true");
  };

  useEffect(() => {
    const countdownCompleted = sessionStorage.getItem("countdownCompleted");
    if (countdownCompleted === "true") {
      setIsVisible(false);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          sessionStorage.setItem("countdownCompleted", "true");
          setIsVisible(false);
          clearInterval(interval);
          return prev;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="lp3-landing fixed bottom-20 right-4 md:bottom-4 md:right-4 z-50 lp3-animate-fade-in w-[260px] md:w-[280px]">
      <Card className="lp3-glass-card shadow-2xl border-2 border-[hsl(var(--lp3-accent)/0.4)] bg-gradient-to-br from-[hsl(var(--lp3-background))] via-[hsl(var(--lp3-background))] to-[hsl(var(--lp3-accent)/0.1)] lp3-hover-lift relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--lp3-primary)/0.05)] to-[hsl(var(--lp3-accent)/0.05)] opacity-0 hover:opacity-100 transition-opacity duration-300" />
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-20 w-5 h-5 rounded-full bg-[hsl(var(--lp3-muted))] hover:bg-[hsl(var(--lp3-destructive))] flex items-center justify-center transition-all duration-200 hover:scale-110 group"
          aria-label="Close countdown"
        >
          <X className="w-3 h-3 text-[hsl(var(--lp3-muted-foreground))] group-hover:text-white transition-colors" />
        </button>
        
        <div className="p-3 space-y-3 relative z-10">
          {/* Header */}
          <div className="flex items-center gap-2 pr-6"> {/* Added pr-6 for close button space */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(var(--lp3-accent)/0.3)] to-[hsl(var(--lp3-primary)/0.3)] flex items-center justify-center lp3-animate-pulse-strong border border-[hsl(var(--lp3-accent)/0.2)]">
              <Flame className="w-4 h-4 text-[hsl(var(--lp3-accent))]" />
            </div>
            <div>
              <p className="text-xs font-black text-[hsl(var(--lp3-foreground))]">Limited Time Offer!</p>
              <p className="text-xs text-[hsl(var(--lp3-muted-foreground))]">Ends in:</p>
            </div>
          </div>

          {/* Countdown Display */}
          <div className="flex items-center justify-center gap-1">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-br from-[hsl(var(--lp3-primary))] to-[hsl(var(--lp3-accent))] rounded-lg px-2 py-2 min-w-[2.8rem] shadow-lg border border-[hsl(var(--lp3-primary)/0.3)]">
                <p className="text-xl font-black text-[hsl(var(--lp3-primary-foreground))] text-center tabular-nums">
                  {String(timeLeft.hours).padStart(2, "0")}
                </p>
              </div>
              <p className="text-xs text-[hsl(var(--lp3-muted-foreground))] mt-1">Hours</p>
            </div>

            {/* Separator */}
            <div className="text-xl font-black text-[hsl(var(--lp3-primary))] pb-5">:</div>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-br from-[hsl(var(--lp3-primary))] to-[hsl(var(--lp3-accent))] rounded-lg px-2 py-2 min-w-[2.8rem] shadow-lg border border-[hsl(var(--lp3-primary)/0.3)]">
                <p className="text-xl font-black text-[hsl(var(--lp3-primary-foreground))] text-center tabular-nums">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </p>
              </div>
              <p className="text-xs text-[hsl(var(--lp3-muted-foreground))] mt-1">Mins</p>
            </div>

            {/* Separator */}
            <div className="text-xl font-black text-[hsl(var(--lp3-primary))] pb-5">:</div>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-br from-[hsl(var(--lp3-primary))] to-[hsl(var(--lp3-accent))] rounded-lg px-2 py-2 min-w-[2.8rem] shadow-lg border border-[hsl(var(--lp3-primary)/0.3)]">
                <p className="text-xl font-black text-[hsl(var(--lp3-primary-foreground))] text-center tabular-nums">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </p>
              </div>
              <p className="text-xs text-[hsl(var(--lp3-muted-foreground))] mt-1">Secs</p>
            </div>
          </div>

          {/* Footer Message */}
          <div className="text-center space-y-2">
            <p className="text-xs font-bold text-[hsl(var(--lp3-accent))]">
              Get 20% OFF on all packages!
            </p>
            <Button
              size="sm"
              onClick={handleClaimOffer}
              className="w-full bg-[hsl(var(--lp3-primary))] hover:bg-[hsl(var(--lp3-primary)/0.9)] text-[hsl(var(--lp3-primary-foreground))] hover:shadow-[0_8px_20px_hsl(var(--lp3-primary)/0.4)] hover:scale-105 transition-all duration-300 text-xs font-bold py-2 group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center">
                Claim Offer Now
                <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--lp3-primary)/0.9)] to-[hsl(var(--lp3-accent)/0.9)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-[hsl(var(--lp3-primary))] rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 lp3-animate-ping" />
      </Card>

      <PlanningWizardModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};