'use client';

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Activity, MapPin, TrendingUp, Users, Clock } from "lucide-react";

export const LiveProjectTracker = () => {
  const [activeProjects, setActiveProjects] = useState([]);
  const [totalProjects, setTotalProjects] = useState(12);
  const [isUpdating, setIsUpdating] = useState(false);

  const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Pune", "Chennai"];
  const types = ["3BHK", "2BHK", "4BHK", "Villa"];
  const stages = ["Planning", "Design", "Execution", "Near Completion"];

  const getStageColor = (stage) => {
    switch(stage) {
      case "Planning": return "from-blue-500/20 to-cyan-500/20 text-blue-600";
      case "Design": return "from-[hsl(var(--lp3-primary)/0.2)] to-[hsl(var(--lp3-accent)/0.2)] text-[hsl(var(--lp3-primary))]";
      case "Execution": return "from-orange-500/20 to-red-500/20 text-orange-600";
      case "Near Completion": return "from-green-500/20 to-emerald-500/20 text-green-600";
      default: return "from-[hsl(var(--lp3-primary)/0.2)] to-[hsl(var(--lp3-accent)/0.2)] text-[hsl(var(--lp3-primary))]";
    }
  };

  useEffect(() => {
    const generateProjects = () => {
      return Array.from({ length: 6 }, () => ({
        city: cities[Math.floor(Math.random() * cities.length)],
        type: types[Math.floor(Math.random() * types.length)],
        stage: stages[Math.floor(Math.random() * stages.length)],
        id: Math.random().toString(36).substr(2, 9)
      }));
    };

    setActiveProjects(generateProjects());

    const interval = setInterval(() => {
      setIsUpdating(true);
      
      setTotalProjects((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;
        return Math.max(10, Math.min(18, prev + change));
      });
      
      if (Math.random() > 0.7) {
        setActiveProjects((prev) => {
          const newProjects = [...prev];
          const randomIndex = Math.floor(Math.random() * newProjects.length);
          newProjects[randomIndex] = {
            city: cities[Math.floor(Math.random() * cities.length)],
            type: types[Math.floor(Math.random() * types.length)],
            stage: stages[Math.floor(Math.random() * stages.length)],
            id: Math.random().toString(36).substr(2, 9)
          };
          return newProjects;
        });
      }

      setTimeout(() => setIsUpdating(false), 1000);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="lp3-landing py-16 px-4 bg-gradient-to-br from-[hsl(var(--lp3-primary)/0.05)] to-[hsl(var(--lp3-accent)/0.05)] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[hsl(var(--lp3-primary)/0.1)] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[hsl(var(--lp3-accent)/0.08)] rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      
      <div className="container mx-auto max-w-6xl relative">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--lp3-success)/0.2)] border border-[hsl(var(--lp3-success)/0.3)] mb-4 transition-all duration-500 ${
            isUpdating ? 'scale-105' : 'scale-100'
          }`}>
            <Activity className="w-4 h-4 text-[hsl(var(--lp3-success))] animate-pulse" />
            <span className="text-sm font-semibold text-[hsl(var(--lp3-success))]">
              {totalProjects} Projects Active Right Now
            </span>
            {isUpdating && (
              <div className="w-2 h-2 bg-[hsl(var(--lp3-primary))] rounded-full animate-ping" />
            )}
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-3">
            Live Project <span className="lp3-text-gradient">Updates</span>
          </h2>
          <p className="text-base text-[hsl(var(--lp3-muted-foreground))] max-w-2xl mx-auto">
            Real-time progress tracking from homeowners across India
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
          <div className="lp3-glass-card p-4 text-center border border-[hsl(var(--lp3-border)/0.3)] rounded-xl">
            <TrendingUp className="w-6 h-6 text-[hsl(var(--lp3-primary))] mx-auto mb-2" />
            <p className="text-2xl font-black text-[hsl(var(--lp3-primary))]">{totalProjects}</p>
            <p className="text-xs text-[hsl(var(--lp3-muted-foreground))]">Active</p>
          </div>
          <div className="lp3-glass-card p-4 text-center border border-[hsl(var(--lp3-border)/0.3)] rounded-xl">
            <Users className="w-6 h-6 text-[hsl(var(--lp3-accent))] mx-auto mb-2" />
            <p className="text-2xl font-black text-[hsl(var(--lp3-accent))]">5.6K+</p>
            <p className="text-xs text-[hsl(var(--lp3-muted-foreground))]">Homeowners</p>
          </div>
          <div className="lp3-glass-card p-4 text-center border border-[hsl(var(--lp3-border)/0.3)] rounded-xl">
            <Clock className="w-6 h-6 text-[hsl(var(--lp3-success))] mx-auto mb-2" />
            <p className="text-2xl font-black text-[hsl(var(--lp3-success))]">72h</p>
            <p className="text-xs text-[hsl(var(--lp3-muted-foreground))]">Avg. Delivery</p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeProjects.map((project, index) => (
            <Card
              key={project.id}
              className={`lp3-glass-card lp3-hover-lift p-4 border-2 transition-all duration-500 relative overflow-hidden ${
                isUpdating ? 'animate-pulse' : ''
              } ${
                project.stage === "Near Completion" 
                  ? 'border-[hsl(var(--lp3-success)/0.3)]' 
                  : 'border-[hsl(var(--lp3-border)/0.3)]'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Stage-specific background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getStageColor(project.stage).split(' ')[0]} ${getStageColor(project.stage).split(' ')[1]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="flex items-start gap-3 relative z-10">
                {/* Animated Map Pin */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--lp3-primary)/0.15)] to-[hsl(var(--lp3-accent)/0.15)] flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg border border-[hsl(var(--lp3-border)/0.3)]">
                  <MapPin className="w-6 h-6 text-[hsl(var(--lp3-primary))]" />
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* City and Status */}
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-black text-base text-[hsl(var(--lp3-foreground))] group-hover:text-[hsl(var(--lp3-primary))] transition-colors duration-300">
                      {project.city}
                    </p>
                    <span className={`w-2 h-2 rounded-full animate-pulse ${
                      project.stage === "Near Completion" 
                        ? 'bg-[hsl(var(--lp3-success))]' 
                        : project.stage === "Execution"
                        ? 'bg-orange-500'
                        : 'bg-[hsl(var(--lp3-primary))]'
                    }`} />
                  </div>
                  
                  {/* Project Type */}
                  <p className="text-sm text-[hsl(var(--lp3-muted-foreground))] mb-3">
                    {project.type} Interior Design
                  </p>
                  
                  {/* Stage Badge */}
                  <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 group-hover:scale-105 bg-gradient-to-r ${getStageColor(project.stage)} border border-current/20 backdrop-blur-sm`}>
                    {project.stage}
                  </div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[hsl(var(--lp3-border)/0.3)] overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    project.stage === "Planning" ? 'w-1/4 bg-blue-500' :
                    project.stage === "Design" ? 'w-1/2 bg-[hsl(var(--lp3-primary))]' :
                    project.stage === "Execution" ? 'w-3/4 bg-orange-500' :
                    'w-full bg-[hsl(var(--lp3-success))]'
                  }`}
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Live Update Indicator */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--lp3-muted)/0.5)] border border-[hsl(var(--lp3-border)/0.3)]">
            <div className="w-2 h-2 bg-[hsl(var(--lp3-success))] rounded-full animate-pulse" />
            <span className="text-xs text-[hsl(var(--lp3-muted-foreground))]">
              Live updates every 12 seconds
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};