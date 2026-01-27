'use client';

import { BadgeCheck, Award, HeadphonesIcon, Star, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from 'react';

export const TrustBadges = () => {
  const [hoveredBadge, setHoveredBadge] = useState(null);

  const badges = [
    {
      icon: Star,
      title: "4.9/5 Rating",
      description: "2,147 verified reviews",
      showStars: true,
      gradient: "from-[hsl(var(--lp3-primary)/0.3)] to-[hsl(var(--lp3-accent)/0.3)]"
    },
    {
      icon: BadgeCheck,
      title: "Money-Back Guarantee",
      description: "100% refund if not delivered",
      showStars: false,
      gradient: "from-green-500/30 to-emerald-500/30"
    },
    {
      icon: Award,
      title: "ISO Certified",
      description: "Quality assured processes",
      showStars: false,
      gradient: "from-blue-500/30 to-cyan-500/30"
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Support",
      description: "Always here to help you",
      showStars: false,
      gradient: "from-purple-500/30 to-pink-500/30"
    },
  ];

  return (
    <section className="lp3-landing py-10 md:py-14 px-4 border-y border-[hsl(var(--lp3-border)/0.3)] bg-[hsl(var(--lp3-muted)/0.2)] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[hsl(var(--lp3-primary)/0.02)] to-transparent" />
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-[hsl(var(--lp3-primary)/0.1)] rounded-full blur-2xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-[hsl(var(--lp3-accent)/0.1)] rounded-full blur-2xl translate-y-1/2" />
      
      <div className="container mx-auto relative max-w-[1400px]">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--lp3-primary)/0.1)] border border-[hsl(var(--lp3-primary)/0.2)] mb-4">
            <Sparkles className="w-4 h-4 text-[hsl(var(--lp3-primary))]" />
            <span className="text-sm font-semibold text-[hsl(var(--lp3-primary))]">Trust & Quality</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-[hsl(var(--lp3-foreground))] mb-2">
            Why Homeowners Trust Us
          </h3>
          <p className="text-sm md:text-base text-[hsl(var(--lp3-muted-foreground))] max-w-2xl mx-auto">
            Backed by thousands of successful projects and unwavering commitment to quality
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {badges.map((badge, index) => (
            <div 
              key={index}
              className="relative"
              onMouseEnter={() => setHoveredBadge(index)}
              onMouseLeave={() => setHoveredBadge(null)}
            >
              <Card
                className={`lp3-glass-card lp3-hover-lift text-center group relative overflow-hidden border transition-all duration-300 h-full ${
                  hoveredBadge === index 
                    ? 'border-[hsl(var(--lp3-primary)/0.4)] shadow-xl' 
                    : 'border-[hsl(var(--lp3-border)/0.3)] shadow-md'
                }`}
              >
                {/* Animated Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${badge.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <CardContent className="p-4 md:p-5 space-y-3 relative z-10">
                  {/* Icon Container */}
                  <div className="relative">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[hsl(var(--lp3-primary)/0.15)] to-[hsl(var(--lp3-accent)/0.15)] flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg border border-[hsl(var(--lp3-border)/0.3)]">
                      <badge.icon className="w-6 h-6 md:w-7 md:h-7 text-[hsl(var(--lp3-primary))]" />
                    </div>
                    
                    {/* Floating Dot */}
                    <div className={`absolute -top-1 -right-1 w-3 h-3 bg-[hsl(var(--lp3-primary))] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200 ${hoveredBadge === index ? 'animate-ping' : ''}`} />
                  </div>

                  {/* Stars Rating */}
                  {badge.showStars && (
                    <div className="flex items-center justify-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 md:w-4 md:h-4 transition-all duration-300 ${
                            hoveredBadge === index 
                              ? 'fill-[hsl(var(--lp3-primary))] text-[hsl(var(--lp3-primary))] scale-110' 
                              : 'fill-[hsl(var(--lp3-primary))] text-[hsl(var(--lp3-primary))]'
                          }`} 
                        />
                      ))}
                    </div>
                  )}

                  {/* Content */}
                  <div className="space-y-1.5">
                    <p className="font-black text-sm md:text-base text-[hsl(var(--lp3-foreground))] group-hover:text-[hsl(var(--lp3-primary))] transition-colors duration-300">
                      {badge.title}
                    </p>
                    <p className="text-xs text-[hsl(var(--lp3-muted-foreground))] leading-relaxed">
                      {badge.description}
                    </p>
                  </div>

                  {/* Hover Arrow Indicator */}
                  <div className={`w-6 h-0.5 bg-gradient-to-r from-[hsl(var(--lp3-primary))] to-[hsl(var(--lp3-accent))] mx-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform ${
                    hoveredBadge === index ? 'scale-x-100' : 'scale-x-0'
                  }`} />
                </CardContent>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--lp3-primary)/0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              </Card>

              {/* Connection Lines for Desktop */}
              {index < badges.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-[hsl(var(--lp3-primary)/0.2)] to-transparent z-0 transform -translate-y-1/2" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 text-xs md:text-sm text-[hsl(var(--lp3-muted-foreground))]">
            <BadgeCheck className="w-4 h-4 text-[hsl(var(--lp3-success))]" />
            <span>Join 5,000+ satisfied homeowners who transformed their spaces</span>
          </div>
        </div>
      </div>
    </section>
  );
};