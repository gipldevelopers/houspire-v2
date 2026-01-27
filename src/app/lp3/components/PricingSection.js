'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Sparkles, Home } from 'lucide-react';
import { PlanningWizardModal } from './PlanningWizardModal';

export const PricingSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const plans = [
    {
      title: "2BHK Interiors",
      subtitle: "Perfect for small families",
      area: "900-1100 sq ft",
      config: "Kitchen, 2BR, Living, Bath",
      features: ["Cozy & Efficient", "Budget Optimized", "Smart Layout"],
      price: "₹4,999"
    },
    {
      title: "3BHK Interiors",
      subtitle: "Ideal for growing families",
      area: "1200-1500 sq ft",
      config: "Kitchen, 3BR, Living, 2 Baths",
      features: ["Family Favorite", "Flexible Layout", "Great Value"],
      popular: true,
      price: "₹6,999"
    },
    {
      title: "4BHK Interiors",
      subtitle: "Designed for premium living",
      area: "1800+ sq ft",
      config: "Kitchen, 4BR, Living, 3 Baths",
      features: ["Premium Comfort", "Ample Space", "Bespoke Planning"],
      price: "₹9,999"
    },
  ];

  return (
    <section id="pricing" className="lp3-landing py-16 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--lp3-primary)/0.03)] to-transparent" />
      <div className="absolute top-0 left-1/4 w-48 h-48 bg-[hsl(var(--lp3-primary)/0.08)] rounded-full blur-2xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-[hsl(var(--lp3-accent)/0.06)] rounded-full blur-2xl translate-y-1/2" />
      
      <div className="container mx-auto relative max-w-6xl">
        {/* Compact Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--lp3-primary)/0.1)] border border-[hsl(var(--lp3-primary)/0.2)] mb-3">
            <Home className="w-3 h-3 text-[hsl(var(--lp3-primary))]" />
            <span className="text-xs font-semibold text-[hsl(var(--lp3-primary))]">Choose Your Plan</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            Interior Planning by <span className="lp3-text-gradient">Home Size</span>
          </h2>
          <p className="text-lg font-bold text-[hsl(var(--lp3-primary))] mb-2">Starting from {plans[0].price} only</p>
          <p className="text-sm text-[hsl(var(--lp3-muted-foreground))] max-w-xl mx-auto">
            Get detailed budgets, 3D renders, and verified vendor shortlists for your home
          </p>
        </div>

        {/* Compact Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`lp3-glass-card lp3-hover-lift relative group border-2 transition-all duration-300 ${
                plan.popular 
                  ? 'border-[hsl(var(--lp3-primary)/0.4)] shadow-lg scale-105 z-10' 
                  : 'border-[hsl(var(--lp3-border)/0.3)] z-0'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[hsl(var(--lp3-primary))] to-[hsl(var(--lp3-accent))] text-[hsl(var(--lp3-primary-foreground))] text-xs px-3 py-1 shadow-lg lp3-animate-pulse-strong">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="p-4 pb-2 relative z-10">
                <CardTitle className="text-xl font-black text-[hsl(var(--lp3-foreground))]">
                  {plan.title}
                </CardTitle>
                <p className="text-sm text-[hsl(var(--lp3-muted-foreground))]">
                  {plan.subtitle}
                </p>
                <div className="text-2xl font-black lp3-text-gradient mt-2">
                  {plan.price}
                </div>
              </CardHeader>
              
              <CardContent className="p-4 pt-2 space-y-4 relative z-10">
                {/* Specifications */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[hsl(var(--lp3-muted-foreground))]">Area:</span>
                    <span className="font-medium text-[hsl(var(--lp3-foreground))]">{plan.area}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[hsl(var(--lp3-muted-foreground))]">Includes:</span>
                    <span className="font-medium text-[hsl(var(--lp3-foreground))] text-right">{plan.config}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[hsl(var(--lp3-primary))] flex-shrink-0" />
                      <span className="text-sm text-[hsl(var(--lp3-foreground))]">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  <Button 
                    className="w-full bg-[hsl(var(--lp3-primary))] hover:bg-[hsl(var(--lp3-primary)/0.9)] text-[hsl(var(--lp3-primary-foreground))] hover:shadow-[0_8px_20px_hsl(var(--lp3-primary)/0.3)] hover:scale-105 transition-all duration-300 font-bold text-sm py-2"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Customize & Continue
                  </Button>
                </div>
              </CardContent>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--lp3-primary)/0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            </Card>
          ))}
        </div>

        {/* Compact Bottom Info */}
        <div className="text-center mt-8">
          <div className="lp3-glass-card p-4 rounded-xl border border-[hsl(var(--lp3-border)/0.3)] max-w-md mx-auto">
            <p className="text-xs text-[hsl(var(--lp3-muted-foreground))] mb-2">
              All plans include: Budget, 3D Renders, Vendor Matching & Support
            </p>
            <Button 
              variant="outline"
              className="text-xs border-[hsl(var(--lp3-primary))] text-[hsl(var(--lp3-primary))] hover:bg-[hsl(var(--lp3-primary)/0.1)]"
              onClick={() => setIsModalOpen(true)}
            >
              Need Custom Solution?
            </Button>
          </div>
        </div>
      </div>

      {/* Modal - Opens on all button clicks */}
      <PlanningWizardModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </section>
  );
};