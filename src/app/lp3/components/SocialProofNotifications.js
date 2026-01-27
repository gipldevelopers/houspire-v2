'use client';

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Sparkles, MapPin, Clock } from "lucide-react";

export const SocialProofNotifications = () => {
  const [currentNotification, setCurrentNotification] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const names = [
    "Priya S.", "Rahul M.", "Anjali K.", "Vikram P.", "Neha R.",
    "Arjun D.", "Meera B.", "Karthik V.", "Divya N.", "Sanjay T."
  ];

  const locations = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
    "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow"
  ];

  const services = [
    { name: "Essential Plan", savings: "₹45,000", icon: "🏠" },
    { name: "Premium Plan", savings: "₹78,000", icon: "✨" },
    { name: "Luxury Plan", savings: "₹1.2L", icon: "🌟" },
    { name: "3D Renders Add-on", savings: "₹15,000", icon: "🎨" },
    { name: "Fast-Track Delivery", savings: "₹20,000", icon: "⚡" }
  ];

  const timeFrames = [
    "Just now",
    "2 minutes ago",
    "5 minutes ago",
    "7 minutes ago",
    "10 minutes ago"
  ];

  const generateRandomNotification = () => {
    const service = services[Math.floor(Math.random() * services.length)];
    return {
      name: names[Math.floor(Math.random() * names.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      service: service.name,
      savings: service.savings,
      icon: service.icon,
      timeAgo: timeFrames[Math.floor(Math.random() * timeFrames.length)],
      id: Date.now()
    };
  };

  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      setCurrentNotification(generateRandomNotification());
      setIsVisible(true);
      setNotificationCount(1);
    }, 3000);

    const notificationInterval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentNotification(generateRandomNotification());
        setIsVisible(true);
        setNotificationCount(prev => prev + 1);
      }, 500);
    }, 8000); // Reduced interval for more frequent updates

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(notificationInterval);
    };
  }, []);

  if (!currentNotification) return null;

  return (
    <div className="lp3-landing">
      <div
        className={`fixed bottom-4 left-4 z-45 max-w-[calc(100vw-2rem)] sm:max-w-sm transition-all duration-500 lp3-animate-slide-up ${
          isVisible 
            ? "translate-y-0 opacity-100" 
            : "translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <Card className="lp3-glass-card shadow-2xl border-[hsl(var(--lp3-success)/0.3)] bg-gradient-to-br from-[hsl(var(--lp3-background))] to-[hsl(var(--lp3-success)/0.05)] backdrop-blur-lg lp3-hover-lift cursor-pointer">
          <div className="p-3 sm:p-4">
            {/* Header with counter */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[hsl(var(--lp3-success)/0.2)] to-[hsl(var(--lp3-primary)/0.2)] flex items-center justify-center flex-shrink-0 lp3-animate-pulse-strong">
                  <CheckCircle2 className="w-3 h-3 text-[hsl(var(--lp3-success))]" />
                </div>
                <span className="text-xs font-semibold text-[hsl(var(--lp3-muted-foreground))]">
                  Recent Booking #{notificationCount}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-[hsl(var(--lp3-muted-foreground))]">
                <Clock className="w-3 h-3" />
                <span>{currentNotification.timeAgo}</span>
              </div>
            </div>

            {/* Main content */}
            <div className="flex items-start gap-3">
              {/* Service Icon */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--lp3-primary)/0.1)] to-[hsl(var(--lp3-accent)/0.1)] flex items-center justify-center flex-shrink-0 border border-[hsl(var(--lp3-primary)/0.2)]">
                <span className="text-lg">{currentNotification.icon}</span>
              </div>

              <div className="flex-1 min-w-0">
                {/* Name and Location */}
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-bold text-[hsl(var(--lp3-foreground))] truncate">
                    {currentNotification.name}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-[hsl(var(--lp3-muted-foreground))]">
                    <MapPin className="w-3 h-3" />
                    <span>{currentNotification.location}</span>
                  </div>
                </div>

                {/* Service and Savings */}
                <div className="space-y-1">
                  <p className="text-sm text-[hsl(var(--lp3-muted-foreground))]">
                    Booked <span className="font-semibold text-[hsl(var(--lp3-primary))]">{currentNotification.service}</span>
                  </p>
                  
                  {/* Savings Badge */}
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 rounded-full bg-gradient-to-r from-[hsl(var(--lp3-success)/0.1)] to-[hsl(var(--lp3-primary)/0.1)] border border-[hsl(var(--lp3-success)/0.3)]">
                      <span className="text-xs font-bold text-[hsl(var(--lp3-success))] flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Saved {currentNotification.savings}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="mt-3 h-1 bg-[hsl(var(--lp3-muted)/0.3)] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[hsl(var(--lp3-success))] to-[hsl(var(--lp3-primary))] rounded-full transition-all duration-8000 ease-linear"
                style={{ 
                  width: isVisible ? '0%' : '100%',
                  transition: isVisible ? 'width 8s linear' : 'none'
                }}
              />
            </div>
          </div>
        </Card>

        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--lp3-success)/0.1)] to-[hsl(var(--lp3-primary)/0.1)] blur-lg -z-10 rounded-xl opacity-50" />
      </div>

      {/* Multiple notification stack effect */}
      {notificationCount > 1 && (
        <div className="fixed bottom-6 left-6 z-44 max-w-[calc(100vw-2rem)] sm:max-w-sm opacity-40 scale-95">
          <Card className="lp3-glass-card shadow-lg border-[hsl(var(--lp3-border)/0.3)] bg-gradient-to-br from-[hsl(var(--lp3-background))] to-[hsl(var(--lp3-muted)/0.1)] backdrop-blur-sm h-16" />
        </div>
      )}
    </div>
  );
};