'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { IndianRupee, Clock, Star, Sparkles, Quote } from 'lucide-react';
import { useState } from 'react';
import { PlanningWizardModal } from './PlanningWizardModal';

export const CustomerResultsSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const results = [
    {
      name: "Ritu Sharma",
      location: "Hyderabad",
      project: "3BHK Modern Home",
      quote: "Saved ₹4 lakhs in hidden costs. Finally felt in control of my interior project. The transparency was game-changing.",
      metrics: [
        { icon: IndianRupee, value: "₹4L", label: "Saved" },
        { icon: Clock, value: "2 months", label: "Early delivery" },
        { icon: Star, value: "5.0", label: "Rating" },
      ],
      avatarColor: "from-orange-500 to-amber-500",
    },
    {
      name: "Rajesh Kumar",
      location: "Bangalore",
      project: "2BHK Contemporary",
      quote: "Everything tracked in one place. 10/10 experience. No surprises, no stress, just beautiful results.",
      metrics: [
        { icon: IndianRupee, value: "₹3.5L", label: "Saved" },
        { icon: Clock, value: "3 months", label: "Early delivery" },
        { icon: Star, value: "5.0", label: "Rating" },
      ],
      avatarColor: "from-blue-500 to-cyan-500",
    },
    {
      name: "Sneha & Arjun",
      location: "Pune",
      project: "4BHK Luxury Villa",
      quote: "Got interiors done in 10 weeks, stress-free. The verified vendors and transparent pricing made all the difference.",
      metrics: [
        { icon: IndianRupee, value: "₹6L", label: "Saved" },
        { icon: Clock, value: "Zero", label: "Delays" },
        { icon: Star, value: "5.0", label: "Rating" },
      ],
      avatarColor: "from-green-500 to-emerald-500",
    },
  ];

   const handleStartProject = () => {
    setIsModalOpen(true);
  };

  return (
    <>
    <section id="results" className="lp3-landing py-16 md:py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--lp3-background))] via-[hsl(var(--lp3-primary)/0.03)] to-[hsl(var(--lp3-background))]" />
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-[hsl(var(--lp3-primary)/0.08)] rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[hsl(var(--lp3-accent)/0.06)] rounded-full blur-3xl translate-y-1/2" />
      
      <div className="container mx-auto relative max-w-[1400px]">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--lp3-primary)/0.1)] border border-[hsl(var(--lp3-primary)/0.2)] mb-4">
            <Sparkles className="w-4 h-4 text-[hsl(var(--lp3-primary))]" />
            <span className="text-sm font-semibold text-[hsl(var(--lp3-primary))]">Verified Results</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-center mb-4">
            Real <span className="lp3-text-gradient">Results</span>, Real Customers
          </h2>
          <p className="text-lg text-[hsl(var(--lp3-muted-foreground))] text-center max-w-2xl mx-auto">
            See how homeowners transformed their spaces while saving time and money
          </p>
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {results.map((result, index) => (
            <div 
              key={index}
              className="relative"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card 
                className={`lp3-glass-card lp3-hover-lift lp3-card-3d group relative overflow-hidden border-2 transition-all duration-500 h-full flex flex-col ${
                  hoveredCard === index 
                    ? 'border-[hsl(var(--lp3-primary)/0.4)] shadow-2xl' 
                    : 'border-[hsl(var(--lp3-border)/0.3)] shadow-lg'
                }`}
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--lp3-primary)/0.05)] to-[hsl(var(--lp3-accent)/0.05)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Quote className="w-6 h-6 text-[hsl(var(--lp3-primary)/0.5)]" />
                </div>

                <CardContent className="p-6 space-y-5 relative z-10 flex flex-col flex-1">
                  {/* Customer Info */}
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 ring-2 ring-[hsl(var(--lp3-primary)/0.3)] group-hover:ring-[hsl(var(--lp3-primary)/0.6)] transition-all duration-300 group-hover:scale-110">
                      <AvatarFallback className={`bg-gradient-to-br ${result.avatarColor} text-white font-bold text-lg`}>
                        {result.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-black text-lg text-[hsl(var(--lp3-foreground))] group-hover:text-[hsl(var(--lp3-primary))] transition-colors duration-300">
                        {result.name}
                      </h4>
                      <p className="text-sm text-[hsl(var(--lp3-muted-foreground))]">{result.location}</p>
                      <p className="text-xs font-bold text-[hsl(var(--lp3-primary))] mt-1 bg-[hsl(var(--lp3-primary)/0.1)] px-2 py-1 rounded-full inline-block">
                        {result.project}
                      </p>
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-base leading-relaxed text-[hsl(var(--lp3-foreground))] italic relative flex-1 group-hover:scale-105 transition-transform duration-300">
                    <div className="absolute -left-2 -top-2 text-2xl text-[hsl(var(--lp3-primary)/0.5)]">"</div>
                    {result.quote}
                    <div className="absolute -right-2 -bottom-2 text-2xl text-[hsl(var(--lp3-primary)/0.5)]">"</div>
                  </blockquote>

                  {/* Stars Rating */}
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 transition-all duration-300 ${
                          hoveredCard === index 
                            ? 'fill-[hsl(var(--lp3-primary))] text-[hsl(var(--lp3-primary))] scale-110' 
                            : 'fill-[hsl(var(--lp3-primary))] text-[hsl(var(--lp3-primary))]'
                        }`} 
                      />
                    ))}
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[hsl(var(--lp3-border)/0.3)] mt-auto">
                    {result.metrics.map((metric, i) => (
                      <div 
                        key={i} 
                        className="text-center group/metric hover:scale-105 transition-transform duration-300"
                      >
                        <div className="flex items-center justify-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(var(--lp3-primary)/0.15)] to-[hsl(var(--lp3-accent)/0.15)] flex items-center justify-center group-hover/metric:scale-110 transition-transform duration-300">
                            <metric.icon className="w-4 h-4 text-[hsl(var(--lp3-primary))]" />
                          </div>
                        </div>
                        <p className="text-lg font-black lp3-text-gradient">{metric.value}</p>
                        <p className="text-xs text-[hsl(var(--lp3-muted-foreground))] font-medium">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--lp3-primary)/0.1)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              </Card>

              {/* Floating Badge */}
              <div className={`absolute -top-2 -right-2 w-6 h-6 bg-[hsl(var(--lp3-primary))] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200 ${hoveredCard === index ? 'animate-ping' : ''}`} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="lp3-glass-card p-6 rounded-2xl border border-[hsl(var(--lp3-primary)/0.2)] max-w-md mx-auto lp3-hover-glow">
            <h3 className="text-xl font-black text-[hsl(var(--lp3-foreground))] mb-3">
              Ready for Your Success Story?
            </h3>
            <p className="text-sm text-[hsl(var(--lp3-muted-foreground))] mb-4">
              Join thousands of satisfied homeowners
            </p>
            <button
            onClick={handleStartProject}
            className="px-8 py-3 bg-[hsl(var(--lp3-primary))] text-[hsl(var(--lp3-primary-foreground))] rounded-xl font-bold text-base hover:shadow-[0_15px_30px_hsl(var(--lp3-primary)/0.3)] hover:scale-105 transition-all duration-300 lp3-animate-pulse-strong">
              Start Your Project
            </button>
          </div>
        </div>
      </div>
    </section>
     <PlanningWizardModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};