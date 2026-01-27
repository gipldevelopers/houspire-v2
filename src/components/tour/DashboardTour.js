'use client';

import { useEffect, useRef } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useTour } from '@/context/TourContext';
import { usePathname } from 'next/navigation';

const DashboardTour = () => {
  const { isTourActive, currentStep, endTour, nextStep, prevStep, hasCompletedTour } = useTour();
  const pathname = usePathname();
  const driverRef = useRef(null);

  useEffect(() => {
    if (isTourActive && pathname === '/dashboard') {
      initializeDashboardTour();
    }
  }, [isTourActive, currentStep, pathname]);

  const initializeDashboardTour = () => {
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
        // {
        //   element: '.stats-cards',
        //   popover: {
        //     title: '📊 Project Statistics',
        //     description: 'Track your active projects, design timeline, success rate, and total investment at a glance.',
        //     side: 'bottom',
        //     align: 'start'
        //   }
        // },
        // {
        //   element: '.progress-section',
        //   popover: {
        //     title: '⏱️ 72-Hour Design Progress',
        //     description: 'Monitor your projects through our 3-phase design process with real-time progress tracking.',
        //     side: 'bottom',
        //     align: 'start'
        //   }
        // },
        {
          element: '.projects-section',
          popover: {
            title: '📁 Your Design Projects',
            description: 'Manage all your projects here. Create new projects, filter by status, and track their progress.',
            side: 'top',
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
          element: '.sidebar-tour-trigger',
          popover: {
            title: '🧭 Navigation Menu',
            description: 'Use the sidebar to navigate between different sections: Projects, Renders, Budget, Vendors, and more.',
            side: 'right',
            align: 'start'
          }
        }
      ],
      onDestroyed: () => {
        endTour('dashboard');
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

export default DashboardTour;