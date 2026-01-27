// src/app/dashboard/layout.js
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { useState } from 'react';
import Footer from '@/components/dashboard/Footer';
import PhoneNumberModal from '@/components/dashboard/PhoneNumberModal';
import { userService } from '@/services/user.service';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [checkingPhone, setCheckingPhone] = useState(true);
  const { user, isAuthenticated, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth/signin');
      } else if (isAdmin) {
        router.push('/admin/dashboard');
      }
    }
  }, [isAuthenticated, loading, isAdmin, router]);

  // Check phone number on mount
  useEffect(() => {
    const checkPhoneNumber = async () => {
      // Don't check if already authenticated or admin
      if (loading || !isAuthenticated || isAdmin) {
        setCheckingPhone(false);
        return;
      }

      // Check localStorage first - if phoneNumberReceived exists, skip check
      const phoneReceived = localStorage.getItem('phoneNumberReceived');
      if (phoneReceived === 'true') {
        setCheckingPhone(false);
        setShowPhoneModal(false);
        return;
      }

      try {
        // Check API if user has phone number
        const response = await userService.checkPhoneNumber();
        
        if (response.success) {
          if (response.data.hasPhoneNumber) {
            // User has phone number, store in localStorage
            localStorage.setItem('phoneNumberReceived', 'true');
            setShowPhoneModal(false);
          } else {
            // User doesn't have phone number, show modal
            setShowPhoneModal(true);
          }
        } else {
          // If API fails, still show modal to be safe
          console.error('Error checking phone number:', response.message);
          setShowPhoneModal(true);
        }
      } catch (error) {
        console.error('Error checking phone number:', error);
        // On error, show modal to ensure phone is collected
        setShowPhoneModal(true);
      } finally {
        setCheckingPhone(false);
      }
    };

    // Wait for auth to complete before checking phone
    if (!loading && isAuthenticated && !isAdmin) {
      checkPhoneNumber();
    } else {
      setCheckingPhone(false);
    }
  }, [loading, isAuthenticated, isAdmin]);

  const handlePhoneNumberAdded = () => {
    setShowPhoneModal(false);
    localStorage.setItem('phoneNumberReceived', 'true');
  };

  // Show loading only during initial auth check or phone check
  if (loading || checkingPhone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render if not authenticated or is admin (will be redirected)
  if (!isAuthenticated || isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Phone Number Modal - Non-closable until phone is added */}
      <PhoneNumberModal 
        isOpen={showPhoneModal} 
        onPhoneNumberAdded={handlePhoneNumberAdded}
      />
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 lg:p-8">
          <div className="animate-fade-in">{children}</div>
        </main>

      <Footer  />
      </div>
    </div>
  );
}