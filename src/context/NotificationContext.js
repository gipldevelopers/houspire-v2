// src/context/NotificationContext.js
'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { notificationService } from '@/services/notification.service';
import { useAuth } from '@/context/AuthContext';

const NotificationContext = createContext();

// Notification types - ADDED VENDOR_ASSIGNED
export const NOTIFICATION_TYPES = {
  RENDER_READY: 'RENDER_READY',
  BOQ_READY: 'BOQ_READY',
  VENDOR_ASSIGNED: 'VENDOR_ASSIGNED', // ✅ ADD THIS
  PROJECT_UPDATE: 'PROJECT_UPDATE',
  PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
  SYSTEM_ANNOUNCEMENT: 'SYSTEM_ANNOUNCEMENT'
};

// Action types
const NOTIFICATION_ACTIONS = {
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_AS_READ: 'MARK_AS_READ',
  MARK_ALL_AS_READ: 'MARK_ALL_AS_READ',
  DELETE_NOTIFICATION: 'DELETE_NOTIFICATION',
  SET_LOADING: 'SET_LOADING',
  SET_UNREAD_COUNT: 'SET_UNREAD_COUNT'
};

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null
};

// Reducer
function notificationReducer(state, action) {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
        loading: false
      };

    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      const newNotifications = [action.payload, ...state.notifications];
      return {
        ...state,
        notifications: newNotifications,
        unreadCount: action.payload.isRead ? state.unreadCount : state.unreadCount + 1
      };

    case NOTIFICATION_ACTIONS.MARK_AS_READ:
      const updatedNotifications = state.notifications.map(notification =>
        notification.id === action.payload
          ? { ...notification, isRead: true }
          : notification
      );
      
      const wasUnread = state.notifications.find(n => n.id === action.payload && !n.isRead);
      
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount
      };

    case NOTIFICATION_ACTIONS.MARK_ALL_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification => ({
          ...notification,
          isRead: true
        })),
        unreadCount: 0
      };

    case NOTIFICATION_ACTIONS.DELETE_NOTIFICATION:
      const deletedNotification = state.notifications.find(n => n.id === action.payload);
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
        unreadCount: deletedNotification && !deletedNotification.isRead 
          ? state.unreadCount - 1 
          : state.unreadCount
      };

    case NOTIFICATION_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case NOTIFICATION_ACTIONS.SET_UNREAD_COUNT:
      return {
        ...state,
        unreadCount: action.payload
      };

    default:
      return state;
  }
}

export function NotificationProvider({ children }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { user } = useAuth();

  // Load notifications on mount and when user changes
  useEffect(() => {
    if (user) {
      loadNotifications();
      loadUnreadCount();
      
      // Set up polling for real-time notifications
      const interval = setInterval(() => {
        loadNotifications();
        loadUnreadCount();
      }, 30000); // Poll every 30 seconds

      return () => clearInterval(interval);
    } else {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_NOTIFICATIONS, payload: [] });
      dispatch({ type: NOTIFICATION_ACTIONS.SET_UNREAD_COUNT, payload: 0 });
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    
    try {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_LOADING, payload: true });
      const result = await notificationService.getUserNotifications();
      
      if (result.success) {
        dispatch({ 
          type: NOTIFICATION_ACTIONS.SET_NOTIFICATIONS, 
          payload: result.data.notifications || [] 
        });
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadUnreadCount = async () => {
    if (!user) return;
    
    try {
      const result = await notificationService.getUnreadCount();
      if (result.success) {
        dispatch({ 
          type: NOTIFICATION_ACTIONS.SET_UNREAD_COUNT, 
          payload: result.data.count || 0 
        });
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const addNotification = (notification) => {
    dispatch({ 
      type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION, 
      payload: notification 
    });
  };

  const markAsRead = async (notificationId) => {
    try {
      const result = await notificationService.markAsRead(notificationId);
      if (result.success) {
        dispatch({ 
          type: NOTIFICATION_ACTIONS.MARK_AS_READ, 
          payload: notificationId 
        });
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const result = await notificationService.markAllAsRead();
      if (result.success) {
        dispatch({ type: NOTIFICATION_ACTIONS.MARK_ALL_AS_READ });
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const result = await notificationService.deleteNotification(notificationId);
      if (result.success) {
        dispatch({ 
          type: NOTIFICATION_ACTIONS.DELETE_NOTIFICATION, 
          payload: notificationId 
        });
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const value = {
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    loading: state.loading,
    loadNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadUnreadCount,
    refreshNotifications: loadNotifications // Added for manual refresh
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};