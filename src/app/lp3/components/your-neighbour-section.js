// src\app\lp3\components\your-neighbour-section.js
'use client';

import { useState, useEffect, useRef } from 'react';

export function YourNeighbourSection() {
  const [currentLiveDesign, setCurrentLiveDesign] = useState(0);
  const [nextSlotMinutes, setNextSlotMinutes] = useState(3);
  const [nextSlotSeconds, setNextSlotSeconds] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);

  const liveDesigns = [
    {
      initial: 'A',
      name: 'Amit\'s 3BHK, Bangalore',
      time: 'Just now',
      saved: '₹4.5L',
      duration: '52 hours',
      message: 'Best decision ever! Got everything I wanted.',
      image: '/images/customer-dining.jpg'
    },
    {
      initial: 'S',
      name: 'Sneha\'s 2BHK, Pune',
      time: '15 mins ago',
      saved: '₹2.8L',
      duration: '48 hours',
      message: 'Love my new home! Houspire made it so easy.',
      image: '/images/customer-kitchen.jpg'
    },
    {
      initial: 'K',
      name: 'Karan\'s 4BHK, Mumbai',
      time: '30 mins ago',
      saved: '₹5.2L',
      duration: '65 hours',
      message: 'Professional quality at a fraction of the cost!',
      image: '/images/customer-living.png'
    }
  ];

  // Rotate live designs every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLiveDesign((prev) => (prev + 1) % liveDesigns.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setNextSlotSeconds((prev) => {
        if (prev === 0) {
          setNextSlotMinutes((prevMin) => {
            if (prevMin === 0) {
              return 3; // Reset to 3 minutes
            }
            return prevMin - 1;
          });
          return 59;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle scroll to update current slide using Intersection Observer
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const cards = carousel.querySelectorAll('.snap-center');
    if (cards.length === 0) return;

    const observerOptions = {
      root: carousel,
      rootMargin: '0px',
      threshold: 0.5 // Card is considered visible when 50% is in view
    };

    const observers = Array.from(cards).map((card, index) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSlide(index);
          }
        });
      }, observerOptions);

      observer.observe(card);
      return observer;
    });

    // Set initial slide
    setCurrentSlide(0);

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  // Function to scroll to specific slide
  const goToSlide = (index) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const firstCard = carousel.querySelector('.snap-center');
    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth;
    const gap = 16; // gap-4 = 16px on mobile, gap-6 = 24px on larger screens
    const totalCardWidth = cardWidth + gap;

    carousel.scrollTo({
      left: index * totalCardWidth,
      behavior: 'smooth'
    });
    setCurrentSlide(index);
  };

  return (
    <section className="py-10 sm:py-12 md:py-16 px-3 sm:px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 sm:mb-3 text-gray-800 leading-tight">
          Your Neighbors Are Already Saving
        </h2>
        <p className="text-center text-sm sm:text-base text-gray-600 mb-8 sm:mb-12 px-2">Real customers, real savings, real designs</p>

        <div
          ref={carouselRef}
          className="flex md:grid overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none md:grid-cols-3 gap-4 sm:gap-6 scrollbar-hide pb-4 md:pb-0 -mx-3 sm:-mx-4 px-3 sm:px-4 md:mx-0 md:px-0 touch-pan-x"
        >
          {/* Customer Story Card 1 */}
          <div className="min-w-[85vw] sm:min-w-[80vw] md:min-w-0 snap-center bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
            <div className="relative h-40 sm:h-48 bg-gray-900">
              <img
                src="/images/customer-bedroom-1.png"
                alt="Customer design"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-green-500 text-white text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full flex items-center gap-1">
                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full animate-pulse"></span>
                LIVE
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-400 flex items-center justify-center text-xs sm:text-sm font-bold text-white flex-shrink-0">
                  R
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-gray-800 truncate">Rohan's 2BHK, Mumbai</h3>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex justify-between items-center mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-gray-200">
                <div>
                  <p className="text-xs text-gray-600">Saved</p>
                  <p className="text-lg sm:text-xl font-bold text-green-600">₹3.2L</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Delivered in</p>
                  <p className="text-xs sm:text-sm font-semibold text-gray-800">48 hours</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 italic">
                "Houspire saved me lakhs! Professional designs delivered fast."
              </p>
            </div>
          </div>

          {/* Customer Story Card 2 */}
          <div className="min-w-[85vw] sm:min-w-[80vw] md:min-w-0 snap-center bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
            <div className="relative h-40 sm:h-48 bg-gray-900">
              <img
                src="/images/customer-bedroom-2.png"
                alt="Customer design"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-green-500 text-white text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full flex items-center gap-1">
                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full animate-pulse"></span>
                LIVE
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-xs sm:text-sm font-bold text-white flex-shrink-0">
                  P
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-gray-800 truncate">Pooja's 3BHK, Delhi</h3>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
              <div className="flex justify-between items-center mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-gray-200">
                <div>
                  <p className="text-xs text-gray-600">Saved</p>
                  <p className="text-lg sm:text-xl font-bold text-green-600">₹4.1L</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Delivered in</p>
                  <p className="text-xs sm:text-sm font-semibold text-gray-800">60 hours</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 italic">
                "Amazing quality at 30% of what designers quoted me!"
              </p>
            </div>
          </div>

          {/* Customer Story Card 3 - Rotating Live Design */}
          <div className="min-w-[85vw] sm:min-w-[80vw] md:min-w-0 snap-center bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg sm:rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all text-white">
            <div className="relative h-40 sm:h-48 bg-black">
              <img
                src={liveDesigns[currentLiveDesign].image || "/placeholder.svg?height=200&width=400&query=modern interior"}
                alt="Live customer design"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-red-500 text-white text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full flex items-center gap-1 animate-pulse">
                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full animate-pulse"></span>
                UPDATING LIVE
              </div>
              <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                Next: {nextSlotMinutes}:{nextSlotSeconds.toString().padStart(2, '0')}
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center text-xs sm:text-sm font-bold text-gray-900 flex-shrink-0">
                  {liveDesigns[currentLiveDesign].initial}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base truncate">{liveDesigns[currentLiveDesign].name}</h3>
                  <p className="text-xs text-gray-400">{liveDesigns[currentLiveDesign].time}</p>
                </div>
              </div>
              <div className="flex justify-between items-center mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-gray-700">
                <div>
                  <p className="text-xs text-gray-400">Saved</p>
                  <p className="text-lg sm:text-xl font-bold text-green-400">{liveDesigns[currentLiveDesign].saved}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Delivered in</p>
                  <p className="text-xs sm:text-sm font-semibold">{liveDesigns[currentLiveDesign].duration}</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 italic mb-3 sm:mb-4">
                "{liveDesigns[currentLiveDesign].message}"
              </p>
              <button
                onClick={() => window.location.href = 'https://wa.me/917075827625?text=I%20want%20to%20get%20my%20design%20like%20this%20one'}
                className="w-full bg-gradient-to-r from-green-400 to-blue-400 text-black py-2 sm:py-2.5 rounded-lg font-bold text-xs sm:text-sm hover:opacity-90 transition-all"
              >
                Get Your Design Now →
              </button>
            </div>
          </div>
        </div>

        <div className="flex md:hidden justify-center gap-2 mt-4 sm:mt-6">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToSlide(index);
              }}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${currentSlide === index
                  ? 'bg-purple-400 w-6 sm:w-8'
                  : 'bg-gray-300 w-1.5 sm:w-2 hover:bg-gray-400'
                }`}
              aria-label={`Go to slide ${index + 1}`}
              type="button"
            />
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-8 sm:mt-12 bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">2,847+</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Happy Customers</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">₹87 Cr+</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Total Savings</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600">48-72h</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Avg. Delivery</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-orange-600">4.8★</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Customer Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
