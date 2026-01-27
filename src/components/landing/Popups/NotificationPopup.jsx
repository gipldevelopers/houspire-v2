'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Users, Clock, MapPin, TrendingUp, Home, Star } from 'lucide-react';

export const NotificationPopup = ({ 
  notification, 
  onClose, 
  liveViewers = 23, 
  recentPurchases = 6 
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const notifications = [
    {
      id: 1,
      type: 'purchase',
      message: `Rohit from Mumbai just purchased Complete Home Package`,
      time: '2 min ago',
      location: 'Mumbai',
      amount: '₹4,999',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />
    },
    {
      id: 2,
      type: 'saved',
      message: `Priya saved ₹3.2L with our budget breakdown`,
      time: '5 min ago',
      location: 'Bangalore',
      amount: '₹3,20,000',
      icon: <TrendingUp className="w-5 h-5 text-orange-500" />
    },
    {
      id: 3,
      type: 'viewer',
      message: `${liveViewers} people viewing this page right now`,
      time: 'Just now',
      location: 'India',
      amount: null,
      icon: <Users className="w-5 h-5 text-blue-500" />
    },
    {
      id: 4,
      type: 'review',
      message: 'Arjun rated us 5 stars for vendor recommendations',
      time: '10 min ago',
      location: 'Delhi',
      amount: '⭐ 5.0',
      icon: <Star className="w-5 h-5 text-yellow-500" />
    },
    {
      id: 5,
      type: 'delivery',
      message: `6 packages delivered today`,
      time: 'Today',
      location: 'Various cities',
      amount: '📦 6',
      icon: <Home className="w-5 h-5 text-purple-500" />
    }
  ];

  const currentNotif = notifications[notification % notifications.length];

  return (
    <div className={`fixed bottom-6 left-4 z-40 transition-all duration-300 ${
      visible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
    }`}>
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-sm animate-slideInLeft overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0">
              {currentNotif.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 mb-1">
                {currentNotif.message}
              </p>
              
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{currentNotif.time}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{currentNotif.location}</span>
                </div>
                
                {currentNotif.amount && (
                  <div className="ml-auto font-semibold text-green-600">
                    {currentNotif.amount}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-1 bg-gray-200 rounded-b-xl overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-blue-500 animate-progress"
            style={{ animationDuration: '5s' }}
          />
        </div>
      </div>
    </div>
  );
};