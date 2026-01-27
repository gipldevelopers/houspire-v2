// src\components\auth\ProtectedRoute.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Redirect to login if not authenticated
      if (!isAuthenticated) {
        router.push('/auth/signin');
        return;
      }

      // Check role-based access
      if (requiredRole) {
        const userRole = user?.role?.toLowerCase();
        const requiredRoleLower = requiredRole.toLowerCase();
        
        if (userRole !== requiredRoleLower) {
          // Redirect based on user role
          if (userRole === 'admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/dashboard');
          }
          return;
        }
      }

      // Redirect authenticated users away from auth pages
      const isAuthPage = window.location.pathname.includes('/auth');
      if (isAuthPage && isAuthenticated) {
        if (user?.role?.toLowerCase() === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      }
    }
  }, [isAuthenticated, loading, user, router, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
};

// Specific route protectors
export const UserRoute = ({ children }) => (
  <ProtectedRoute requiredRole="user">{children}</ProtectedRoute>
);

export const AdminRoute = ({ children }) => (
  <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>
);

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      // Redirect authenticated users to appropriate dashboard
      if (user?.role?.toLowerCase() === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return !isAuthenticated ? children : null;
};