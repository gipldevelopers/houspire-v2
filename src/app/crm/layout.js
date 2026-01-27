// src/app/crm/layout.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import CRMSidebar from '@/components/crm/CRMSidebar';
import CRMHeader from '@/components/crm/CRMHeader';
import Footer from '@/components/dashboard/Footer';

export default function CRMLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth/crm/signin');
        return;
      }
      
      // Check for correct role
      const allowedRoles = ['CRM_ADMIN', 'ADMIN', 'SUPER_ADMIN'];
      if (user && !allowedRoles.includes(user.role)) {
        router.push('/auth/crm/signin');
      }
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Prevent rendering if not authenticated or authorized
  const allowedRoles = ['CRM_ADMIN', 'ADMIN', 'SUPER_ADMIN'];
  if (!isAuthenticated || (user && !allowedRoles.includes(user.role))) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-background">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <CRMSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <CRMHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="animate-fade-in">{children}</div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
