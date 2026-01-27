'use client';

import { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

export const DiscountTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white py-3 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 animate-pulse" />
            <span className="font-bold">HURRY! Limited Time Offer</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-lg">
              <Clock className="w-4 h-4" />
              <div className="flex items-center gap-1 font-mono text-lg font-bold">
                <div className="bg-white/20 px-2 py-1 rounded min-w-[2ch] text-center">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </div>
                <span>:</span>
                <div className="bg-white/20 px-2 py-1 rounded min-w-[2ch] text-center">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </div>
                <span>:</span>
                <div className="bg-white/20 px-2 py-1 rounded min-w-[2ch] text-center">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </div>
              </div>
            </div>
            
            <div className="text-sm">
              <span className="font-semibold">30% OFF</span> ends in{' '}
              {timeLeft.hours}h {timeLeft.minutes}m
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};