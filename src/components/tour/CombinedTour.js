// src/components/tour/CombinedTour.js
'use client';

import { useEffect, useRef } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useTour } from '@/context/TourContext';
import { usePathname } from 'next/navigation';

const CombinedTour = () => {
  const { isTourActive, endTour, hasCompletedTour } = useTour();
  const pathname = usePathname();
  const driverRef = useRef(null);

  useEffect(() => {
    // Don't initialize if tour is completed
    if (hasCompletedTour('combined')) {
      return;
    }

    if (isTourActive && pathname === '/dashboard') {
      initializeCombinedTour();
    }
  }, [isTourActive, pathname, hasCompletedTour]);

  const initializeCombinedTour = () => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      overlayColor: '#000000',
      overlayOpacity: 0.7,
      smoothScroll: true,
      allowClose: true,
      stagePadding: 10,
      stageRadius: 8,
      disableActiveInteraction: true,
      steps: [
        // Dashboard Steps
        {
          element: '.dashboard-header',
          popover: {
            title: '🎉 Welcome to Houspire Dashboard!',
            description: 'Let me show you around your new design studio. This is where you\'ll manage all your interior design projects.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '.quick-actions',
          popover: {
            title: '🚀 Quick Actions',
            description: 'Access frequently used features like viewing renders, budget details, vendor marketplace, and support.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '.new-project-btn',
          popover: {
            title: '✨ Create New Project',
            description: 'Start a new interior design project by clicking this button. We\'ll guide you through the process step by step.',
            side: 'left',
            align: 'start'
          }
        },
        {
          element: '.projects-section',
          popover: {
            title: '📁 Your Design Projects',
            description: 'Manage all your projects here. Create new projects, filter by status, and track their progress.',
            side: 'top',
            align: 'start'
          }
        },
     
        // Sidebar Steps
        {
          element: '.sidebar-renders',
          popover: {
            title: '🎨 3D Renders & Visualizations',
            description: 'View your stunning 3D design renders! See your space come to life with photorealistic visualizations before implementation.',
            side: 'right',
            align: 'start'
          }
        },
        {
          element: '.sidebar-budget',
          popover: {
            title: '💰 Budget & BOQ Management',
            description: 'Access detailed budget breakdowns and Bills of Quantity. Track expenses, view cost estimates, and manage your project budget transparently.',
            side: 'right',
            align: 'start'
          }
        },
        {
          element: '.sidebar-vendors',
          popover: {
            title: '👥 Vendor Marketplace',
            description: 'Connect with verified interior designers, contractors, and vendors. Browse portfolios, read reviews, and hire trusted professionals.',
            side: 'right',
            align: 'start'
          }
        },
        {
          element: '.sidebar-support',
          popover: {
            title: '🛟 Expert Support',
            description: 'Get help anytime from our design consultants! We\'re here to assist you with design choices, technical issues, or any questions.',
            side: 'right',
            align: 'start'
          }
        }
      ],
      onDestroyed: () => {
        endTour('combined'); // Mark both tours as completed
      }
    });

    driverRef.current = driverObj;

    if (isTourActive) {
      driverObj.drive();
    }

    return () => {
      if (driverRef.current) {
        driverRef.current.destroy();
      }
    };
  };

  return null;
};

export default CombinedTour;