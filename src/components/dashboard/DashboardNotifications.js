// src/components/dashboard/DashboardNotifications.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  Image, 
  FileText, 
  CheckCircle2,
  X,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const useDashboardNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const checkForUpdates = () => {
      const newRenders = JSON.parse(localStorage.getItem('new_renders') || '[]');
      const newBOQs = JSON.parse(localStorage.getItem('new_boqs') || '[]');
      
      const allNotifications = [
        ...newRenders.map(render => ({
          type: 'render',
          id: render.id,
          title: 'New Renders Ready!',
          message: `Your ${render.roomType} renders are now available`,
          projectId: render.projectId,
          timestamp: render.timestamp,
          read: false
        })),
        ...newBOQs.map(boq => ({
          type: 'boq',
          id: boq.id,
          title: 'BOQ Generated!',
          message: 'Your Bill of Quantities is ready for review',
          projectId: boq.projectId,
          timestamp: boq.timestamp,
          read: false
        }))
      ];

      setNotifications(allNotifications);

      // Update badge counts
      localStorage.setItem('new_renders_count', newRenders.length.toString());
      localStorage.setItem('new_boq_count', newBOQs.length.toString());
    };

    checkForUpdates();
    
    // Check every 30 seconds for new updates
    const interval = setInterval(checkForUpdates, 5000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const clearNotification = (notificationId, type) => {
    if (type === 'render') {
      const currentRenders = JSON.parse(localStorage.getItem('new_renders') || '[]');
      const updatedRenders = currentRenders.filter(render => render.id !== notificationId);
      localStorage.setItem('new_renders', JSON.stringify(updatedRenders));
      localStorage.setItem('new_renders_count', updatedRenders.length.toString());
    } else if (type === 'boq') {
      const currentBOQs = JSON.parse(localStorage.getItem('new_boqs') || '[]');
      const updatedBOQs = currentBOQs.filter(boq => boq.id !== notificationId);
      localStorage.setItem('new_boqs', JSON.stringify(updatedBOQs));
      localStorage.setItem('new_boq_count', updatedBOQs.length.toString());
    }
    
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  return {
    notifications: notifications.filter(n => !n.read),
    markAsRead,
    clearNotification
  };
};

export default function DashboardNotifications() {
  const { notifications, markAsRead, clearNotification } = useDashboardNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 mb-6">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-900 dark:text-amber-100 text-lg">
              Updates Available!
            </h3>
            <p className="text-amber-700 dark:text-amber-300 text-sm">
              Your design assets are ready for review
            </p>
          </div>
          <Badge className="ml-auto bg-amber-500 text-white animate-pulse">
            {notifications.length} New
          </Badge>
        </div>

        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-amber-200 dark:border-amber-800"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`p-2 rounded-lg ${
                  notification.type === 'render' 
                    ? 'bg-blue-100 dark:bg-blue-900/30' 
                    : 'bg-green-100 dark:bg-green-900/30'
                }`}>
                  {notification.type === 'render' ? (
                    <Image className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                    {notification.title}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-xs">
                    {notification.message}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    markAsRead(notification.id);
                    if (notification.type === 'render') {
                      window.location.href = `/dashboard/renders?project=${notification.projectId}`;
                    } else {
                      window.location.href = `/dashboard/boq?project=${notification.projectId}`;
                    }
                  }}
                  className="text-xs h-8"
                >
                  View
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => clearNotification(notification.id, notification.type)}
                  className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}