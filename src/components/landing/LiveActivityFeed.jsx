'use client';

import { useState, useEffect } from 'react';
import { MapPin, Clock, Users, TrendingUp, Home } from 'lucide-react';

export const LiveActivityFeed = () => {
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'purchase',
      user: 'Rohit S.',
      location: 'Mumbai',
      package: 'Complete Home',
      amount: 4999,
      time: '2 minutes ago',
      icon: '🏠'
    },
    {
      id: 2,
      type: 'saved',
      user: 'Priya M.',
      location: 'Bangalore',
      savings: 320000,
      time: '5 minutes ago',
      icon: '💰'
    },
    {
      id: 3,
      type: 'design',
      user: 'Amit K.',
      location: 'Delhi',
      room: '3BHK',
      time: '8 minutes ago',
      icon: '🎨'
    },
    {
      id: 4,
      type: 'vendor',
      user: 'Sneha P.',
      location: 'Pune',
      vendors: 5,
      time: '12 minutes ago',
      icon: '👥'
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [activities.length]);

  const currentActivity = activities[currentIndex];

  const getActivityMessage = (activity) => {
    switch (activity.type) {
      case 'purchase':
        return `${activity.user} from ${activity.location} purchased ${activity.package} Package`;
      case 'saved':
        return `${activity.user} saved ₹${activity.savings.toLocaleString('en-IN')} with our budget planning`;
      case 'design':
        return `${activity.user} is designing their ${activity.room} in ${activity.location}`;
      case 'vendor':
        return `${activity.user} got ${activity.vendors} verified vendor contacts`;
      default:
        return '';
    }
  };

  return (
    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-2xl px-4">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-xl overflow-hidden">
        <div className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-ping" />
                <div className="w-3 h-3 bg-green-400 rounded-full absolute inset-0" />
              </div>
              <span className="text-sm font-semibold">Live Activity</span>
            </div>
            
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>23 viewing</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>6 purchased today</span>
              </div>
            </div>
          </div>
          
          <div className="mt-2 flex items-center gap-3">
            <div className="text-2xl">{currentActivity.icon}</div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {getActivityMessage(currentActivity)}
              </p>
              <div className="flex items-center gap-3 text-xs opacity-90 mt-1">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{currentActivity.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{currentActivity.time}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress dots */}
        <div className="flex justify-center gap-1 pb-2">
          {activities.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === currentIndex ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};