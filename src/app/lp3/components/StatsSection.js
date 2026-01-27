'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Wallet, UsersRound, Boxes, HomeIcon, TrendingUp, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { PlanningWizardModal } from './PlanningWizardModal';

export const StatsSection = () => {
  const [hoveredStat, setHoveredStat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = [
    {
      icon: Wallet,
      value: "₹47 Cr+",
      label: "Interiors Planned",
      description: "Total value of projects completed through our platform",
      gradient: "from-[hsl(var(--lp3-primary)/0.3)] to-[hsl(var(--lp3-accent)/0.3)]",
      delay: "0s"
    },
    {
      icon: UsersRound,
      value: "117+",
      label: "Contractors Onboarded",
      description: "Verified professionals across multiple cities",
      gradient: "from-green-500/30 to-emerald-500/30",
      delay: "0.1s"
    },
    {
      icon: Boxes,
      value: "8,700+",
      label: "Materials & Vendors",
      description: "Comprehensive inventory for all your interior needs",
      gradient: "from-blue-500/30 to-cyan-500/30",
      delay: "0.2s"
    },
    {
      icon: HomeIcon,
      value: "Growing",
      label: "Homeowner Community",
      description: "Growing by 73+ homeowners every month",
      gradient: "from-purple-500/30 to-pink-500/30",
      delay: "0.3s"
    },
  ];

    const handleStartProject = () => {
    setIsModalOpen(true);
  };

  return (
    <>
    <section className="lp3-landing py-16 md:py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--lp3-background))] via-[hsl(var(--lp3-primary)/0.02)] to-[hsl(var(--lp3-background))]" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-[hsl(var(--lp3-primary)/0.08)] rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[hsl(var(--lp3-accent)/0.06)] rounded-full blur-3xl translate-y-1/2" />
      
      <div className="container mx-auto relative max-w-[1400px]">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--lp3-primary)/0.1)] border border-[hsl(var(--lp3-primary)/0.2)] mb-4">
            <TrendingUp className="w-4 h-4 text-[hsl(var(--lp3-primary))]" />
            <span className="text-sm font-semibold text-[hsl(var(--lp3-primary))]">Trusted by Thousands</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center mb-4">
            The Proof Is In The <span className="lp3-text-gradient">Numbers</span>
          </h2>
          <p className="text-lg text-[hsl(var(--lp3-muted-foreground))] text-center max-w-2xl mx-auto">
            Real metrics showcasing our impact and growth in the interior design industry
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="relative"
              onMouseEnter={() => setHoveredStat(index)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <Card 
                className={`lp3-glass-card lp3-hover-lift text-center group relative overflow-hidden border-2 transition-all duration-500 h-full ${
                  hoveredStat === index 
                    ? 'border-[hsl(var(--lp3-primary)/0.4)] shadow-2xl' 
                    : 'border-[hsl(var(--lp3-border)/0.3)] shadow-lg'
                }`}
                style={{ animationDelay: stat.delay }}
              >
                {/* Animated Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl`} />
                
                <CardContent className="p-6 space-y-4 relative z-10">
                  {/* Icon Container */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--lp3-primary)/0.15)] to-[hsl(var(--lp3-accent)/0.15)] flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg border border-[hsl(var(--lp3-border)/0.3)]">
                      <stat.icon className="w-8 h-8 text-[hsl(var(--lp3-primary))]" />
                    </div>
                    
                    {/* Floating Dot */}
                    <div className={`absolute -top-1 -right-1 w-3 h-3 bg-[hsl(var(--lp3-primary))] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200 ${hoveredStat === index ? 'animate-ping' : ''}`} />
                  </div>

                  {/* Value */}
                  <div className="text-3xl md:text-4xl font-black lp3-text-gradient group-hover:scale-105 transition-transform duration-300">
                    {stat.value}
                  </div>

                  {/* Label */}
                  <div className="text-lg md:text-xl font-black text-[hsl(var(--lp3-foreground))] group-hover:text-[hsl(var(--lp3-primary))] transition-colors duration-300">
                    {stat.label}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[hsl(var(--lp3-muted-foreground))] leading-relaxed group-hover:text-[hsl(var(--lp3-foreground)/0.8)] transition-colors duration-300">
                    {stat.description}
                  </p>

                  {/* Progress Indicator */}
                  <div className="w-12 h-1 bg-[hsl(var(--lp3-border)/0.3)] rounded-full mx-auto overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[hsl(var(--lp3-primary))] to-[hsl(var(--lp3-accent))] transition-all duration-1000"
                      style={{ 
                        width: hoveredStat === index ? '100%' : '0%',
                        transitionDelay: hoveredStat === index ? '200ms' : '0ms'
                      }}
                    />
                  </div>
                </CardContent>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--lp3-primary)/0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              </Card>

              {/* Connection Lines for Desktop */}
              {index < stats.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-[hsl(var(--lp3-primary)/0.2)] to-transparent z-0 transform -translate-y-1/2" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="lp3-glass-card p-6 rounded-2xl border border-[hsl(var(--lp3-primary)/0.2)] max-w-md mx-auto lp3-hover-glow">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-[hsl(var(--lp3-primary))]" />
              <h3 className="text-xl font-black text-[hsl(var(--lp3-foreground))]">Join Our Growing Community</h3>
            </div>
            <p className="text-sm text-[hsl(var(--lp3-muted-foreground))] mb-4">
              Be part of India's fastest-growing interior design platform
            </p>
            <button
            onClick={handleStartProject}
            className="px-8 py-3 bg-[hsl(var(--lp3-primary))] text-[hsl(var(--lp3-primary-foreground))] rounded-xl font-bold text-base hover:shadow-[0_15px_30px_hsl(var(--lp3-primary)/0.3)] hover:scale-105 transition-all duration-300 lp3-animate-pulse-strong">
              Start Your Project Today
            </button>
          </div>
        </div>
      </div>
    </section>
    <PlanningWizardModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};