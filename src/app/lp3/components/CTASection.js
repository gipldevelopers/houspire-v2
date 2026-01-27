'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BadgeCheck, Timer, ArrowRight, Sparkles, Users } from 'lucide-react';
import { PlanningWizardModal } from './PlanningWizardModal';

export const CTASection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="lp3-landing py-16 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--lp3-primary)/0.1)] via-[hsl(var(--lp3-accent)/0.05)] to-[hsl(var(--lp3-background))]" />
      <div className="absolute inset-0 opacity-30" style={{ background: 'var(--lp3-gradient-mesh)' }} />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-[hsl(var(--lp3-primary)/0.08)] rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[hsl(var(--lp3-accent)/0.06)] rounded-full blur-3xl translate-y-1/2" />
      
      <div className="container mx-auto text-center max-w-3xl relative">
        {/* Header Section */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--lp3-primary)/0.1)] border border-[hsl(var(--lp3-primary)/0.2)] mb-4">
            <Users className="w-3 h-3 text-[hsl(var(--lp3-primary))]" />
            <span className="text-xs font-semibold text-[hsl(var(--lp3-primary))]">Join 5,000+ Homeowners</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black mb-4 lp3-animate-fade-in">
            Your Dream Home Deserves <span className="lp3-text-gradient">Clarity</span>, Not Chaos.
          </h2>
          <p className="text-lg text-[hsl(var(--lp3-muted-foreground))] mb-6 lp3-animate-slide-up">
            Transform your interior planning experience with transparency and control
          </p>
        </div>

        {/* Features Badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 lp3-animate-scale-in">
          {["Verified Vendors", "Transparent Pricing", "On-Time Delivery", "No Hidden Costs"].map(
            (item, index) => (
              <Badge 
                key={item} 
                className="lp3-glass-card px-3 py-2 border border-[hsl(var(--lp3-border)/0.3)] lp3-hover-glow text-sm"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <BadgeCheck className="w-4 h-4 mr-2 text-[hsl(var(--lp3-primary))]" />
                {item}
              </Badge>
            )
          )}
        </div>

        {/* Main CTA Button */}
        <div className="mb-4">
          <Button 
            className="text-lg px-8 py-6 h-auto w-full max-w-sm mx-auto bg-[hsl(var(--lp3-primary))] hover:bg-[hsl(var(--lp3-primary)/0.9)] text-[hsl(var(--lp3-primary-foreground))] hover:shadow-[0_20px_40px_hsl(var(--lp3-primary)/0.4)] hover:scale-105 transition-all duration-300 lp3-animate-pulse-strong font-bold relative overflow-hidden group"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="relative z-10 flex items-center justify-center">
              🚀 Start Planning Today - Save ₹2,000
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--lp3-primary)/0.9)] to-[hsl(var(--lp3-accent)/0.9)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </div>

        {/* Quick Info */}
        <p className="text-sm text-[hsl(var(--lp3-muted-foreground))] mb-4">
          Get started in minutes • No upfront payment required
        </p>

        {/* Limited Availability Badge */}
        <Badge className="bg-[hsl(var(--lp3-destructive)/0.1)] text-[hsl(var(--lp3-destructive))] border-[hsl(var(--lp3-destructive)/0.2)] px-4 py-2 text-sm lp3-animate-float">
          <Timer className="w-4 h-4 mr-2" />
          Limited: Only 10 projects per city per month
        </Badge>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs text-[hsl(var(--lp3-muted-foreground))]">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[hsl(var(--lp3-primary))]" />
            <span>4.9/5 Rating</span>
          </div>
          <div className="flex items-center gap-1">
            <BadgeCheck className="w-3 h-3 text-[hsl(var(--lp3-success))]" />
            <span>Money-Back Guarantee</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 text-[hsl(var(--lp3-accent))]" />
            <span>5,000+ Happy Customers</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      <PlanningWizardModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </section>
  );
};