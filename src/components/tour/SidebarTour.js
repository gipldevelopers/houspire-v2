'use client';

import { useEffect, useRef } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useTour } from '@/context/TourContext';

const SidebarTour = () => {
  const { isTourActive, endTour, hasCompletedTour } = useTour();
  const driverRef = useRef(null);

  useEffect(() => {
    // Check if sidebar tour should start
    if (isTourActive && hasCompletedTour('dashboard')) {
      initializeSidebarTour();
    }
  }, [isTourActive, hasCompletedTour]);

  const initializeSidebarTour = () => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      overlayColor: '#000000',
      overlayOpacity: 0.5,
      smoothScroll: false,
      allowClose: true,
      stagePadding: 5,
      stageRadius: 4,
      steps: [
        {
          element: '.sidebar-renders',
          popover: {
            title: '🎨 3D Renders & Visualizations',
            description: 'View your stunning 3D design renders! See your space come to life with photorealistic visualizations before implementation. Get multiple design options and make informed decisions.',
            side: 'right',
            align: 'start'
          }
        },
        {
          element: '.sidebar-budget',
          popover: {
            title: '💰 Budget & BOQ Management',
            description: 'Access detailed budget breakdowns and Bills of Quantity. Track expenses, view cost estimates, and manage your project budget transparently. No hidden costs!',
            side: 'right',
            align: 'start'
          }
        },
        {
          element: '.sidebar-vendors',
          popover: {
            title: '👥 Vendor Marketplace',
            description: 'Connect with verified interior designers, contractors, and vendors. Browse portfolios, read reviews, compare quotes, and hire trusted professionals for your project.',
            side: 'right',
            align: 'start'
          }
        },
        {
          element: '.sidebar-support',
          popover: {
            title: '🛟 24/7 Expert Support',
            description: 'Get help anytime from our design consultants! We\'re here to assist you with design choices, technical issues, or any questions about your project.',
            side: 'right',
            align: 'start'
          }
        }
      ],
      onDestroyed: () => {
        endTour('sidebar');
      }
    });

    driverRef.current = driverObj;
    driverObj.drive();

    return () => {
      if (driverRef.current) {
        driverRef.current.destroy();
      }
    };
  };

  return null;
};

export default SidebarTour;