'use client';

import { LayoutDashboard, Hammer, LineChart, ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { PlanningWizardModal } from './PlanningWizardModal';

export const HowItWorksSection = () => {
  const [hoveredStep, setHoveredStep] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const steps = [
    {
      icon: LayoutDashboard,
      title: "Upload Floorplan",
      description: "Get instant budget & 3D renders with detailed material breakdown",
      features: ["Budget Analysis", "3D Visualizations", "Material Breakdown", "Instant Quotes"]
    },
    {
      icon: Hammer,
      title: "Match Contractors",
      description: "Connect with verified vendors tailored to your project requirements",
      features: ["Verified Partners", "Location Matching", "Skill Assessment", "Rating System"]
    },
    {
      icon: LineChart,
      title: "Track Progress",
      description: "Monitor payments, milestones, and real-time project updates",
      features: ["Payment Tracking", "Milestone Alerts", "Live Updates", "Quality Checks"]
    },
  ];

  const handleStartProject = () => {
    setIsModalOpen(true);
  };

  return (
    <>
    <section id="how-it-works" className="lp3-landing py-16 md:py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--lp3-secondary)/0.2)] via-transparent to-[hsl(var(--lp3-secondary)/0.2)]" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-[hsl(var(--lp3-primary)/0.1)] rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[hsl(var(--lp3-accent)/0.1)] rounded-full blur-3xl translate-y-1/2" />
      
      <div className="container mx-auto text-center relative max-w-[1400px]">
        {/* Header Section */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--lp3-primary)/0.1)] border border-[hsl(var(--lp3-primary)/0.2)] mb-4">
            <Sparkles className="w-4 h-4 text-[hsl(var(--lp3-primary))]" />
            <span className="text-sm font-semibold text-[hsl(var(--lp3-primary))]">Simple Process</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
            How It <span className="lp3-text-gradient">Works</span>
          </h2>
          <p className="text-lg md:text-xl text-[hsl(var(--lp3-muted-foreground))] max-w-2xl mx-auto">
            Three simple steps to transform your space with complete transparency
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12 relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-1 bg-gradient-to-r from-transparent via-[hsl(var(--lp3-primary)/0.3)] to-transparent" />
          
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative group"
              onMouseEnter={() => setHoveredStep(index)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              {/* Step Content */}
              <div className="lp3-glass-card p-6 rounded-2xl border-2 transition-all duration-500 h-full flex flex-col items-center text-center relative overflow-hidden lp3-hover-lift lp3-card-3d"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--lp3-primary)/0.05)] to-[hsl(var(--lp3-accent)/0.05)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[hsl(var(--lp3-primary))] to-[hsl(var(--lp3-accent))] flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl group-hover:shadow-[hsl(var(--lp3-primary))/0.4)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 relative">
                    <step.icon className="w-10 h-10 text-[hsl(var(--lp3-primary-foreground))]" />
                    
                    {/* Floating Elements */}
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[hsl(var(--lp3-primary-foreground))] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200" />
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[hsl(var(--lp3-primary-foreground))] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300" />
                  </div>
                  
                  {/* Step Number */}
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(var(--lp3-primary))] to-[hsl(var(--lp3-accent))] text-[hsl(var(--lp3-primary-foreground))] font-black flex items-center justify-center text-sm shadow-lg border-2 border-[hsl(var(--lp3-background))] group-hover:scale-110 transition-transform duration-300">
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4 flex-1 flex flex-col">
                  <h3 className="text-xl md:text-2xl font-black text-[hsl(var(--lp3-foreground))] group-hover:text-[hsl(var(--lp3-primary))] transition-colors duration-300">
                    {step.title}
                  </h3>
                  
                  <p className="text-[hsl(var(--lp3-muted-foreground))] leading-relaxed flex-1">
                    {step.description}
                  </p>

                  {/* Features List */}
                  <div className="flex flex-wrap gap-2 justify-center pt-2">
                    {step.features.map((feature, featureIndex) => (
                      <span 
                        key={featureIndex}
                        className="px-3 py-1.5 bg-[hsl(var(--lp3-muted)/0.5)] text-[hsl(var(--lp3-foreground))] rounded-full text-xs font-medium border border-[hsl(var(--lp3-border)/0.3)] backdrop-blur-sm group-hover:bg-[hsl(var(--lp3-primary)/0.1)] group-hover:text-[hsl(var(--lp3-primary))] transition-all duration-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className={`mt-4 transform transition-all duration-300 ${
                  hoveredStep === index ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                }`}>
                  <ArrowRight className="w-6 h-6 text-[hsl(var(--lp3-primary))] mx-auto" />
                </div>
              </div>

              {/* Connection Arrow for Desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 -right-4 w-8 h-0.5 bg-gradient-to-r from-[hsl(var(--lp3-primary)/0.5)] to-transparent z-0">
                  <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4">
                    <ArrowRight className="w-4 h-4 text-[hsl(var(--lp3-primary))]" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="lp3-glass-card p-6 rounded-2xl border border-[hsl(var(--lp3-primary)/0.2)] max-w-2xl mx-auto lp3-hover-glow">
          <h3 className="text-xl md:text-2xl font-black text-[hsl(var(--lp3-foreground))] mb-3">
            Ready to Start Your Journey?
          </h3>
          <p className="text-[hsl(var(--lp3-muted-foreground))] mb-6">
            Join thousands of homeowners who transformed their spaces with our simple process
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
            onClick={handleStartProject}
            className="px-8 py-4 bg-[hsl(var(--lp3-primary))] text-[hsl(var(--lp3-primary-foreground))] rounded-xl font-bold text-lg hover:shadow-[0_20px_50px_hsl(var(--lp3-primary)/0.4)] hover:scale-105 transition-all duration-300 lp3-animate-pulse-strong">
              Start Your Project
            </button>
            {/* <button className="px-8 py-4 border-2 border-[hsl(var(--lp3-primary))] text-[hsl(var(--lp3-primary))] rounded-xl font-bold text-lg hover:bg-[hsl(var(--lp3-primary)/0.1)] transition-all duration-300">
              View Examples
            </button> */}
          </div>
        </div>
      </div>
    </section>
     <PlanningWizardModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};