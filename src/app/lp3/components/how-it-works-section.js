'use client';

import { useEffect, useState, useRef } from 'react';

export function HowItWorksSection() {
  const [mounted, setMounted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    setMounted(true);
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
  }, [mounted]);

  // Function to scroll to specific slide
  const goToSlide = (index) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const firstCard = carousel.querySelector('.snap-center');
    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth;
    const gap = 16; // gap-4 = 16px
    const totalCardWidth = cardWidth + gap;

    carousel.scrollTo({
      left: index * totalCardWidth,
      behavior: 'smooth'
    });
    setCurrentSlide(index);
  };

  return (
    <section id="how-it-works" className="bg-gradient-to-br from-purple-600 to-purple-800 py-10 sm:py-12 md:py-16 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-white leading-tight">
            Your Design in 5 Simple Steps
          </h2>
          <p className="text-purple-100 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
            From empty space to dream home in just 72 hours
          </p>
        </div>

        {/* Desktop: Horizontal Timeline with Progress Bar */}
        <div className="hidden md:block relative">
          {/* Background line */}
          <div className="absolute top-8 left-8 right-8 h-1 bg-white/30 rounded-full" />

          {/* Animated progress line */}
          <div
            className="absolute top-8 left-8 right-8 h-1 bg-white rounded-full transition-all duration-1000 ease-out"
            style={{
              width: mounted ? 'calc(100% - 4rem)' : '0%'
            }}
          />

          <div className="grid grid-cols-4 gap-8 relative">
            {/* Phase 1: Upload (0h) */}
            <div
              className="text-center transition-all duration-500 ease-out"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(20px)'
              }}
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg relative z-10 transition-transform hover:scale-110">
                <span className="text-3xl">📸</span>
              </div>
              <p className="font-bold text-white mb-1">Upload Photos</p>
              <p className="text-sm text-purple-200">Instant - 0h</p>
            </div>

            {/* Phase 2: 3D Renders (24h) */}
            <div
              className="text-center transition-all duration-500 ease-out delay-150"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(20px)'
              }}
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg relative z-10 transition-transform hover:scale-110">
                <span className="text-3xl">🏠</span>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-xs animate-pulse">✓</span>
              </div>
              <p className="font-bold text-white mb-1">3D Renders</p>
              <p className="text-sm text-purple-200">Ready in 24h</p>
            </div>

            {/* Phase 3: Budget (48h) */}
            <div
              className="text-center transition-all duration-500 ease-out delay-300"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(20px)'
              }}
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg relative z-10 transition-transform hover:scale-110">
                <span className="text-3xl">💰</span>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-xs animate-pulse">✓</span>
              </div>
              <p className="font-bold text-white mb-1">Budget Ready</p>
              <p className="text-sm text-purple-200">Ready in 48h</p>
            </div>

            {/* Phase 4: Vendors Ready (72h) */}
            <div
              className="text-center transition-all duration-500 ease-out delay-[450ms]"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(20px)'
              }}
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg relative z-10 transition-transform hover:scale-110">
                <span className="text-3xl">🔧</span>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-xs animate-pulse">✓</span>
              </div>
              <p className="font-bold text-white mb-1">Vendors Ready</p>
              <p className="text-sm text-purple-200">Ready in 72h</p>
            </div>
          </div>
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="md:hidden flex flex-col gap-6 max-w-sm mx-auto">
          {/* Phase 1: Upload (0h) */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-3xl">📸</span>
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold text-white">Upload Photos</p>
              <p className="text-sm text-purple-200">Instant - 0h</p>
            </div>
          </div>

          {/* Processing indicator 1 */}
          <div className="flex items-center gap-4 pl-8">
            <div className="w-1 h-8 bg-white/30 rounded-full" />
            <p className="text-sm text-purple-200">Processing your space...</p>
          </div>

          {/* Phase 2: 3D Renders (24h) */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg relative">
              <span className="text-3xl">🏠</span>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-xs">✓</span>
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold text-white">3D Renders</p>
              <p className="text-sm text-purple-200">Ready in 24h</p>
            </div>
          </div>

          {/* Processing indicator 2 */}
          <div className="flex items-center gap-4 pl-8">
            <div className="w-1 h-8 bg-white/30 rounded-full" />
            <p className="text-sm text-purple-200">Calculating costs...</p>
          </div>

          {/* Phase 3: Budget (48h) */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg relative">
              <span className="text-3xl">💰</span>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-xs">✓</span>
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold text-white">Budget Ready</p>
              <p className="text-sm text-purple-200">Ready in 48h</p>
            </div>
          </div>

          {/* Processing indicator 3 */}
          <div className="flex items-center gap-4 pl-8">
            <div className="w-1 h-8 bg-white/30 rounded-full" />
            <p className="text-sm text-purple-200">Sourcing vendors...</p>
          </div>

          {/* Phase 4: Vendors Ready (72h) */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg relative">
              <span className="text-3xl">🔧</span>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-xs">✓</span>
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold text-white">Vendors Ready</p>
              <p className="text-sm text-purple-200">Ready in 72h</p>
            </div>
          </div>
        </div>

        {/* Three Main Cards - Mobile Carousel, Desktop Grid */}
        <div
          ref={carouselRef}
          className="md:grid md:grid-cols-3 md:gap-6 flex md:flex-none overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide pb-4 md:overflow-visible md:px-0 -mx-3 sm:-mx-4 px-3 sm:px-4 mt-8 sm:mt-12 touch-pan-x"
        >
          <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-lg sm:rounded-xl text-center hover:bg-white/15 transition-colors min-w-[85vw] sm:min-w-[80vw] md:min-w-0 snap-center">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📤</div>
            <h3 className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2 text-white">Upload Photos & Preferences</h3>
            <p className="text-purple-100 text-xs sm:text-sm">
              We analyze your space in 24 hours
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-lg sm:rounded-xl text-center hover:bg-white/15 transition-colors min-w-[85vw] sm:min-w-[80vw] md:min-w-0 snap-center">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎨</div>
            <h3 className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2 text-white">Choose Your Style</h3>
            <p className="text-purple-100 text-xs sm:text-sm">
              Select from 20 curated Indian & global styles
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-lg sm:rounded-xl text-center hover:bg-white/15 transition-colors min-w-[85vw] sm:min-w-[80vw] md:min-w-0 snap-center">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📦</div>
            <h3 className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2 text-white">Get Everything in 72 Hours</h3>
            <p className="text-purple-100 text-xs sm:text-sm">
              Complete package delivered with full transparency
            </p>
          </div>
        </div>

        {/* Mobile carousel indicators */}
        <div className="flex justify-center gap-2 mt-4 md:hidden">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToSlide(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${currentSlide === index
                  ? 'bg-white w-8'
                  : 'bg-white/50 w-2 hover:bg-white/70'
                }`}
              aria-label={`Go to slide ${index + 1}`}
              type="button"
            />
          ))}
        </div>
      </div>
    </section>
  );
}