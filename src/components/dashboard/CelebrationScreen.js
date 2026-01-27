// src/components/dashboard/CelebrationScreen.js
'use client';

import { useEffect, useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  X,
  Calendar,
  Mail,
  Bell,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Confetti from 'react-confetti';

export default function CelebrationScreen({ project, onClose }) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [timeLeft, setTimeLeft] = useState(72 * 60 * 60); // 72 hours in seconds
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Set window size for confetti
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });

    // Stop confetti after 4 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(confettiTimer);
      clearInterval(timer);
    };
  }, []);

  // Calculate time units
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const designStartTime = new Date(project.designStartTime);
  const deadlineTime = new Date(designStartTime.getTime() + (72 * 60 * 60 * 1000));

  const formatDeadline = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const features = [
    {
      icon: Clock,
      title: 'Design Phase Started',
      description: 'Your project has entered the design pipeline'
    },
    {
      icon: Calendar,
      title: '72-Hour Timeline',
      description: 'Complete design package delivery'
    },
    {
      icon: Mail,
      title: 'Email Updates',
      description: 'Regular progress notifications'
    },
    {
      icon: Bell,
      title: 'Quality Review',
      description: 'Multiple rounds of design refinement'
    }
  ];

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={isMobile ? 80 : 150}
          gravity={0.2}
          colors={['#3B82F6', '#10B981', '#6366F1', '#8B5CF6']}
        />
      )}
      
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
        <div className="bg-card border-t sm:border border-border rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-2xl h-[90vh] sm:h-auto sm:max-h-[85vh] flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95">
          
          {/* Header - Compact */}
          <div className="relative px-4 py-3 sm:p-5 text-center border-b border-border bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex-shrink-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 h-8 w-8 p-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-destructive/10"
            >
              <X className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-base sm:text-xl font-semibold text-foreground">
                  Design Process Initiated
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Your project is now in the design phase
                </p>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto min-h-0 p-3 sm:p-5 space-y-3 sm:space-y-4">
            
            {/* Project Info */}
            <Card className="border-border">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground text-sm truncate">
                      {project.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">Design timeline started</p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs ml-2">
                    In Progress
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Countdown Timer - Compact */}
            <Card className="border-border">
              <CardContent className="p-3 sm:p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm sm:text-base font-medium text-foreground">
                      Design Timeline
                    </h3>
                  </div>
                  
                  {/* Time Units */}
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {[
                      { value: hours, label: 'Hours' },
                      { value: minutes, label: 'Minutes' },
                      { value: seconds, label: 'Seconds' }
                    ].map((item) => (
                      <div key={item.label} className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-foreground bg-slate-100 dark:bg-slate-800 rounded-lg py-2">
                          {item.value.toString().padStart(2, '0')}
                        </div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                          {item.label}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Est. completion: <span className="font-medium text-foreground">{formatDeadline(deadlineTime)}</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Process Features - 2x2 Grid */}
            <div className="grid grid-cols-2 gap-2">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="flex items-center gap-2 p-2.5 bg-muted/30 rounded-lg border border-border">
                    <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-md flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-medium text-foreground truncate">{feature.title}</h4>
                      <p className="text-[10px] text-muted-foreground truncate">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* What's Next - Compact */}
            <div className="p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-xs font-medium text-foreground mb-2">What's Next</h3>
              <div className="space-y-1">
                {['Initial concepts within 24h', '3D renders within 48h', 'Final package in 72h'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-600 rounded-full flex-shrink-0"></div>
                    <span className="text-xs text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer - Always Visible */}
          <div className="flex-shrink-0 p-3 sm:p-4 border-t border-border bg-muted/30">
            <Button 
              onClick={onClose} 
              className="bg-blue-600 hover:bg-blue-700 text-white w-full h-10 text-sm font-medium"
            >
              Got It
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}