// src\app\lp3\components\wizard\Step2.js
'use client';

import { useState, useEffect } from 'react';
import { MapPin, Ruler, Hash } from "lucide-react";

export const Step2 = ({ formData, onUpdate }) => {
  // Initialize localData with default values to prevent uncontrolled to controlled change
  const [localData, setLocalData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    areaSqFt: '',
    pincode: '',
    ...formData // This ensures we have all required properties
  });

  // Update localData when formData changes from parent
  useEffect(() => {
    setLocalData(prev => ({
      title: '',
      description: '',
      address: '',
      city: '',
      areaSqFt: '',
      pincode: '',
      ...prev,
      ...formData
    }));
  }, [formData]);

  const handleChange = (field, value) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onUpdate(newData);
  };

  // Format pincode input to accept only numbers
  const handlePincodeChange = (value) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    // Limit to 6 digits
    const formattedValue = numericValue.slice(0, 6);
    handleChange('pincode', formattedValue);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#e48b53]/10 rounded-2xl flex items-center justify-center mx-auto">
          <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#e48b53]" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#042939] px-2">
          Space Details
        </h2>
        <p className="text-[#042939] text-xs sm:text-sm px-4">Tell us about your space</p>
      </div>
      
      <div className="grid gap-3 sm:gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#042939]">
            Project Title *
          </label>
          <input
            type="text"
            placeholder="e.g., Modern 3BHK Apartment Design"
            value={localData.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:border-[#e48b53] focus:ring-1 focus:ring-[#e48b53] outline-none bg-white text-gray-900"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#042939]">
            Project Description (Optional)
          </label>
          <textarea
            placeholder="Describe your vision, requirements, and any specific needs..."
            value={localData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:border-[#e48b53] focus:ring-1 focus:ring-[#e48b53] outline-none min-h-[70px] sm:min-h-[80px] resize-none bg-white text-gray-900"
          />
        </div>

        {/* Complete Address Field */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#042939]">
            Complete Address (Optional)
          </label>
          <input
            type="text"
            placeholder="Full street address with landmark"
            value={localData.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:border-[#e48b53] focus:ring-1 focus:ring-[#e48b53] outline-none bg-white text-gray-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#042939]">
              City *
            </label>
            <input
              type="text"
              placeholder="Mumbai"
              value={localData.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:border-[#e48b53] focus:ring-1 focus:ring-[#e48b53] outline-none bg-white text-gray-900"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#042939] flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Pincode *
            </label>
            <input
              type="text"
              placeholder="Enter 6-digit pincode"
              value={localData.pincode || ''}
              onChange={(e) => handlePincodeChange(e.target.value)}
              className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:border-[#e48b53] focus:ring-1 focus:ring-[#e48b53] outline-none bg-white text-gray-900"
              maxLength="6"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#042939] flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              Area (sq ft)
            </label>
            <input
              type="number"
              placeholder="1200"
              value={localData.areaSqFt || ''}
              onChange={(e) => handleChange('areaSqFt', e.target.value)}
              className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:border-[#e48b53] focus:ring-1 focus:ring-[#e48b53] outline-none bg-white text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
        <div className="flex items-start gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
            <span className="text-white text-xs font-bold">i</span>
          </div>
          <div>
            <p className="text-blue-800 text-xs font-medium mb-1">
              Why we need your pincode
            </p>
            <p className="text-blue-700 text-xs">
              Your pincode helps us provide location-specific design recommendations, material availability, and connect you with local service providers if needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};