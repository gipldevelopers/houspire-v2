// components/dashboard/ProgressCards.jsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle, PlayCircle, Zap } from "lucide-react";

const PHASE_CONFIG = {
  RENDERS: {
    title: "3D Renders",
    description: "powered interior visualization",
    duration: 24, // hours
    color: "from-blue-500 to-cyan-500",
    icon: PlayCircle
  },
  BUDGET: {
    title: "Budget & BOQ",
    description: "Detailed cost breakdown",
    duration: 24,
    color: "from-green-500 to-emerald-500",
    icon: Zap
  },
  VENDORS: {
    title: "Vendor Matching",
    description: "Trusted partner selection",
    duration: 24,
    color: "from-purple-500 to-pink-500",
    icon: CheckCircle
  }
};

const ProgressCards = ({ project }) => {
  const [timeRemaining, setTimeRemaining] = useState(72 * 60 * 60 * 1000); // 72 hours in ms
  const [currentPhaseProgress, setCurrentPhaseProgress] = useState(0);

  useEffect(() => {
    if (!project.designProgressStartTime) return;

    const calculateProgress = () => {
      const now = new Date().getTime();
      const startTime = new Date(project.designProgressStartTime).getTime();
      const elapsed = now - startTime;
      const totalTime = 72 * 60 * 60 * 1000; // 72 hours
      
      // Overall progress
      const remaining = Math.max(0, totalTime - elapsed);
      setTimeRemaining(remaining);

      // Current phase progress
      const currentPhase = project.currentProgressPhase || 'RENDERS';
      const phaseStartTime = getPhaseStartTime(project, currentPhase);
      if (phaseStartTime) {
        const phaseElapsed = now - new Date(phaseStartTime).getTime();
        const phaseDuration = PHASE_CONFIG[currentPhase]?.duration * 60 * 60 * 1000 || 24 * 60 * 60 * 1000;
        const phaseProgress = Math.min(100, (phaseElapsed / phaseDuration) * 100);
        setCurrentPhaseProgress(phaseProgress);
      }
    };

    calculateProgress();
    const interval = setInterval(calculateProgress, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [project]);

  const getPhaseStartTime = (project, phase) => {
    switch (phase) {
      case 'RENDERS':
        return project.rendersStartTime || project.designProgressStartTime;
      case 'BUDGET':
        return project.budgetStartTime || project.rendersCompletedAt;
      case 'VENDORS':
        return project.vendorsStartTime || project.budgetCompletedAt;
      default:
        return project.designProgressStartTime;
    }
  };

  const getPhaseStatus = (phase) => {
    const phaseKey = phase.toLowerCase() + 'CompletedAt';
    const completedAt = project[phaseKey];
    
    if (completedAt) return 'completed';
    if (project.currentProgressPhase === phase) return 'active';
    return 'pending';
  };

  const formatTimeRemaining = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours <= 0 && minutes <= 0) return "Time's up!";
    return `${hours}h ${minutes}m`;
  };

  const overallProgress = Math.max(0, 100 - (timeRemaining / (72 * 60 * 60 * 1000)) * 100);

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <Card className="border-l-4 border-l-amber-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" />
              <span className="font-semibold text-foreground">72-Hour Delivery</span>
            </div>
            <Badge 
              variant={timeRemaining < (24 * 60 * 60 * 1000) ? "destructive" : "default"}
              className="text-xs"
            >
              {formatTimeRemaining(timeRemaining)}
            </Badge>
          </div>
          <Progress value={overallProgress} className="h-2 mb-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Started: {new Date(project.designProgressStartTime).toLocaleDateString()}</span>
            <span>{Math.round(overallProgress)}% Complete</span>
          </div>
        </CardContent>
      </Card>

      {/* Phase Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Object.entries(PHASE_CONFIG).map(([phase, config]) => {
          const Icon = config.icon;
          const status = getPhaseStatus(phase);
          const isActive = status === 'active';
          const isCompleted = status === 'completed';
          
          return (
            <Card 
              key={phase}
              className={`border-l-4 ${
                isCompleted 
                  ? 'border-l-green-500 bg-green-50 dark:bg-green-950/20' 
                  : isActive
                  ? 'border-l-amber-500 bg-amber-50 dark:bg-amber-950/20'
                  : 'border-l-gray-300'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${config.color} text-white`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-foreground">
                      {config.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {config.description}
                    </p>
                  </div>
                  <div>
                    {isCompleted && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {isActive && (
                      <div className="animate-pulse">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                      </div>
                    )}
                  </div>
                </div>
                
                {isActive && (
                  <>
                    <Progress value={currentPhaseProgress} className="h-1 mb-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>In progress</span>
                      <span>{Math.round(currentPhaseProgress)}%</span>
                    </div>
                  </>
                )}
                
                {isCompleted && (
                  <div className="text-xs text-green-600 font-medium">
                    Completed {new Date(project[`${phase.toLowerCase()}CompletedAt`]).toLocaleDateString()}
                  </div>
                )}
                
                {status === 'pending' && (
                  <div className="text-xs text-muted-foreground">
                    Upcoming
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressCards;