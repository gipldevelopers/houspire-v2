// src\app\lp3\components\wizard\Step3.js
'use client';

import { IndianRupee, Calendar, Target, Clock, Lightbulb, Zap } from "lucide-react";

export const Step3 = ({ formData, onUpdate }) => {
  const budgetRanges = [
    { value: 'ECONOMY', label: 'Economy', range: '₹5-10 Lakhs', icon: Target },
    { value: 'STANDARD', label: 'Standard', range: '₹10-25 Lakhs', icon: Clock },
    { value: 'PREMIUM', label: 'Premium', range: '₹25-50 Lakhs', icon: Lightbulb },
    { value: 'LUXURY', label: 'Luxury', range: '₹50 Lakhs +', icon: Zap }
  ];

  const timelines = [
    { value: 'URGENT', label: 'Urgent', duration: '2-4 weeks', icon: Zap },
    { value: 'STANDARD', label: 'Standard', duration: '1-2 months', icon: Clock },
    { value: 'FLEXIBLE', label: 'Flexible', duration: '2+ months', icon: Calendar }
  ];

  const handleBudgetSelect = (value) => {
    onUpdate({ ...formData, budgetRange: value });
  };

  const handleTimelineSelect = (value) => {
    onUpdate({ ...formData, timeline: value });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-[#e48b53]/10 rounded-2xl flex items-center justify-center mx-auto">
          <IndianRupee className="w-6 h-6 text-[#e48b53]" />
        </div>
        <h2 className="text-2xl font-bold text-[#042939]">
          Budget & Timeline
        </h2>
        <p className="text-[#042939] text-sm">Set your investment range and project timeline</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-[#042939] flex items-center gap-2">
            <IndianRupee className="w-4 h-4" />
            Budget Range *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {budgetRanges.map((range) => {
              const Icon = range.icon;
              const isSelected = formData.budgetRange === range.value;
              
              return (
                <div
                  key={range.value}
                  onClick={() => handleBudgetSelect(range.value)}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-[#e48b53] bg-[#e48b53]/5' 
                      : 'border-gray-200 hover:border-[#e48b53]/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#e48b53]" />
                    <div>
                      <div className="font-medium text-sm text-[#042939]">{range.label}</div>
                      <div className="text-xs text-[#042939]/70">{range.range}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-[#042939] flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Project Timeline *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {timelines.map((timeline) => {
              const Icon = timeline.icon;
              const isSelected = formData.timeline === timeline.value;
              
              return (
                <div
                  key={timeline.value}
                  onClick={() => handleTimelineSelect(timeline.value)}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-[#e48b53] bg-[#e48b53]/5' 
                      : 'border-gray-200 hover:border-[#e48b53]/30'
                  }`}
                >
                  <div className="text-center">
                    <Icon className="w-4 h-4 text-[#e48b53] mx-auto mb-1" />
                    <div className="font-medium text-sm text-[#042939]">{timeline.label}</div>
                    <div className="text-xs text-[#042939]/70">{timeline.duration}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};