// src/components/dashboard/CountdownTimer.js
'use client';

import { useState, useEffect } from 'react';
import { Clock, Rocket, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function CountdownTimer({ project }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [progress, setProgress] = useState(0);

  function calculateTimeLeft() {
    const designStartTime = new Date(project.designStartTime);
    const deadlineTime = new Date(designStartTime.getTime() + (72 * 60 * 60 * 1000)); // 72 hours
    const now = new Date();
    const difference = deadlineTime - now;

    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      hours: Math.floor(difference / (1000 * 60 * 60)),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false
    };
  }

  function calculateProgress() {
    const designStartTime = new Date(project.designStartTime);
    const deadlineTime = new Date(designStartTime.getTime() + (72 * 60 * 60 * 1000));
    const now = new Date();
    const totalTime = deadlineTime - designStartTime;
    const elapsedTime = now - designStartTime;
    
    return Math.min(Math.max((elapsedTime / totalTime) * 100, 0), 100);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
      setProgress(calculateProgress());
    }, 1000);

    return () => clearInterval(timer);
  }, [project.designStartTime]);

  const getStatusColor = () => {
    if (timeLeft.expired) return 'text-green-600';
    if (timeLeft.hours < 24) return 'text-amber-600';
    if (timeLeft.hours < 48) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getStatusBadge = () => {
    if (timeLeft.expired) {
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-0">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      );
    }
    if (timeLeft.hours < 24) {
      return (
        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 border-0">
          <AlertCircle className="w-3 h-3 mr-1" />
          Finalizing
        </Badge>
      );
    }
    return (
      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-0">
        <Rocket className="w-3 h-3 mr-1" />
        In Progress
      </Badge>
    );
  };

  if (timeLeft.expired) {
    return (
      <Card className="border-border hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-foreground truncate">{project.title}</h4>
            {getStatusBadge()}
          </div>
          
          <div className="text-center py-4">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Designs are ready for review!</p>
          </div>

          <Progress value={100} className="h-2 bg-green-100" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Started</span>
            <span className="font-medium text-green-600">100% Complete</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border hover:shadow-md transition-all group">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-foreground truncate">{project.title}</h4>
          {getStatusBadge()}
        </div>

        {/* Countdown Timer - Only Hours, Minutes, Seconds */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { value: timeLeft.hours, label: 'Hours' },
            { value: timeLeft.minutes, label: 'Minutes' },
            { value: timeLeft.seconds, label: 'Seconds' }
          ].map((item, index) => (
            <div key={item.label} className="text-center p-3 bg-muted rounded-lg group-hover:bg-muted/80 transition-colors">
              <div className={`text-2xl font-bold ${getStatusColor()} font-mono`}>
                {item.value.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Design Progress</span>
            <span className={`font-semibold ${getStatusColor()}`}>
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Started</span>
            <span>72H Deadline</span>
          </div>
        </div>

        {/* Status Message */}
        <div className="flex items-center gap-2 mt-3 p-2 bg-muted/50 rounded-lg">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <div className="text-xs text-muted-foreground">
            {timeLeft.hours < 24 
              ? 'Finalizing your designs...' 
              : timeLeft.hours < 48 
              ? 'Creating 3D renders...'
              : 'Generating design concepts...'
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
}