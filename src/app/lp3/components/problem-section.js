// src\app\lp3\components\problem-section.js
'use client';

import { useState } from 'react';
import { PlanningWizardModal } from './PlanningWizardModal';

export function ProblemSection({ isMobile }) {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  return (
    <section id='problem' className="bg-gradient-to-br from-red-50 to-orange-50 py-8 sm:py-12 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 sm:mb-4 leading-tight">
          Why You're Overpaying By ₹4.5 Lakhs
        </h2>
        <p className="text-center text-sm sm:text-base text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto px-2">
          Traditional designers add hidden mark-ups at every step. We show you exactly where your money goes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💸</div>
            <h3 className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2">40% Designer Commission</h3>
            <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
              They mark up every material and service without telling you.
            </p>
            {/* <p className="text-xl sm:text-2xl font-bold text-red-600">₹1.8L approx hidden</p> */}
            <p className="text-xl sm:text-2xl font-bold text-red-600">₹1.8L approx. hidden</p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🏪</div>
            <h3 className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2">Vendor Markups</h3>
            <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
              {/* Multiple middlemen between you and actual makers */}
              Multiple middlemen between you and the actual makers.
            </p>
            <p className="text-xl sm:text-2xl font-bold text-red-600">₹1.5L approx. wasted</p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm sm:col-span-2 md:col-span-1">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">⏰</div>
            <h3 className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2">Revision Delays</h3>
            <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
              Waiting weeks for designs costs you more rent – and a lot more stress.
            </p>
            <p className="text-xl sm:text-2xl font-bold text-red-600">₹1.2L approx. extra</p>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <div className="inline-block bg-red-100 px-4 sm:px-6 py-2 sm:py-3 rounded-full">
              <p className="text-xs sm:text-sm text-red-800">
                <span className="font-bold">Traditional Total:</span> ₹8.5L for a 3BHK
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedPackage(499);
                setIsWizardOpen(true);
              }}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full font-bold text-sm sm:text-base hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Start with ₹499 →
            </button>
          </div>
        </div>
      </div>

      {/* Planning Wizard Modal */}
      <PlanningWizardModal
        open={isWizardOpen}
        onOpenChange={(open) => {
          setIsWizardOpen(open);
          if (!open) {
            setSelectedPackage(null);
          }
        }}
        selectedPackage={selectedPackage}
      />
    </section>
  );
}

