'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Flame, Users } from 'lucide-react';

export const LiveSlotCounter = () => {
  const [slotsLeft, setSlotsLeft] = useState(7);
  const [viewersCount, setViewersCount] = useState(12);

  useEffect(() => {
    // Simulate dynamic slot changes (decrease occasionally)
    const slotInterval = setInterval(() => {
      setSlotsLeft((prev) => {
        if (prev > 3 && Math.random() > 0.7) {
          return prev - 1;
        }
        return prev;
      });
    }, 45000); // Check every 45 seconds

    // Simulate live viewers fluctuation
    const viewerInterval = setInterval(() => {
      setViewersCount((prev) => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const newCount = prev + change;
        return Math.max(8, Math.min(25, newCount)); // Keep between 8-25
      });
    }, 8000); // Update every 8 seconds

    return () => {
      clearInterval(slotInterval);
      clearInterval(viewerInterval);
    };
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Badge 
        variant="destructive" 
        className="px-4 py-2 text-sm font-bold animate-pulse shadow-lg border-2 border-destructive/50 hover:scale-110 transition-transform"
      >
        <Flame className="w-4 h-4 mr-2" />
        🔥 Only {slotsLeft} slots left this month
      </Badge>
      
      <Badge 
        variant="secondary" 
        className="px-4 py-2 text-sm font-semibold glass-card shadow-md hover:scale-105 transition-transform"
      >
        <Users className="w-4 h-4 mr-2" />
        <span className="animate-pulse">{viewersCount}</span>
        <span className="ml-1">people viewing now</span>
      </Badge>
    </div>
  );
};