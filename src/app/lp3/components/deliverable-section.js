// src\app\lp3\components\deliverable-section.js
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown, Download, Star, Phone, Mail, MapPin } from 'lucide-react';

export function DeliverableSection() {
  const [openDeliverable, setOpenDeliverable] = useState('3d-renders');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="deliverables" className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-8 sm:mb-10 md:mb-12 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 text-gray-900 leading-tight">
            Exactly What You Get
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-2 px-2">
            Everything you need to bring your dream home to life – without guesswork
          </p>
          <div className="w-20 sm:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full"></div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {/* 3D Renders Section - Open by default */}
          <div className={`bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 ${openDeliverable === '3d-renders' ? 'shadow-xl border-orange-200' : 'hover:shadow-md'}`}>
            <button
              onClick={() => setOpenDeliverable(openDeliverable === '3d-renders' ? '' : '3d-renders')}
              className="w-full flex items-center justify-between p-4 sm:p-6 md:p-8 hover:bg-gray-50 transition-all duration-300 group"
            >
              <div className="text-left flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg flex-shrink-0">
                  3D
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-0.5 sm:mb-1">3D Renders</h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base">8-10 photorealistic views</p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 sm:w-6 sm:h-6 text-orange-500 transition-all duration-300 flex-shrink-0 ${openDeliverable === '3d-renders' ? 'rotate-180' : ''} group-hover:scale-110`}
              />
            </button>

            {openDeliverable === '3d-renders' && (
              <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 animate-in slide-in-from-top-2 duration-300">
                <div className="md:grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 flex md:flex-none overflow-x-auto snap-x snap-mandatory scrollbar-hide md:overflow-visible -mx-2 md:mx-0 px-2 md:px-0">
                  {[
                    { name: 'Master Bedroom', image: '/images/master-bedroom.png' },
                    { name: 'Living Room', image: '/images/living-room.png' },
                    { name: 'Kids Bedroom', image: '/images/kids-room.png' },
                    { name: 'Kitchen', image: '/images/kitchen.png' }
                  ].map((render, i) => (
                    <div
                      key={i}
                      className="relative aspect-video rounded-xl overflow-hidden min-w-[85vw] md:min-w-0 snap-center mr-4 md:mr-0 group cursor-pointer transform transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      <Image
                        src={render.image}
                        alt={render.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 40vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                        <p className="text-white font-bold text-lg md:text-xl">{render.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-center text-gray-600 mt-6 text-sm md:text-base">
                  The image you see above are produced directly by the Houspire platform - they are not borrowed or referenced visuals.
                </p>
              </div>
            )}
          </div>

          {/* Budget Section */}
          <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 ${openDeliverable === 'budget' ? 'shadow-xl border-orange-200' : 'hover:shadow-md'}`}>
            <button
              onClick={() => setOpenDeliverable(openDeliverable === 'budget' ? '' : 'budget')}
              className="w-full flex items-center justify-between p-6 md:p-8 hover:bg-gray-50 transition-all duration-300 group"
            >
              <div className="text-left flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  ₹
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Budget</h3>
                  <p className="text-gray-600 text-sm md:text-base">Item-by-item breakdown</p>
                </div>
              </div>
              <ChevronDown
                className={`w-6 h-6 text-orange-500 transition-all duration-300 ${openDeliverable === 'budget' ? 'rotate-180' : ''} group-hover:scale-110`}
              />
            </button>
            {openDeliverable === 'budget' && (
              <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 animate-in slide-in-from-top-2 duration-300">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 shadow-sm">
                  <p className="text-center text-orange-900 font-semibold text-xs sm:text-sm md:text-base leading-relaxed">
                    💡 This is YOUR project budget that you pay to vendors directly.<br />
                    <span className="text-orange-600 font-bold">You pay Houspire only ₹499 for the design package!</span>
                  </p>
                </div>
                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 overflow-x-auto shadow-inner border border-gray-200">
                  <table className="w-full min-w-[400px] sm:min-w-[500px]">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 sm:py-4 px-2 sm:px-3 md:px-4 text-gray-700 font-bold text-sm sm:text-base">Item</th>
                        <th className="text-right py-3 sm:py-4 px-2 sm:px-3 md:px-4 text-gray-700 font-bold text-sm sm:text-base">Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { item: 'Modular Kitchen (8×10)', cost: '₹1,85,000' },
                        { item: 'Living Room Sofa Set', cost: '₹65,000' },
                        { item: 'Master Bedroom Setup', cost: '₹85,000' },
                        { item: 'TV Unit & Entertainment', cost: '₹35,000' },
                        { item: 'Dining Table (6-seater)', cost: '₹45,000' }
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 sm:py-4 px-2 sm:px-3 md:px-4 text-gray-700 text-xs sm:text-sm">{row.item}</td>
                          <td className="text-right py-3 sm:py-4 px-2 sm:px-3 md:px-4 font-bold text-green-600 text-base sm:text-lg">{row.cost}</td>
                        </tr>
                      ))}
                      <tr className="bg-gradient-to-r from-green-50 to-green-100 border-t-2 border-green-300">
                        <td className="py-3 sm:py-4 px-2 sm:px-3 md:px-4 font-bold text-gray-900 text-base sm:text-lg">Total Estimate</td>
                        <td className="text-right py-3 sm:py-4 px-2 sm:px-3 md:px-4 font-bold text-green-600 text-xl sm:text-2xl">₹4,15,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-center text-gray-600 mt-3 sm:mt-4 text-xs sm:text-sm">Every rupee accounted for • No surprises</p>
                <a href='/de3986c3-f0b0-45cb-ae46-bbe6cda9cd21.pdf' download="Houspire-Budget" className="mt-4 sm:mt-6 mx-auto flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform">
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  Download Full Breakdown
                </a>
              </div>
            )}
          </div>

          {/* Vendors Section */}
          <div className={`bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 ${openDeliverable === 'vendors' ? 'shadow-xl border-orange-200' : 'hover:shadow-md'}`}>
            <button
              onClick={() => setOpenDeliverable(openDeliverable === 'vendors' ? '' : 'vendors')}
              className="w-full flex items-center justify-between p-4 sm:p-6 md:p-8 hover:bg-gray-50 transition-all duration-300 group"
            >
              <div className="text-left flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-0.5 sm:mb-1">Vendors</h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base">5-10 verified contacts</p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 sm:w-6 sm:h-6 text-orange-500 transition-all duration-300 flex-shrink-0 ${openDeliverable === 'vendors' ? 'rotate-180' : ''} group-hover:scale-110`}
              />
            </button>

            {openDeliverable === 'vendors' && (
              <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 animate-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  {[
                    { name: 'Sharma Kitchen Solutions', category: 'Modular Kitchens', rating: 4.8, city: 'Bangalore', phone: '+91 98765 43210', email: 'sharma@kitchens.in' },
                    { name: 'Gupta Furnishings', category: 'Sofas & Beds', rating: 4.7, city: 'Mumbai', phone: '+91 98765 43211', email: 'gupta@furnish.com' },
                    { name: 'Royal Decor', category: 'False Ceiling', rating: 4.9, city: 'Delhi', phone: '+91 98765 43212', email: 'royal@decor.in' },
                    { name: 'Elite Lighting Co.', category: 'Lights & Fixtures', rating: 4.6, city: 'Pune', phone: '+91 98765 43213', email: 'elite@lighting.com' }
                  ].map((vendor, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-br from-white to-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-gray-200 hover:border-orange-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                      <div className="flex justify-between items-start mb-3 sm:mb-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-base sm:text-lg md:text-xl text-gray-900 mb-1">{vendor.name}</h4>
                          <p className="text-xs sm:text-sm text-gray-600">{vendor.category}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-yellow-200 flex-shrink-0 ml-2">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-xs sm:text-sm text-gray-700">{vendor.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 flex-shrink-0" />
                        <span>{vendor.city}</span>
                      </div>
                      <div className="space-y-2 bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
                        <a
                          href={`tel:${vendor.phone}`}
                          className="flex items-center gap-2 text-xs sm:text-sm text-green-700 font-semibold hover:text-green-800 transition-colors blur-sm"
                        >
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{vendor.phone}</span>
                        </a>
                        <a
                          href={`mailto:${vendor.email}`}
                          className="flex items-center gap-2 text-xs sm:text-sm text-green-700 font-semibold hover:text-green-800 transition-colors blur-sm"
                        >
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{vendor.email}</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-center text-gray-600 mt-4 sm:mt-6 text-xs sm:text-sm md:text-base px-2">
                  Direct contact info • Verified vendors • No middleman markup • Houspire takes Zero commission
                </p>
              </div>
            )}
          </div>

          {/* Specs Section */}
          <div className={`bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 ${openDeliverable === 'specs' ? 'shadow-xl border-orange-200' : 'hover:shadow-md'}`}>
            <button
              onClick={() => setOpenDeliverable(openDeliverable === 'specs' ? '' : 'specs')}
              className="w-full flex items-center justify-between p-4 sm:p-6 md:p-8 hover:bg-gray-50 transition-all duration-300 group"
            >
              <div className="text-left flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg flex-shrink-0">
                  📋
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-0.5 sm:mb-1">Specs</h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base">Exact product codes</p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 sm:w-6 sm:h-6 text-orange-500 transition-all duration-300 flex-shrink-0 ${openDeliverable === 'specs' ? 'rotate-180' : ''} group-hover:scale-110`}
              />
            </button>

            {openDeliverable === 'specs' && (
              <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 animate-in slide-in-from-top-2 duration-300">
                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-gray-200 shadow-inner">
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      { title: 'Kitchen: Modular Units', details: 'Hardware: Hettich • Laminate: Greenply GLM-3922', price: 'Est: ₹1,850/sq ft' },
                      { title: 'Sofa: 3-Seater Contemporary', details: 'Brand: Urban Ladder Milano UL-SF-2847 • Fabric: Premium Velvet', price: 'Est: ₹45,000' },
                      { title: 'Master Bed: Queen Size', details: 'Brand: Pepperfry Milano King MB-KG-899 • Material: Sheesham Wood', price: 'Est: ₹35,000' },
                      { title: 'Dining Table: 6-Seater', details: 'Brand: Urban Ladder Malabar DT-ML-678 • Material: Mango Wood + Metal', price: 'Est: ₹28,000' }
                    ].map((spec, i) => (
                      <div
                        key={i}
                        className={`pb-3 sm:pb-4 ${i < 3 ? 'border-b border-gray-200' : ''}`}
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0 shadow-sm"></div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm sm:text-base md:text-lg text-gray-900 mb-1">{spec.title}</p>
                            <p className="text-xs sm:text-xs md:text-sm text-gray-600 leading-relaxed mb-1.5 sm:mb-2">{spec.details}</p>
                            <p className="text-xs sm:text-sm md:text-base text-green-600 font-bold">{spec.price}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-center text-xs sm:text-sm md:text-base text-gray-600 mt-3 sm:mt-4 px-2">
                  Exact product codes mean zero confusion with vendors
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}