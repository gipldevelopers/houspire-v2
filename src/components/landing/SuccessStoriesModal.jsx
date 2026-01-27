'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Clock, TrendingUp, Users, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SuccessStoriesModal = ({ onClose }) => {
  const [currentStory, setCurrentStory] = useState(0);

  const successStories = [
    {
      id: 1,
      name: "Rohan & Priya Singh",
      location: "3BHK, Andheri West, Mumbai",
      duration: "45 days",
      savings: "₹3.2 Lakhs",
      quote: "We saved enough for our dream vacation! Traditional designers quoted ₹8L, Houspire delivered better designs for just ₹4,999.",
      beforeImage: "https://images.unsplash.com/photo-1616587226154-91eab0a51dc7?auto=format&fit=crop&w=800",
      afterImage: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w-800",
      vendors: 7,
      budget: "₹15 Lakhs",
      area: "1200 sq ft"
    },
    {
      id: 2,
      name: "Arjun Mehta",
      location: "2BHK, Koramangala, Bangalore",
      duration: "32 days",
      savings: "₹2.8 Lakhs",
      quote: "As a working professional, I needed quick solutions. Got everything in 72 hours - design, budget, and vendor contacts!",
      beforeImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800",
      afterImage: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=800",
      vendors: 5,
      budget: "₹12 Lakhs",
      area: "950 sq ft"
    },
    {
      id: 3,
      name: "Neha & Vikram Sharma",
      location: "Villa, Whitefield, Bangalore",
      duration: "60 days",
      savings: "₹7.5 Lakhs",
      quote: "For our villa renovation, architects quoted ₹20L+. Houspire gave us complete architectural plans for just ₹14,999!",
      beforeImage: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=800",
      afterImage: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800",
      vendors: 12,
      budget: "₹45 Lakhs",
      area: "2800 sq ft"
    }
  ];

  const nextStory = () => {
    setCurrentStory((prev) => (prev + 1) % successStories.length);
  };

  const prevStory = () => {
    setCurrentStory((prev) => (prev - 1 + successStories.length) % successStories.length);
  };

  const story = successStories[currentStory];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Real Success Stories</h2>
            <p className="text-gray-600">See how our customers transformed their homes</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Before/After Images */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Before</h3>
                <div className="relative h-64 rounded-xl overflow-hidden">
                  <img 
                    src={story.beforeImage} 
                    alt="Before" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Before
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">After</h3>
                <div className="relative h-64 rounded-xl overflow-hidden">
                  <img 
                    src={story.afterImage} 
                    alt="After" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    After
                  </div>
                </div>
              </div>
            </div>

            {/* Story Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{story.name}</h3>
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{story.location}</span>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-gray-700 italic">"{story.quote}"</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-700 mb-1">{story.savings}</div>
                  <div className="text-sm text-green-600">Total Savings</div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-700 mb-1">{story.vendors}</div>
                  <div className="text-sm text-purple-600">Vendors Found</div>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-700 mb-1">{story.duration}</div>
                  <div className="text-sm text-orange-600">Project Duration</div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700 mb-1">{story.area}</div>
                  <div className="text-sm text-blue-600">Area</div>
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Project Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Design Package Cost</span>
                    <span className="font-semibold">₹4,999</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Renovation Budget</span>
                    <span className="font-semibold">{story.budget}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Savings vs Traditional</span>
                    <span className="font-semibold text-green-600">{story.savings}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2">
              {successStories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStory(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStory ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={prevStory}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <span className="text-sm text-gray-600">
                {currentStory + 1} / {successStories.length}
              </span>
              
              <button
                onClick={nextStory}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Ready for your success story?</p>
              <p className="text-sm text-gray-600">Join {successStories.length}+ happy families</p>
            </div>
            
            <Button
              onClick={() => {
                onClose();
                // Open wizard or redirect
                window.location.href = '/#pricing';
              }}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              Start Your Journey
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};