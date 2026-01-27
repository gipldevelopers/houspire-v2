'use client';

import { CircleAlert, Lightbulb, BadgeCheck, ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { PlanningWizardModal } from './PlanningWizardModal';

export const ProblemSolutionSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const items = [
    {
      icon: CircleAlert,
      label: "Problem",
      title: "Interior Planning Chaos",
      description: "Hidden costs, endless vendor negotiations, overwhelming choices leave homeowners frustrated and over budget",
      stat: "80% budget overruns",
      statColor: "text-[hsl(var(--lp3-muted-foreground))]",
      gradient: "from-red-500/20 to-orange-500/20",
      features: ["Hidden costs", "Vendor negotiations", "Unclear timelines", "Quality issues"]
    },
    {
      icon: Lightbulb,
      label: "Solution",
      title: "Powered Transparency",
      description: "Instant Budget with real-time city rates, verified vendors, and stunning 3D visualizations in one platform",
      stat: "72-hour delivery",
      statColor: "text-[hsl(var(--lp3-primary))]",
      gradient: "from-[hsl(var(--lp3-primary)/0.3)] to-[hsl(var(--lp3-accent)/0.3)]",
      features: ["Instant BOQ", "3D renders", "Verified vendors", "City-specific pricing"]
    },
    {
      icon: BadgeCheck,
      label: "Proof",
      title: "Risk-Free Guarantee",
      description: "Complete transparency with secure process, preview everything before commitment with money-back guarantee",
      stat: "4.9/5 rating",
      statColor: "text-[hsl(var(--lp3-accent))]",
      gradient: "from-green-500/20 to-emerald-500/20",
      features: ["Money-back guarantee", "Secure payments", "Preview first", "24/7 support"]
    },
  ];

  const handleStartProject = () => {
    setIsModalOpen(true);
  };

  const handleViewExamples = () => {
    // Scroll to examples section or open gallery
    const examplesSection = document.getElementById('examples-gallery');
    if (examplesSection) {
      examplesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="lp3-landing py-16 px-4 relative overflow-hidden">
        {/* Enhanced Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--lp3-primary)/0.03)] to-transparent" />
        <div className="absolute top-0 left-0 w-72 h-72 bg-[hsl(var(--lp3-primary)/0.1)] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[hsl(var(--lp3-accent)/0.08)] rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        
        <div className="container mx-auto relative max-w-[1400px]">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--lp3-primary)/0.1)] border border-[hsl(var(--lp3-primary)/0.2)] mb-6">
              <Sparkles className="w-4 h-4 text-[hsl(var(--lp3-primary))]" />
              <span className="text-sm font-semibold text-[hsl(var(--lp3-primary))]">The Complete Solution</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 leading-tight">
              From Interior <span className="lp3-text-gradient">Chaos</span> to {' '}
              <span className="text-[hsl(var(--lp3-primary))]">Dream Home</span>
            </h2>
            
            <p className="text-base md:text-lg text-[hsl(var(--lp3-muted-foreground))] max-w-2xl mx-auto">
              The revolutionary platform solving India's interior planning problems with powered transparency
            </p>
          </div>

          {/* Enhanced Cards Grid - Consistent Heights */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-6">
            {items.map((item, index) => (
              <div 
                key={index}
                className="relative group h-full"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Connection Lines */}
                {index < items.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-[hsl(var(--lp3-primary)/0.3)] to-transparent z-0 transform -translate-y-1/2" />
                )}
                
                <Card 
                  className={`lp3-glass-card lp3-hover-lift lp3-card-3d relative overflow-hidden border-2 transition-all duration-500 h-full flex flex-col ${
                    hoveredCard === index 
                      ? 'border-[hsl(var(--lp3-primary)/0.4)] shadow-2xl' 
                      : 'border-[hsl(var(--lp3-border)/0.3)] shadow-lg'
                  }`}
                >
                  {/* Animated Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-[hsl(var(--lp3-primary)/0.1)] to-[hsl(var(--lp3-accent)/0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl`} />
                  
                  <CardContent className="p-6 relative z-10 flex flex-col flex-1">
                    <div className="space-y-4 flex-1">
                      {/* Icon Section */}
                      <div className="flex items-start justify-between">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br from-[hsl(var(--lp3-primary)/0.15)] to-[hsl(var(--lp3-accent)/0.15)] flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg border border-[hsl(var(--lp3-border)/0.3)]`}>
                          <item.icon className="w-8 h-8 text-[hsl(var(--lp3-primary))]" />
                        </div>
                        
                        {/* Status Badge */}
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                          item.label === "Problem" 
                            ? 'bg-red-500/10 text-red-600 border-red-500/20' 
                            : item.label === "Solution" 
                            ? 'bg-[hsl(var(--lp3-primary)/0.1)] text-[hsl(var(--lp3-primary))] border-[hsl(var(--lp3-primary)/0.2)]' 
                            : 'bg-green-500/10 text-green-600 border-green-500/20'
                        }`}>
                          {item.label}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-3 flex-1">
                        <h3 className="text-xl font-black text-[hsl(var(--lp3-foreground))] leading-tight">
                          {item.title}
                        </h3>
                        
                        <p className="text-[hsl(var(--lp3-muted-foreground))] leading-relaxed text-sm">
                          {item.description}
                        </p>

                        {/* Features List */}
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {item.features.map((feature, featureIndex) => (
                            <span 
                              key={featureIndex}
                              className="px-2.5 py-1 bg-[hsl(var(--lp3-muted)/0.5)] text-[hsl(var(--lp3-foreground))] rounded-full text-xs font-medium border border-[hsl(var(--lp3-border)/0.3)] backdrop-blur-sm"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Stat with Enhanced Styling */}
                      <div className="pt-3 border-t border-[hsl(var(--lp3-border)/0.3)] mt-auto">
                        <div className={`text-2xl font-black ${item.statColor} group-hover:scale-105 transition-transform duration-300 flex items-center justify-between`}>
                          <span>{item.stat}</span>
                          <ArrowRight className={`w-5 h-5 transform transition-transform duration-300 ${
                            hoveredCard === index ? 'translate-x-1' : 'translate-x-0'
                          }`} />
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--lp3-primary)/0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                </Card>

                {/* Floating Elements */}
                <div className={`absolute -top-1 -right-1 w-4 h-4 bg-[hsl(var(--lp3-primary))] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200 ${hoveredCard === index ? 'animate-ping' : ''}`} />
              </div>
            ))}
          </div>

          {/* Compact CTA Section */}
          <div className="text-center mt-10">
            <div className="lp3-glass-card rounded-xl p-6 max-w-md mx-auto border border-[hsl(var(--lp3-primary)/0.2)] lp3-hover-glow">
              <h3 className="text-xl font-black text-[hsl(var(--lp3-foreground))] mb-3">
                Ready to Transform Your Space?
              </h3>
              <p className="text-sm text-[hsl(var(--lp3-muted-foreground))] mb-4">
                Join thousands of simplified homeowners
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button 
                  onClick={handleStartProject}
                  className="px-6 py-3 bg-[hsl(var(--lp3-primary))] text-[hsl(var(--lp3-primary-foreground))] rounded-lg font-bold text-base hover:shadow-[0_15px_30px_hsl(var(--lp3-primary)/0.3)] hover:scale-105 transition-all duration-300 lp3-animate-pulse-strong"
                >
                  Start Your Project
                </button>
                {/* <button 
                  onClick={handleViewExamples}
                  className="px-6 py-3 border border-[hsl(var(--lp3-primary))] text-[hsl(var(--lp3-primary))] rounded-lg font-bold text-base hover:bg-[hsl(var(--lp3-primary)/0.1)] transition-all duration-300"
                >
                  View Examples
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planning Wizard Modal */}
      <PlanningWizardModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};