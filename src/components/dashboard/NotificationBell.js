// src/components/dashboard/NotificationBell.js
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Bell, X, CheckCheck, AlertCircle, Info, Check, Image, FileText, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { notificationService } from '@/services/notification.service';

const getNotificationIcon = (type) => {
  const iconProps = { className: "h-4 w-4" };
  
  switch (type) {
    case 'RENDER_READY':
      return <Image {...iconProps} className="h-4 w-4 text-green-600 dark:text-green-400" />;
    case 'BOQ_READY':
      return <FileText {...iconProps} className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    case 'VENDOR_ASSIGNED':
      // return <Info {...iconProps} className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      return <Users {...iconProps} className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    case 'PAYMENT_SUCCESS':
      return <Check {...iconProps} className="h-4 w-4 text-green-600 dark:text-green-400" />;
    case 'QUESTIONNAIRE_REMINDER':
      return <AlertCircle {...iconProps} className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
    case 'SYSTEM_UPDATE':
      return <Info {...iconProps} className="h-4 w-4 text-slate-500 dark:text-slate-400" />;
    default:
      return <Info {...iconProps} className="text-slate-500 dark:text-slate-400" />;
  }
};

const formatTimeAgo = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  }
};

// Custom hook for real notifications with smart polling
const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Use refs to track state without causing re-renders
  const pollIntervalRef = useRef(10000); // Start with 10 seconds
  const isDropdownOpenRef = useRef(false);
  const unreadCountRef = useRef(0);
  const countIntervalRef = useRef(null);
  const fullIntervalRef = useRef(null);

  // Load full notifications (only when needed)
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const result = await notificationService.getUserNotifications();
      if (result.success) {
        setNotifications(result.data.notifications || []);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load unread count (lightweight)
  const loadUnreadCount = useCallback(async () => {
    try {
      const result = await notificationService.getUnreadCount();
      if (result.success) {
        const newCount = result.data.count || 0;
        const previousCount = unreadCountRef.current;
        unreadCountRef.current = newCount;
        setUnreadCount(newCount);
        
        // If count increased, we have new notifications
        if (newCount > previousCount && previousCount >= 0) {
          // Only reload full notifications if dropdown is open
          if (isDropdownOpenRef.current) {
            await loadNotifications();
          }
        }
        
        // Adjust polling interval based on activity (exponential backoff)
        if (newCount === 0 && previousCount === 0) {
          // No notifications, poll less frequently (exponential backoff up to 60s)
          pollIntervalRef.current = Math.min(pollIntervalRef.current * 1.2, 60000);
        } else if (newCount > 0) {
          // Has notifications, poll more frequently
          pollIntervalRef.current = 10000;
        }
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  }, [loadNotifications]);

  // Update dropdown ref when state changes
  useEffect(() => {
    isDropdownOpenRef.current = isDropdownOpen;
  }, [isDropdownOpen]);

  // Setup polling
  useEffect(() => {
    // Initial load
    loadNotifications();
    loadUnreadCount();

    // Smart polling: poll unread count with dynamic interval
    const startPolling = () => {
      // Clear existing intervals
      if (countIntervalRef.current) clearInterval(countIntervalRef.current);
      if (fullIntervalRef.current) clearInterval(fullIntervalRef.current);

      // Poll unread count with current interval
      countIntervalRef.current = setInterval(() => {
        loadUnreadCount();
      }, pollIntervalRef.current);

      // Poll full notifications only when dropdown is open (every 30s)
      fullIntervalRef.current = setInterval(() => {
        if (isDropdownOpenRef.current) {
          loadNotifications();
        }
      }, 30000);
    };

    startPolling();

    // Restart polling when interval changes
    const restartInterval = setInterval(() => {
      if (countIntervalRef.current) {
        clearInterval(countIntervalRef.current);
        countIntervalRef.current = setInterval(() => {
          loadUnreadCount();
        }, pollIntervalRef.current);
      }
    }, 60000); // Check every minute to update interval

    // Page Visibility API - pause polling when tab is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden, clear intervals
        if (countIntervalRef.current) clearInterval(countIntervalRef.current);
        if (fullIntervalRef.current) clearInterval(fullIntervalRef.current);
      } else {
        // Tab is visible again, resume polling
        loadUnreadCount();
        if (isDropdownOpenRef.current) {
          loadNotifications();
        }
        startPolling();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (countIntervalRef.current) clearInterval(countIntervalRef.current);
      if (fullIntervalRef.current) clearInterval(fullIntervalRef.current);
      clearInterval(restartInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadNotifications, loadUnreadCount]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => {
        const updated = prev.map(notification => 
          notification.publicId === notificationId 
            ? { ...notification, isRead: true, readAt: new Date() }
            : notification
        );
        // Update unread count
        const newUnreadCount = updated.filter(n => !n.isRead).length;
        setUnreadCount(newUnreadCount);
        unreadCountRef.current = newUnreadCount;
        return updated;
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);
  
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => 
        prev.map(notification => ({ 
          ...notification, 
          isRead: true, 
          readAt: new Date() 
        }))
      );
      setUnreadCount(0);
      unreadCountRef.current = 0;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, []);
  
  const clearNotification = useCallback(async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => {
        const filtered = prev.filter(n => n.publicId !== notificationId);
        // Update unread count
        const newUnreadCount = filtered.filter(n => !n.isRead).length;
        setUnreadCount(newUnreadCount);
        unreadCountRef.current = newUnreadCount;
        return filtered;
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Fallback: just mark as read if delete fails
      await markAsRead(notificationId);
    }
  }, [markAsRead]);

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    refreshNotifications: loadNotifications,
    setIsDropdownOpen,
  };
};

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    loading, 
    unreadCount,
    markAsRead, 
    markAllAsRead, 
    clearNotification,
    setIsDropdownOpen,
    refreshNotifications
  } = useNotifications();

  // Update dropdown state and refresh when opened
  useEffect(() => {
    setIsDropdownOpen(isOpen);
    // When dropdown opens, refresh notifications immediately
    if (isOpen) {
      refreshNotifications();
    }
  }, [isOpen]);

  const handleNotificationClick = async (notification) => {
    await markAsRead(notification.publicId);
    setIsOpen(false);
    
    // Navigate to the action URL
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative h-9 w-9 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-medium bg-red-500 text-white"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-80 p-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-lg rounded-lg" 
        align="end" 
        side="bottom"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {unreadCount} unread
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        
        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-slate-500 mt-2">Loading notifications...</p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {notifications.map((notification) => (
                <div
                  key={notification.publicId}
                  className={cn(
                    "p-4 transition-colors cursor-pointer group relative",
                    "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                    !notification.isRead && "bg-blue-50/50 dark:bg-blue-900/20"
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      <Avatar className="h-8 w-8 bg-slate-100 dark:bg-slate-800">
                        <AvatarFallback className="bg-transparent">
                          {getNotificationIcon(notification.type)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                          {notification.title}
                        </p>
                        <div className="flex items-center space-x-2">
                          {!notification.isRead && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full" />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 hover:bg-slate-200 dark:hover:bg-slate-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearNotification(notification.publicId);
                            }}
                          >
                            <X className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                        {notification.project && (
                          <span className="text-xs text-slate-400 dark:text-slate-500">
                            {notification.project.title}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
                No notifications
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                You're all caught up! New notifications will appear here.
              </p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        {/* {notifications.length > 0 && (
          <div className="p-2 border-t border-slate-200 dark:border-slate-700">
            <Button 
              variant="ghost" 
              className="w-full justify-center text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => {
                setIsOpen(false);
                // Navigate to full notifications page if it exists
                // window.location.href = '/dashboard/notifications';
              }}
            >
              View all notifications
            </Button>
          </div>
        )} */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}