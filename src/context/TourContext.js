// src/context/TourContext.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { userService } from "@/services/user.service";

const TourContext = createContext();

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
};

export const TourProvider = ({ children }) => {
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedTours, setCompletedTours] = useState([]);
  const [showTourPrompt, setShowTourPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  // Load completed tours and check if we should show tour
  useEffect(() => {
    const initializeTour = async () => {
      if (typeof window !== "undefined") {
        // Load completed tours from localStorage
        const savedTours = localStorage.getItem("completedTours");
        if (savedTours) {
          setCompletedTours(JSON.parse(savedTours));
        }

        // Check if user has manually dismissed tour
        const tourDismissed = localStorage.getItem("tourDismissed") === "true";

        setIsLoading(false);

        // Show tour prompt if user is new and hasn't dismissed it
        if (isAuthenticated && user && !tourDismissed) {
          try {
            // Check both database and local storage
            const hasSeenTourLocal =
              localStorage.getItem("userSeenTour") === "true";

            // If not seen locally, check database
            if (!hasSeenTourLocal) {
              const tourStatus = await userService.getTourStatus();
              const hasSeenTourInDB = tourStatus.success
                ? tourStatus.data.hasSeenTour
                : false;

              // If not seen in DB either, show prompt
              if (!hasSeenTourInDB) {
                setTimeout(() => {
                  setShowTourPrompt(true);
                }, 3000);
              } else {
                // User has seen tour in DB, update local storage
                localStorage.setItem("userSeenTour", "true");
                localStorage.setItem("tourDismissed", "true");
              }
            }
          } catch (error) {
            console.error("Error checking tour status:", error);
            // Fallback to local storage check
            if (!localStorage.getItem("userSeenTour")) {
              setTimeout(() => {
                setShowTourPrompt(true);
              }, 3000);
            }
          }
        }
      }
    };

    initializeTour();
  }, [isAuthenticated, user]);

  const hasCompletedTour = (tourName) => {
    return completedTours.includes(tourName);
  };

  // ✅ FIXED: Mark tour as completed with proper API call
  const markTourCompleted = async (tourName) => {
    try {
      // Update local state - mark this specific tour as completed
      const updatedTours = [...completedTours, tourName];
      setCompletedTours(updatedTours);
      localStorage.setItem("completedTours", JSON.stringify(updatedTours));
    } catch (error) {
      console.error("❌ Error marking tour as completed:", error);
    }
  };

  // ✅ NEW: Mark user as having seen tour (for automatic prompts)
  const markTourSeen = async () => {
    try {
      // Mark user as having seen tour (for automatic prompts)
      localStorage.setItem("userSeenTour", "true");
      localStorage.setItem("tourDismissed", "true");

      // Update in database
      if (user) {
        const result = await userService.updateTourStatus(true);
      }
    } catch (error) {
      console.error("❌ Error marking tour as seen:", error);
    }
  };

  // ✅ NEW: Handle user dismissing the tour prompt
  const dismissTour = async () => {
    try {
      setShowTourPrompt(false);
      await markTourSeen(); // Mark as seen but NOT completed
    } catch (error) {
      console.error("Error dismissing tour:", error);
    }
  };

  // ✅ NEW: Handle user accepting the tour
  const acceptTour = async () => {
    setShowTourPrompt(false);
    startTour("combined");
  };

  // ✅ FIXED: Start tour function - allow manual start even if user has seen tour before
  const startTour = (tourName) => {
    // Don't prevent manual starts even if user has seen tour before
    if (hasCompletedTour(tourName)) {
      // Clear the completed status for manual restart
      const updatedTours = completedTours.filter((tour) => tour !== tourName);
      setCompletedTours(updatedTours);
      localStorage.setItem("completedTours", JSON.stringify(updatedTours));
    }
    setIsTourActive(true);
    setCurrentStep(0);
  };

  // ✅ FIXED: End tour function
  const endTour = (tourName) => {
    setIsTourActive(false);
    setCurrentStep(0);
    if (tourName) {
      markTourCompleted(tourName); // Mark this specific tour as completed
    }
  };

  // ✅ NEW: Reset tour for manual restart
  const resetTour = (tourName) => {
    const updatedTours = completedTours.filter((tour) => tour !== tourName);
    setCompletedTours(updatedTours);
    localStorage.setItem("completedTours", JSON.stringify(updatedTours));
    setIsTourActive(false);
    setCurrentStep(0);
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const value = {
    isTourActive,
    currentStep,
    showTourPrompt,
    isLoading,
    startTour,
    endTour,
    nextStep,
    prevStep,
    hasCompletedTour,
    markTourCompleted,
    markTourSeen,
    dismissTour,
    acceptTour,
    resetTour, // ✅ Add this new function
  };

  return (
    <TourContext.Provider value={value}>
      {children}

      {/* Tour Prompt Modal */}
      {showTourPrompt && (
        <TourPromptModal onAccept={acceptTour} onDismiss={dismissTour} />
      )}
    </TourContext.Provider>
  );
};

// Tour Prompt Modal Component
const TourPromptModal = ({ onAccept, onDismiss }) => {
  const handleBackdropClick = (e) => {
    // Only close if clicking directly on the backdrop, not on the modal content
    if (e.target === e.currentTarget) {
      onDismiss();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-48 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-auto shadow-xl animate-in fade-in duration-300">
        <div className="text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to Houspire! 🎉
          </h3>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Would you like a quick tour of your dashboard? We'll show you around
            and help you get started with your interior design projects.
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium cursor-pointer"
              type="button"
            >
              No thanks
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAccept();
              }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg cursor-pointer"
              type="button"
            >
              Start Tour
            </button>
          </div>

          {/* Help text */}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            You can always start the tour later from the dashboard header.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TourPromptModal;
