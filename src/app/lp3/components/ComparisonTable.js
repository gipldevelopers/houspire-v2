'use client';

import { Check, X, Sparkles, Crown, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from 'react';
import { PlanningWizardModal } from "./PlanningWizardModal";

export const ComparisonTable = () => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features = [
    { feature: "Transparent Pricing", houspire: true, traditional: false, description: "Clear cost breakdown" },
    { feature: "Instant Budget (BOQ)", houspire: true, traditional: false, description: "powered in minutes" },
    { feature: "3D Renders First", houspire: true, traditional: false, description: "Visualize before work" },
    { feature: "Local Material Rates", houspire: true, traditional: false, description: "City-wise pricing" },
    { feature: "Verified Vendors", houspire: true, traditional: false, description: "Background-checked" },
    { feature: "72-Hour Delivery", houspire: true, traditional: false, description: "Fast turnaround" },
    { feature: "No Hidden Costs", houspire: true, traditional: false, description: "What you see is what you pay" },
    { feature: "Multiple Options", houspire: true, traditional: false, description: "Curated partners" },
    { feature: "Money-Back Guarantee", houspire: true, traditional: false, description: "Risk-free" },
  ];
   const handleStartProject = () => {
    setIsModalOpen(true);
  };

  return (
    <>
    <section className="lp3-landing py-16 md:py-20 px-4 bg-[hsl(var(--lp3-secondary)/0.2)] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[hsl(var(--lp3-primary)/0.03)] to-transparent" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-[hsl(var(--lp3-primary)/0.08)] rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[hsl(var(--lp3-accent)/0.06)] rounded-full blur-3xl translate-y-1/2" />
      
      <div className="container mx-auto max-w-6xl relative"> {/* Keep original max-w-6xl */}
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--lp3-primary)/0.1)] border border-[hsl(var(--lp3-primary)/0.2)] mb-4">
            <Shield className="w-4 h-4 text-[hsl(var(--lp3-primary))]" />
            <span className="text-sm font-semibold text-[hsl(var(--lp3-primary))]">Why Choose Us</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
            <span className="lp3-text-gradient">Houspire</span> vs Traditional Approach
          </h2>
          <p className="text-lg text-[hsl(var(--lp3-muted-foreground))] max-w-2xl mx-auto">
            See why thousands of homeowners choose transparency and technology over traditional chaos
          </p>
        </div>

        {/* Compact Comparison Table - Only this container is reduced */}
        <div className="max-w-4xl mx-auto"> {/* Added wrapper with max-w-4xl */}
          <Card className="lp3-glass-card shadow-2xl overflow-hidden border-2 border-[hsl(var(--lp3-border)/0.3)] lp3-hover-glow">
            <CardHeader className="bg-gradient-to-r from-[hsl(var(--lp3-primary)/0.1)] via-[hsl(var(--lp3-accent)/0.1)] to-[hsl(var(--lp3-primary)/0.1)] border-b border-[hsl(var(--lp3-border)/0.3)] p-4">
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="col-span-1">
                  <h3 className="text-xs font-semibold text-[hsl(var(--lp3-muted-foreground))] uppercase tracking-wider">
                    Features
                  </h3>
                </div>
                
                {/* Houspire Column */}
                <CardTitle className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[hsl(var(--lp3-primary))] to-[hsl(var(--lp3-accent))] rounded-lg text-[hsl(var(--lp3-primary-foreground))] font-black text-sm shadow-lg lp3-animate-pulse-strong">
                    <Crown className="w-4 h-4" />
                    Houspire
                  </div>
                  <p className="text-xs text-[hsl(var(--lp3-muted-foreground))] mt-1">Modern & Transparent</p>
                </CardTitle>
                
                {/* Traditional Column */}
                <CardTitle className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--lp3-muted))] rounded-lg text-[hsl(var(--lp3-muted-foreground))] font-bold text-sm border-2 border-[hsl(var(--lp3-border))]">
                    <X className="w-4 h-4" />
                    Other Platforms
                  </div>
                  <p className="text-xs text-[hsl(var(--lp3-muted-foreground))] mt-1">Traditional & Opaque</p>
                </CardTitle>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {features.map((item, index) => (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={`grid grid-cols-3 gap-4 p-3 items-center transition-all duration-300 relative ${
                    index % 2 === 0 
                      ? "bg-[hsl(var(--lp3-muted)/0.2)]" 
                      : "bg-[hsl(var(--lp3-background))]"
                  } ${
                    hoveredRow === index 
                      ? "bg-[hsl(var(--lp3-primary)/0.05)] scale-[1.01] shadow-md" 
                      : "hover:bg-[hsl(var(--lp3-muted)/0.3)]"
                  }`}
                >
                  {/* Feature Description */}
                  <div className="col-span-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        hoveredRow === index 
                          ? "bg-[hsl(var(--lp3-primary))] scale-125" 
                          : "bg-[hsl(var(--lp3-primary)/0.5)]"
                      }`} />
                      <div>
                        <p className="font-bold text-[hsl(var(--lp3-foreground))] text-sm leading-tight">
                          {item.feature}
                        </p>
                        <p className="text-xs text-[hsl(var(--lp3-muted-foreground))] mt-0.5 leading-tight">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Houspire Column */}
                  <div className="flex justify-center">
                    {item.houspire ? (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(var(--lp3-primary)/0.2)] to-[hsl(var(--lp3-accent)/0.2)] flex items-center justify-center group hover:scale-110 hover:rotate-12 transition-all duration-300 shadow-md border border-[hsl(var(--lp3-primary)/0.3)]">
                        <Check className="w-4 h-4 text-[hsl(var(--lp3-primary))] group-hover:scale-110 transition-transform" />
                        {hoveredRow === index && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-[hsl(var(--lp3-primary))] rounded-full animate-ping" />
                        )}
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[hsl(var(--lp3-destructive)/0.1)] flex items-center justify-center border border-[hsl(var(--lp3-destructive)/0.2)]">
                        <X className="w-4 h-4 text-[hsl(var(--lp3-destructive))]" />
                      </div>
                    )}
                  </div>

                  {/* Traditional Column */}
                  <div className="flex justify-center">
                    {item.traditional ? (
                      <div className="w-8 h-8 rounded-full bg-[hsl(var(--lp3-primary)/0.1)] flex items-center justify-center border border-[hsl(var(--lp3-primary)/0.2)]">
                        <Check className="w-4 h-4 text-[hsl(var(--lp3-primary))]" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[hsl(var(--lp3-destructive)/0.1)] flex items-center justify-center group hover:scale-110 transition-all duration-300 border border-[hsl(var(--lp3-destructive)/0.2)]">
                        <X className="w-4 h-4 text-[hsl(var(--lp3-destructive))] group-hover:scale-110 transition-transform" />
                      </div>
                    )}
                  </div>

                  {/* Hover Effect Line */}
                  <div 
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[hsl(var(--lp3-primary))] to-[hsl(var(--lp3-accent))] transition-all duration-300 ${
                      hoveredRow === index ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="lp3-glass-card p-6 rounded-2xl border border-[hsl(var(--lp3-primary)/0.2)] max-w-md mx-auto lp3-hover-glow">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-[hsl(var(--lp3-primary))]" />
              <h3 className="text-xl font-black text-[hsl(var(--lp3-foreground))]">Ready to Experience the Difference?</h3>
            </div>
            <p className="text-sm text-[hsl(var(--lp3-muted-foreground))] mb-4">
              Join the modern way of interior design with complete transparency
            </p>
            <button
              onClick={handleStartProject}
            className="px-8 py-3 bg-[hsl(var(--lp3-primary))] text-[hsl(var(--lp3-primary-foreground))] rounded-xl font-bold text-base hover:shadow-[0_15px_30px_hsl(var(--lp3-primary)/0.3)] hover:scale-105 transition-all duration-300 lp3-animate-pulse-strong">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </section>
    <PlanningWizardModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};