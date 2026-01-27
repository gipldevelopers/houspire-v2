// src/components/tour/TourTrigger.js
'use client';

import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import { useTour } from '@/context/TourContext';

const TourTrigger = ({ tourName = 'combined', variant = 'outline', size = 'sm' }) => {
  const { startTour, resetTour, hasCompletedTour } = useTour();

  const handleStartTour = () => {
    // If tour was already completed in this session, reset it first
    if (hasCompletedTour(tourName)) {
      resetTour(tourName);
    }
    
    // Start the tour
    startTour(tourName);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleStartTour}
      className="flex items-center gap-2"
    >
      <PlayCircle className="w-4 h-4" />
      Take Tour
    </Button>
  );
};

export default TourTrigger;