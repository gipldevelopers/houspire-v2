// src\app\lp3\components\testinominal-section.js
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, CheckCircle2 } from "lucide-react";
import { PlanningWizardModal } from "./PlanningWizardModal";

export function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const testimonials = [
    {
      name: "Divya Sharma",
      location: "Bangalore",
      quote:
        "Saved ₹3.2 lakhs compared to what Livspace quoted. Got 6 vendor options!",
      beforeImage: "/images/customer-review/1.jpg",
      afterImage:
        "/images/customer-review/2.jpg",
      verified: true,
      rating: 5,
      apartmentType: "3BHK",
      image:
        "/images/customer-review/3.jpg",
    },
    {
      name: "Arjun Verma",
      location: "Andheri, Mumbai",
      quote: "₹4,999 perfect for my 2BHK in Andheri - got 8 vendor quotes!",
      beforeImage:
        "/images/customer-review/4.jpg",
      afterImage:
        "/images/customer-review/5.jpg",
      verified: true,
      rating: 5,
      apartmentType: "2BHK",
      image:
        "/images/customer-review/6.jpg",
    },
    {
      name: "Sneha Patel",
      location: "Gurgaon",
      quote:
        "From boring to breathtaking. My guests can't believe it's the same home!",
      beforeImage:
        "/images/customer-review/7.jpg",
      afterImage:
        "/images/customer-review/8.jpg",
      verified: true,
      rating: 4,
      apartmentType: "3BHK",
      image:
        "/images/customer-review/9.jpg",
    },
    {
      name: "Rahul Mehta",
      location: "Pune",
      quote:
        "72-hour turnaround was incredible. Traditional designers wanted 3 weeks just for initial sketches!",
      beforeImage:
        "/images/customer-review/10.jpg",
      afterImage:
        "/images/customer-review/11.jpg",
      verified: true,
      rating: 5,
      apartmentType: "2BHK",
      image:
        "/images/customer-review/12.jpg",
    },
    {
      name: "Anita Desai",
      location: "Hyderabad",
      quote:
        "Villa design at a fraction of architect fees. Premium vendors, zero middleman markup.",
      beforeImage:
        "/images/customer-review/13.jpg",
      afterImage:
        "/images/customer-review/14.jpg",
      verified: true,
      rating: 5,
      apartmentType: "Villa",
      image:
        "/images/customer-review/15.jpg",
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        setIsTransitioning(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const goToNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      setIsTransitioning(false);
    }, 300);
  };

  const goToPrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentTestimonial(
        (prev) => (prev - 1 + testimonials.length) % testimonials.length
      );
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <section
      id="testimonials"
      className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-6 sm:mb-8 md:mb-10 transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 leading-tight px-2">
            4,847 Families Saved Crores
          </h2>
          <div className="w-20 sm:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full"></div>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto px-2">
          {/* Navigation Arrows */}
          <button
            onClick={goToPrev}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg items-center justify-center hover:bg-orange-50 hover:scale-110 transition-all duration-300 border border-gray-200"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
          </button>

          <button
            onClick={goToNext}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg items-center justify-center hover:bg-orange-50 hover:scale-110 transition-all duration-300 border border-gray-200"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
          </button>

          {/* Carousel Container */}
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={
                mounted
                  ? {
                      transform: `translateX(-${currentTestimonial * 100}%)`,
                    }
                  : {}
              }
            >
              {testimonials.map((testimonial, i) => (
                <div
                  key={i}
                  className={`w-full flex-shrink-0 bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 ${
                    i === currentTestimonial
                      ? "scale-100 opacity-100"
                      : "scale-95 opacity-0"
                  }`}
                >
                  <div className="md:flex">
                    {/* Before/After Images */}
                    <div className="md:w-1/2 h-48 sm:h-56 md:h-auto relative group">
                      <div className="absolute inset-0 flex">
                        <div className="w-1/2 relative overflow-hidden">
                          <Image
                            src={testimonial.beforeImage || "/placeholder.svg"}
                            alt="Before"
                            fill
                            className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <span className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-black/80 text-white px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded-md backdrop-blur-sm">
                            BEFORE
                          </span>
                        </div>
                        <div className="w-1/2 relative overflow-hidden border-l-2 border-white">
                          <Image
                            src={testimonial.afterImage || "/placeholder.svg"}
                            alt="After"
                            fill
                            className="object-cover transition-all duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                          <span className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-green-600/90 text-white px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded-md backdrop-blur-sm">
                            AFTER
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-between">
                      {/* Verified Badge */}
                      <div className="mb-3 sm:mb-4">
                        <span className="inline-flex items-center gap-1 sm:gap-1.5 text-xs font-semibold text-green-700 bg-green-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-green-200">
                          <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          Verified Customer
                        </span>
                      </div>

                      {/* Quote */}
                      <div className="mb-4 sm:mb-6">
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 leading-relaxed">
                          &quot;{testimonial.quote}&quot;
                        </p>
                      </div>

                      {/* Customer Info */}
                      <div className="flex items-center gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-gray-100">
                        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden ring-2 ring-orange-200 ring-offset-2 flex-shrink-0">
                          <Image
                            src={testimonial.image || "/placeholder.svg"}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm sm:text-base text-gray-900 truncate">
                            {testimonial.name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">
                            {testimonial.location} • {testimonial.apartmentType}
                          </p>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mt-3 sm:mt-4">
                        {[...Array(5)].map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${
                              idx < testimonial.rating
                                ? "fill-orange-500 text-orange-500"
                                : "fill-gray-200 text-gray-200"
                            } transition-all duration-300`}
                            style={{ animationDelay: `${idx * 50}ms` }}
                          />
                        ))}
                        <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm font-semibold text-gray-700">
                          {testimonial.rating}.0
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrentTestimonial(i);
                    setIsTransitioning(false);
                  }, 300);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentTestimonial
                    ? "bg-orange-500 w-8"
                    : "bg-gray-300 w-2 hover:bg-gray-400"
                }`}
                aria-label={`View testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-6 sm:mt-8 md:mt-10 px-2">
          <button
            onClick={() => {
              setSelectedPackage(499);
              setIsWizardOpen(true);
            }}
            className="w-full sm:w-auto inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg sm:rounded-xl text-base sm:text-lg font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
          >
            I Want to Save Too
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
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
